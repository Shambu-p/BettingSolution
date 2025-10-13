const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');

async function updateReceiveProductBefore(reqUser, data, changes, dependencies, smsService) {

    let prod_number_field = changes.find((ch) => ch.column == "slip_number");
    if(prod_number_field) {
        data.slip_number = prod_number_field.old_value;
    }

    let status_field = changes.find((ch) => ch.column == "status");

    if((status_field && status_field.old_value == "receive_confirmed") || (status_field && status_field.old_value == "draft" && data.status != "waiting_acceptance")) {
        throw dependencies.exceptionHandling.throwError("incorrect status flow!", 500);
    }

    if(status_field && data.status == "receive_cancelled" && (!data.cancel_reason || data.cancel_reason == "")) {
        throw dependencies.exceptionHandling.throwError("Cancellation reason is necessary to cancel receive", 500);
    }

    if(status_field && data.status == "receive_confirmed" && Utils.roleCheck(reqUser.Roles, [UserRoles.BranchManager, UserRoles.Admin])) {
        data.received_on = (new Date()).toISOString();
        data.received_by = reqUser.sys_id;
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

};

module.exports = updateReceiveProductBefore;