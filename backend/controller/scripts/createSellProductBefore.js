const { v4: uuidv4 } = require('uuid');

async function createSellProductBefore(reqUser, data, dependencies, smsService) {

    let found_sell = await dependencies.databasePrisma.sell.findFirst({
        where: {
            sys_id: data.sell_id,
            store_id: data.store_id,
            status: "draft"
        }
    });

    if(!found_sell) {
        throw dependencies.exceptionHandling.throwError("sell order not found!", 500);
    }

    let found_item = await dependencies.databasePrisma.product.findFirst({
        where: {
            sys_id: data.product_id
        }
    });
    
    if(!found_item) {
        throw dependencies.exceptionHandling.throwError("product to be sold not found!", 500);
    }
    
    let found_store_item = await dependencies.databasePrisma.store_product.findFirst({
        where: {
            store_id: data.store_id,
            product_id: data.product_id,
            quantity: {gte: data.quantity}
        }
    });
    
    if(!found_store_item || (found_store_item.quantity == 0) || (found_store_item.quantity < data.quantity)) {
        throw dependencies.exceptionHandling.throwError("Product quantity in the store is below the required quantity!", 500);
    }

    data.unit_price = found_item.unit_price;
    data.total_price = (parseFloat(found_item.unit_price) * parseFloat(data.quantity));

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createSellProductBefore;