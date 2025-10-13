const { v4: uuidv4 } = require('uuid');

async function createEndpointBefore(reqUser, data, dependencies, smsService) {

    data.fields = "[]";
    data.access_conditions = "[]";

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createEndpointBefore;