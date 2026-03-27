const { v4: uuidv4 } = require('uuid');

async function updateChargerTrxBefore(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find((ch) => ch.column == "status");
    let is_charge_amount_changed = changes.find((ch) => ch.column == "charge_amount");

    if(is_status_changed) {
        if(is_status_changed.old_value == "preparing") {
            if(!["stopped", "charging"].includes(data.status)) {
                throw dependencies.exceptionHandling.throwError("Status can only be changed from preparing to charging or finished!", 500);
            }
        } else if(is_status_changed.old_value == "charging") {
            if(!["stopped", "paused"].includes(data.status)) {
                throw dependencies.exceptionHandling.throwError("Status can only be changed from charging to paused or finished!", 500);
            }
        } else if(is_status_changed.old_value == "paused") {
            if(!["charging", "stopped"].includes(data.status)) {
                throw dependencies.exceptionHandling.throwError("Status can only be changed from paused to charging or finished!", 500);
            } else if(is_charge_amount_changed) {
                throw dependencies.exceptionHandling.throwError("Charge amount cannot be changed when transaction is paused!", 500);
            }
        } else if(is_status_changed.old_value == "stopped") {
            throw dependencies.exceptionHandling.throwError("Status cannot be changed after transaction is stopped!", 500);
        }
    } 

    if(!is_status_changed && data.status != "charging") {
        if(is_charge_amount_changed) {
            throw dependencies.exceptionHandling.throwError("Charge amount cannot be changed when transaction is not charging!", 500);
        }
    }

    if(is_charge_amount_changed && ((is_status_changed && is_status_changed.old_value == "charging") || data.status == "charging")) {

        if(!is_charge_amount_changed.old_value || is_charge_amount_changed.old_value <= data.charge_amount) {
            data.total_payment = data.charge_amount * 15;
        } else {
            throw dependencies.exceptionHandling.throwError("Charge amount cannot decrease", 500);
        }

    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateChargerTrxBefore;