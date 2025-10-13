const { v4: uuidv4 } = require('uuid');
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function updateServiceBefore(reqUser, data, changes, dependencies, smsService) {

    
    if((new Date(data.last_payment_date).getTime()) >= (new Date(data.next_payment_date).getTime()) || (new Date(data.next_payment_date).getTime() <= (new Date().getTime()))) {
        throw dependencies.exceptionHandling.throwError("next payment date cannot be before or as the same date as the last payment date or current date!", 500);
    }
    
    let is_next_payment_date_changed = changes.find(change => change.column == "next_payment_date");
    if(is_next_payment_date_changed) {
        if((new Date(is_next_payment_date_changed.old_value).getTime()) >= (new Date(is_next_payment_date_changed.new_value).getTime())) {
            throw dependencies.exceptionHandling.throwError("next payment date cannot be before last value date set!", 500);
        }
        data.last_payment_date = (new Date()).toISOString();
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateServiceBefore;