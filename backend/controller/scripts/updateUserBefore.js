// const { v4: uuidv4 } = require('uuid');

async function updateUserBefore(reqUser, data, changes, dependencies, smsService) {

    
    let is_password_changed = changes.find(change => change.column == "password");
    
    if(is_password_changed) {
        throw dependencies.exceptionHandling.throwError("you should not change password here!", 500);
    }

    // await smsService.sendSMS(user.phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateUserBefore;