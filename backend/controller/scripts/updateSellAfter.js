const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');

async function updateSellAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");

    if(is_status_changed && data.status == "sold" && is_status_changed.old_value == "draft") {
        
        let found_sell_products = await dependencies.databasePrisma.sell_product.findMany({
            where: {
                sell_id: data.sys_id,
                store_id: data.store_id
            }
        });

        let found_store_items = await dependencies.databasePrisma.store_product.findMany({
            where: {
                store_id: data.store_id
            }
        });
        
        let found_item;

        for(let sell of found_sell_products) {

            found_item = found_store_items.find(st => (st.product_id == sell.product_id));

            if(found_item && found_item.quantity >= sell.quantity) {

                await DefaultController.update(
                    SystemUser,
                    "store_product",
                    {
                        ...found_item,
                        quantity: (found_item.quantity - sell.quantity)
                    },
                    dependencies,
                    smsService
                );

            }

        }

        await DefaultController.create(SystemUser, "transaction", {
            category: TransactionCategory.sell,
            type: TransactionType.credit,
            status: true,
            amount: data.remaining_price,
            sell_id: data.sys_id
        }, dependencies, smsService);

        if(data.discount && data.discount > 0) {

            await DefaultController.create(SystemUser, "transaction", {
                category: TransactionCategory.otherExpence,
                type: TransactionType.debit,
                status: true,
                amount: (data.total_price * (data.discount/100)),
                remark: `${data.discount}% = ${data.total_price - data.remaining_price}ETB discount made for sell ${data.sell_number} `
            }, dependencies, smsService);

        }

        if(data.tax_amount && data.tax_amount > 0) {
            await DefaultController.create(SystemUser, "transaction", {
                category: TransactionCategory.tax,
                type: TransactionType.credit,
                status: true,
                amount: data.tax_amount,
                remark: `Tax Deduction for ${data.sell_number}`,
                sell_id: data.sys_id
            }, dependencies, smsService);
        }

    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateSellAfter;