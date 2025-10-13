const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function createSellProductAfter(reqUser, data, dependencies, smsService) {

    let found_sell = await dependencies.databasePrisma.sell.findFirst({
        where: {
            sys_id: data.sell_id,
            store_id: data.store_id,
            status: "draft"
        }
    });

    if(!found_sell) {
        throw dependencies.exceptionHandling.throwError("Sell order on the store/branch/seller not found!", 500);
    }

    let found_sell_items = await dependencies.databasePrisma.sell_product.findMany({
        where: {
            sell_id: data.sell_id,
            sys_id: {not: data.sys_id}
        }
    });

    let total_sell_price = found_sell_items.reduce((acc, currentItem) => (acc + currentItem.total_price), 0);
    total_sell_price += data.total_price;

    await DefaultController.update(
        SystemUser, "sell",
        {
            ...found_sell,
            total_price: total_sell_price
        },
        dependencies,
        smsService
    );

    // await dependencies.databasePrisma.production.update({
    //     data: {
    //         ...found_production,
    //         total_consumed_price: production_total_consumption_price
    //     },
    //     where: {
    //         sys_id: found_production.sys_id
    //     }
    // });

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createSellProductAfter;