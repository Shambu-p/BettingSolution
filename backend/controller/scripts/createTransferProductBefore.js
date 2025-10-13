const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

async function createTransferProductBefore(reqUser, data, dependencies, smsService) {

    let found_transfer = await dependencies.databasePrisma.transfer.findFirst({
        where: {
            sys_id: data.transfer_id,
            status: "draft"
        }
    });
    
    if(!found_transfer) {
        throw dependencies.exceptionHandling.throwError("Transfer request for transfer item not found!", 500);
    }

    let found_product_instore = await dependencies.databasePrisma.store_product.findMany({
        where: {
            store_id: found_transfer.store_from_id,
            product_id: data.product_id
        }
    });

    let total_quantity = found_product_instore.reduce((acc, item) => acc + item.quantity, 0);

    if(total_quantity < data.quantity) {
        throw dependencies.exceptionHandling.throwError("Not enough quantity found in the store!", 500);
    }

    let found_item = await dependencies.databasePrisma.product.findFirst({
        where: {
            sys_id: data.product_id
        }
    });

    if(!found_item) {
        throw dependencies.exceptionHandling.throwError("Product price defination not found!", 500);
    }

    data.total_price = (parseFloat(found_item.unit_price) * parseFloat(data.quantity));
    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createTransferProductBefore;