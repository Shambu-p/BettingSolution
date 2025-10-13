const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function createTransferProductAfter(reqUser, data, dependencies, smsService) {

    let found_transfer = await dependencies.databasePrisma.transfer.findFirst({
        where: {
            sys_id: data.transfer_id,
            status: "draft"
        }
    });

    if(!found_transfer) {
        throw dependencies.exceptionHandling.throwError("Order not found!", 500);
    }

    let found_transfer_items = await dependencies.databasePrisma.transfer_product.findMany({
        where: {
            transfer_id: data.transfer_id,
            sys_id: {not: data.sys_id}
        }
    });

    let total_transfer_price = found_transfer_items.reduce((acc, currentItem) => (acc + currentItem.total_price), 0);
    total_transfer_price += data.total_price;

    await DefaultController.update(
        SystemUser, "transfer",
        {
            ...found_transfer,
            total_price: total_transfer_price
        },
        dependencies,
        smsService
    );

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createTransferProductAfter;