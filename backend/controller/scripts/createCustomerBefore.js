const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');

async function createCustomerBefore(reqUser, data, dependencies, smsService) {

    data.credite_amount = 0;
    data.debt_amount = 0;

    // throw dependencies.exceptionHandling.throwError("sell can be confirmed by administrator and finance only!", 500);
    if(Utils.roleCheck(reqUser.Roles, [UserRoles.Sells])) {
        data.type = "customer";
    } else {
        data.type = "vendor"
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createCustomerBefore;