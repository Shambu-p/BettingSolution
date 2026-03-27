const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function updateChargerTrxAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");
    let is_charge_amount_changed = changes.find((ch) => ch.column == "charge_amount");

    if(is_charge_amount_changed || is_status_changed) {
        dependencies.emitJsonData("transaction_update", data.user_id, data);
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateChargerTrxAfter;