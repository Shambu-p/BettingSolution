const { v4: uuidv4 } = require('uuid');
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');

async function updateTransferBefore(reqUser, data, changes, dependencies, smsService) {

    let prod_number_field = changes.find((ch) => ch.column == "transfer_number");
    if(prod_number_field) {
        data.transfer_number = prod_number_field.old_value;
    }

    let status_field = changes.find((ch) => ch.column == "status");

    if((status_field && status_field.old_value == "received") || (status_field && status_field.old_value == "store_approved" && data.status != "received")) {

        throw dependencies.exceptionHandling.throwError("incorrect flow of operation!", 500);

    } else if(status_field && data.status == "waiting_store_approval" && !(Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.Finance]))) {

        throw dependencies.exceptionHandling.throwError("Only Administrators and Finance can request item out!", 500);

    // } else if(status_field && data.status == "on_the_way" && !(Utils.roleCheck(reqUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance]))) {

    //     throw dependencies.exceptionHandling.throwError("Only Store Managers and Sells can load items and send!", 500);
        
    // } else if(status_field && data.status == "waiting_to_be_received") {

    //     if(!(reqUser.Stores.includes(data.store_from_id)) && !(Utils.roleCheck(reqUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance]))) {
    //         throw dependencies.exceptionHandling.throwError("Only Store Managers from sender can change to this state!", 500);
    //     }

    } else if(status_field && data.status == "store_approved" && status_field.old_value == "waiting_store_approval") {

        if(!reqUser.Stores.includes(data.store_from_id) || !Utils.roleCheck(reqUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance, UserRoles.Admin])) {
            throw dependencies.exceptionHandling.throwError("Only Specifically eligible users are allowed to approve store item out!", 500);
        }

        data.approved_by = reqUser.sys_id;
        data.started_on = (new Date()).toISOString();

    } else if(status_field && data.status == "received" && status_field.old_value == "store_approved") {

        if(!reqUser.Stores.includes(data.store_to_id) || !Utils.roleCheck(reqUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance, UserRoles.Admin])) {
            throw dependencies.exceptionHandling.throwError("Only Specifically eligible users are allowed to receive items!", 500);
        }

        data.accepted_by = reqUser.sys_id;
        data.finished_on = (new Date()).toISOString();

    } else if(status_field && data.status == "cancelled" && (data.cancel_reason == null || data.cancel_reason == undefined || data.cancel_reason == "")) {
        throw dependencies.exceptionHandling.throwError("Cancellation reason is necessary to cancel transfer", 500);
    } else if(status_field && data.status == "cancelled") {

        if((!reqUser.Stores.includes(data.store_to_id) && !reqUser.Stores.includes(data.store_from_id) && !Utils.roleCheck(reqUser.Roles, [UserRoles.Admin]))) {
            throw dependencies.exceptionHandling.throwError("You are not allowed to cancel this transfer!", 500);
        }

    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

};

module.exports = updateTransferBefore;