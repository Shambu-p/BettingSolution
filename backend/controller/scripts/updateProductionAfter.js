const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');

async function updateProductionAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");

    // if((is_status_changed && is_status_changed.old_value == "production_confirmed") || (is_status_changed && is_status_changed.old_value == "consumption_confirmed" && data.status != "waiting_production_approval")) {
    //     throw dependencies.exceptionHandling.throwError("incorrect status flow!", 500);
    // }

    if(is_status_changed && data.status == "consumption_confirmed" && is_status_changed.old_value == "waiting_consumption_approval") {

        let found_production_items = await dependencies.databasePrisma.production_consumption.findMany({
            where: {
                production_id: data.sys_id,
                store_id: data.store_id
            }
        });

        let found_store_items = await dependencies.databasePrisma.store_item.findMany({
            where: {
                store_id: data.store_id
            }
        });

        for(let consumption of found_production_items) {
            let found_item = found_store_items.find(st => (st.item_id == consumption.item_id));

            if(found_item.quantity >= consumption.quantity) {

                await DefaultController.update(
                    SystemUser,
                    "store_item",
                    {
                        ...found_item,
                        quantity: (found_item.quantity - consumption.quantity)
                    },
                    dependencies,
                    smsService
                );

            }

        }

        if(data.total_consumed_price > 0) {
            await DefaultController.create(SystemUser, "transaction", {
                category: TransactionCategory.production,
                type: TransactionType.credit,
                status: true,
                amount: data.total_consumed_price,
                production_id: data.sys_id
            }, dependencies, smsService);
        }

    }
    // else if(is_status_changed && data.status == "production_confirmed" && is_status_changed.old_value == "waiting_production_approval") {

    //     let found_production_items = await dependencies.databasePrisma.finished_product.findMany({
    //         where: {
    //             production_id: data.sys_id,
    //             store_id: data.store_id
    //         }
    //     });

    //     let found_store_items = await dependencies.databasePrisma.store_product.findMany({
    //         where: {
    //             store_id: data.store_id
    //         }
    //     });

    //     for(let finishedProduct of found_production_items) {
    //         let found_item = found_store_items.find(st => (st.product_id == finishedProduct.product_id));

    //         if(found_item) {

    //             await DefaultController.update(
    //                 SystemUser,
    //                 "store_product",
    //                 {
    //                     ...found_item,
    //                     quantity: (found_item.quantity + finishedProduct.quantity)
    //                 },
    //                 dependencies,
    //                 smsService
    //             );

    //         } else {

    //             await DefaultController.create(
    //                 SystemUser,
    //                 "store_product",
    //                 {
    //                     product_id: finishedProduct.product_id,
    //                     level_state: "normal",
    //                     store_id: data.store_id,
    //                     quantity: finishedProduct.quantity
    //                 },
    //                 dependencies,
    //                 smsService
    //             );

    //         }

    //     }

    //     await DefaultController.create(SystemUser, "transaction", {
    //         category: TransactionCategory.production,
    //         type: TransactionType.debit,
    //         status: true,
    //         amount: data.total_produced_price,
    //         production_id: data.sys_id
    //     }, dependencies, smsService);

    // }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateProductionAfter;