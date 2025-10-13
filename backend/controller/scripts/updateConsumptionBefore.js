const { v4: uuidv4 } = require('uuid');

async function updateConsumptionBefore(reqUser, data, changes, dependencies, smsService) {

    let found_production = await dependencies.databasePrisma.production.findFirst({
        where: {
            sys_id: data.production_id,
            store_id: data.store_id,
            status: "draft"
        }
    });
    
    if(!found_production) {
        throw dependencies.exceptionHandling.throwError("production to be added on not found!", 500);
    }

    // if(found_production.status != "draft") {
    //     throw dependencies.exceptionHandling.throwError("Consumption items can only be registered before production has been started!", 500);
    // }

    let found_item = await dependencies.databasePrisma.inventory_item.findFirst({
        where: {
            sys_id: data.item_id
        }
    });
    
    if(!found_item) {
        throw dependencies.exceptionHandling.throwError("Item to be consumed not found!", 500);
    }
    
    let found_store_item = await dependencies.databasePrisma.store_item.findFirst({
        where: {
            store_id: data.store_id,
            item_id: data.item_id
        }
    });
    
    if(!found_store_item || (found_store_item.quantity == 0) || (found_store_item.quantity < data.quantity)) {
        throw dependencies.exceptionHandling.throwError("Raw Material not found in the store!", 500);
    }

    data.unit_price = found_item.unit_price;
    data.total_price = (parseFloat(found_item.unit_price) * parseInt(data.quantity));

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateConsumptionBefore;