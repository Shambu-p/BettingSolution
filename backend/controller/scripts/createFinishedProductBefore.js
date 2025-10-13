const { v4: uuidv4 } = require('uuid');

async function createFinishedProductBefore(reqUser, data, dependencies, smsService) {

    let found_production = await dependencies.databasePrisma.production.findFirst({
        where: {
            sys_id: data.production_id,
            store_id: data.store_id,
            status: "consumption_confirmed"
        }
    });
    
    if(!found_production) {
        throw dependencies.exceptionHandling.throwError("production to be added on not found!", 500);
    }

    let found_product = await dependencies.databasePrisma.product.findFirst({
        where: {
            sys_id: data.product_id
        }
    });
    
    if(!found_product) {
        throw new Error("product to be produced not found!");
    }

    // if(found_production.status != "consumption_confirmed") {
    //     throw dependencies.exceptionHandling.throwError("Production has not been started yet! produced items cannot be registered under production that has not been started!", 404);
    // }

    data.unit_price = found_product.unit_price;
    data.total_price = (parseFloat(found_product.unit_price) * parseInt(data.quantity));

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createFinishedProductBefore;