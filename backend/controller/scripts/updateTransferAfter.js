const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');

async function updateTransferAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");

    if(is_status_changed && data.status == "store_approved" && ["waiting_store_approval", "draft"].includes(is_status_changed.old_value)) {

        let faildItems = [], successItems = [];

        let found_transfer_items = await dependencies.databasePrisma.transfer_product.findMany({
            where: {
                transfer_id: data.sys_id
            }
        });

        let found_store_items = await dependencies.databasePrisma.store_product.findMany({
            where: {
                store_id: data.store_from_id
            }
        });

        for(let consumption of found_transfer_items) {
            let found_item = found_store_items.find(st => (st.product_id == consumption.product_id));

            if(found_item.quantity >= consumption.quantity) {

                successItems.push({
                    ...found_item,
                    quantity: (found_item.quantity - consumption.quantity)
                });

            } else {
                faildItems.push(consumption.sys_id);
            }

        }

        if(faildItems.length > 0) {
            await dependencies.databasePrisma.transfer_product.updateMany({
                where: {
                    sys_id: data.sys_id
                },
                data: {
                    status: "waiting_store_approval"
                }
            });
            throw dependencies.exceptionHandling.throwError(`Not enough quantity found in the store `, 500);
        }

        for(let item of successItems) {
            await DefaultController.update(
                SystemUser,
                "store_product",
                item,
                dependencies,
                smsService
            );
        }

        // notify the receiver store manager about new approved transfer
        // Find the receiver store manager
        const workers = await dependencies.databasePrisma.user_store.findMany({
            where: {
                store_id: data.store_to_id
            },
            include: {
                Worker: true
            }
        });

        for(let worker of workers) {
            await smsService.sendSMS(
                worker.Worker.phone,
                `A sell order with the number #${data.transfer_number} has been approved by store and will arrive soon.`
            );
        }

    } else if(is_status_changed && data.status == "received" && is_status_changed.old_value == "store_approved") {

        let product_items = await dependencies.databasePrisma.transfer_product.findMany({
            where: {
                transfer_id: data.sys_id
            }
        });

        let found_transfer_items = [];
        let search_result;

        for(let prod_item of product_items) {
            search_result = found_transfer_items.findIndex((value) => (prod_item.product_id == value.product_id));
            if(!search_result || search_result > -1) {
                found_transfer_items[search_result] = {
                    ...found_transfer_items[search_result],
                    quantity: (found_transfer_items[search_result].quantity + prod_item.quantity)
                }
            } else {
                found_transfer_items.push(prod_item);
            }
        }

        let found_store_items = await dependencies.databasePrisma.store_product.findMany({
            where: {
                store_id: data.store_to_id
            }
        });

        for(let finishedProduct of found_transfer_items) {
            let found_item = found_store_items.find(st => (st.product_id == finishedProduct.product_id));

            if(found_item) {

                await DefaultController.update(
                    SystemUser,
                    "store_product",
                    {
                        ...found_item,
                        store_id: data.store_to_id,
                        quantity: (found_item.quantity + finishedProduct.quantity)
                    },
                    dependencies,
                    smsService
                );

            } else {

                await DefaultController.create(
                    SystemUser,
                    "store_product",
                    {
                        product_id: finishedProduct.product_id,
                        level_state: "normal",
                        store_id: data.store_to_id,
                        quantity: finishedProduct.quantity
                    },
                    dependencies,
                    smsService
                );

            }

        }

    }

    return data;

}

module.exports = updateTransferAfter;