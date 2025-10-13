const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function createConsumptionAfter(reqUser, data, dependencies, smsService) {

    let found_production = await dependencies.databasePrisma.production.findFirst({
        where: {
            sys_id: data.production_id,
            store_id: data.store_id
        }
    });
    
    if(!found_production) {
        throw dependencies.exceptionHandling.throwError("production store/branch not found!", 500);
    }

    if(found_production.status != "draft") {
        return data;
        // throw dependencies.exceptionHandling.throwError("only under draft production can consumption be registered!", 500);
    }

    let found_production_items = await dependencies.databasePrisma.production_consumption.findMany({
        where: {
            production_id: data.production_id,
            sys_id: {not: data.sys_id}
        }
    });

    let production_total_consumption_price = found_production_items.reduce((acc, currentItem) => (acc + currentItem.total_price), 0);
    production_total_consumption_price += data.total_price;

    await DefaultController.update(
        SystemUser,
        "production",
        {
            ...found_production,
            total_consumed_price: production_total_consumption_price
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

module.exports = createConsumptionAfter;