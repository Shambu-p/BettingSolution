const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');

async function updateReceiveProductAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");

    if(is_status_changed && data.status == "receive_confirmed" && is_status_changed.old_value == "waiting_acceptance") {

        let found_production_items = await dependencies.databasePrisma.finished_product.findMany({
            where: {
                production_id: data.production_id,
                store_id: data.store_id,
                slip_id: data.sys_id
            }
        });

        let found_store_items = await dependencies.databasePrisma.store_product.findMany({
            where: {
                store_id: data.store_id
            }
        });

        // Group found_production_items by product_id and sum quantity
        const groupedProductionItems = Object.values(
            found_production_items.reduce((acc, item) => {
                if (!acc[item.product_id]) {
                    acc[item.product_id] = { ...item };
                } else {
                    acc[item.product_id].quantity += item.quantity;
                }
                return acc;
            }, {})
        );

        for(let finishedProduct of groupedProductionItems) {
            let found_item = found_store_items.find(st => (st.product_id == finishedProduct.product_id));

            if(found_item) {

                await DefaultController.update(
                    SystemUser,
                    "store_product",
                    {
                        ...found_item,
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
                        store_id: data.store_id,
                        quantity: finishedProduct.quantity
                    },
                    dependencies,
                    smsService
                );

            }

        }

        await DefaultController.create(SystemUser, "transaction", {
            category: TransactionCategory.production,
            type: TransactionType.debit,
            status: true,
            amount: groupedProductionItems.reduce((acc, curr) => (acc + curr.total_price), 0),
            production_id: data.production_id
        }, dependencies, smsService);

    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateReceiveProductAfter;