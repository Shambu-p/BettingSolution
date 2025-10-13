const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');

async function updateProductionBefore(reqUser, data, changes, dependencies, smsService) {

    // let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
    //     where: {
    //         name: "production_number"
    //     }
    // });
    
    // if(!found_auto_number) {
    //     throw new Error("auto number for production not found!");
    // }

    // data.prod_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;

    let prod_number_field = changes.find((ch) => ch.column == "prod_number");
    let is_status_changed = changes.find((ch) => ch.column == "status");

    if(prod_number_field) {
        data.prod_number = prod_number_field.old_value;
    }

    if((is_status_changed && is_status_changed.old_value == "production_confirmed") || (is_status_changed && is_status_changed.old_value == "waiting_consumption_approval" && data.status != "consumption_confirmed")) {
        throw dependencies.exceptionHandling.throwError("incorrect status flow!", 500);
    }

    if((is_status_changed && is_status_changed.old_value == "consumption_confirmed" && data.status != "production_confirmed")) {
        throw dependencies.exceptionHandling.throwError("incorrect status flow!", 500);
    }

    
    if(is_status_changed && data.status == "production_cancelled") {

        if(!data.cancel_reason || data.cancel_reason == "") {
            throw dependencies.exceptionHandling.throwError("Cancellation reason is necessary to cancel production", 500);
        }

        if(!Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.BranchManager])) {
            throw dependencies.exceptionHandling.throwError("Only Branch managers or Administrators can cancell production", 500);
        }
    }

    if(is_status_changed && data.status == "production_cancelled" && (!data.cancel_reason || data.cancel_reason == "")) {
        throw dependencies.exceptionHandling.throwError("Cancellation reason is necessary to cancel production", 500);
    }

    if(is_status_changed && data.status == "consumption_confirmed") {

        if(!Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.BranchManager])) {
            throw dependencies.exceptionHandling.throwError("Only Administrators and Branch managers can confirm consumption.", 500);
        }

        data.started_on = (new Date()).toISOString();

    }

    if(is_status_changed && data.status == "production_confirmed") {
        if(!Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.ProductionManager])) {
            throw dependencies.exceptionHandling.throwError("Only Administrators and Production Managers can confirm consumption.", 500);
        }
        data.finished_on = (new Date()).toISOString();
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

};

module.exports = updateProductionBefore;