const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');

async function createAPIUserBefore(reqUser, data, dependencies, smsService) {


    let key = uuidv4();
    data.api_key = key.replaceAll("-", "");
    data.api_secret = uuidv4();

    // let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
    //     where: {
    //         name: "transfer_number"
    //     }
    // });

    // if(!found_auto_number) {
    //     throw new Error("auto number for transfer not found!");
    // }

    // data.status = 'draft';
    // data.transfer_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;

    // await dependencies.databasePrisma.auto_number.update({
    //     data: {
    //         current_number: Utils.incrementStringNumber(found_auto_number.current_number)
    //     },
    //     where: {
    //         name: "transfer_number"
    //     }
    // });

    // if(reqUser.Roles.includes(UserRoles.Sells) && !reqUser.Stores.includes(data.store_from_id)) {
    //     throw dependencies.exceptionHandling.throwError("You can only take out from stores managed by your self", 500);
    // }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createAPIUserBefore;