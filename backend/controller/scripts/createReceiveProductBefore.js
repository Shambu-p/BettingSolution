const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

async function createReceiveProductBefore(reqUser, data, dependencies, smsService) {


    let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
        where: {
            name: "receive_product_number"
        }
    });
    
    if(!found_auto_number) {
        throw new Error("auto number for receiving slip not found!");
    }

    data.status = 'draft';
    data.slip_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;

    await dependencies.databasePrisma.auto_number.update({
        data: {
            current_number: Utils.incrementStringNumber(found_auto_number.current_number)
        },
        where: {
            name: "receive_product_number"
        }
    });

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createReceiveProductBefore;