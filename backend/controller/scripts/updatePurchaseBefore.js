const { v4: uuidv4 } = require('uuid');
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function updatePurchaseBefore(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find(change => change.column == "status");
    if(is_status_changed && data.status == "confirmed" && !Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.BranchManager])) {
        throw dependencies.exceptionHandling.throwError("Purchase can only be confirmed by Branch Manager or Administrators", 500);
    }

    if(data.status == "confirmed" && is_status_changed) {
        data.approved_by = reqUser.sys_id;
        data.remained_amount = data.total_price;
        data.paid_amount = 0;
    }

    if(is_status_changed && is_status_changed.old_value == "confirmed" && is_status_changed.new_value != "paid") {
        throw dependencies.exceptionHandling.throwError("confirmed purchase cannot be reversed!", 500);
    }

    if(is_status_changed && is_status_changed.old_value == "paid") {
        throw dependencies.exceptionHandling.throwError("paid purchase cannot be reversed!", 500);
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updatePurchaseBefore;