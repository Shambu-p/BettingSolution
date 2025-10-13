const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

async function createSellBefore(reqUser, data, dependencies, smsService) {

    let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
        where: {
            name: "sell_number"
        }
    });

    if(!found_auto_number) {
        throw new Error("auto number for purchase not found!");
    }

    if(!data.discount) {
        data.discount = 0;
    }

    if(!data.has_receipt) {
        data.has_receipt = false;
    }

    data.tax_percentage = 15;
    data.status = 'draft';
    data.total_price = 0;
    data.paid_price = 0;
    data.tax_amount = 0;
    data.remaining_price = 0;
    data.sell_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;

    await dependencies.databasePrisma.auto_number.update({
        data: {
            current_number: Utils.incrementStringNumber(found_auto_number.current_number)
        },
        where: {
            name: "sell_number"
        }
    });

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createSellBefore;