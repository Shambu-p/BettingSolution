const { v4: uuidv4 } = require('uuid');


async function updateProductAfter(reqUser, data, changes, dependencies, smsService) {

    let is_price_changed = changes.find(change => change.column == "unit_price");

    if(is_price_changed) {

        let found_products = await dependencies.databasePrisma.store_product.findMany({
            where: {
                product_id: data.product_id
            }
        });

        for(let store_product of found_products) {

            await dependencies.databasePrisma.store_product.update({
                where: {
                    sys_id: store_product.sys_id
                },
                data: {
                    total_price: (data.unit_price * store_product.quantity)
                }
            });
            
        }

        // await smsService.sendSMS(found_store.managedBy.phone, `New purchase ${data.purchase_number} approval is waiting for your response. please check and items when arrived and confirm.`);

    }

    return data;

}

module.exports = updateProductAfter;