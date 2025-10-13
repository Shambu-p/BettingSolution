const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');

async function updateSellBefore(reqUser, data, changes, dependencies, smsService) {

    let is_number_changed = changes.find(change => change.column == "sell_number");
    if(is_number_changed) {
        throw dependencies.exceptionHandling.throwError("number cannot be changed once created!", 500);
    }

    if(!data.total_price) {
        data.total_price = 0;
    }

    if(!data.discount) {
        data.discount = 0;
    }

    if(!data.paid_price) {
        data.paid_price = 0;
    }

    if(!data.remaining_price) {
        data.remaining_price = 0;
    }

    if(!data.tax_amount) {
        data.tax_amount = 0;
    }

    let is_status_changed = changes.find(change => change.column == "status");
    if(is_status_changed && is_status_changed.new_value == "sold" && is_status_changed.old_value == "draft") {

        if(!Utils.roleCheck(reqUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells])) {
            throw dependencies.exceptionHandling.throwError("sell can be confirmed by administrator and finance only!", 500);
        }

        // if(!data.sold_by) {
        //     throw dependencies.exceptionHandling.throwError("sold by is necessary!", 500);
        // }

        let before_tax = (((100 - data.discount)/100) * data.total_price);
        let tax_price = (0.15 * before_tax);

        if(data.has_receipt) {
            data.tax_amount = tax_price;
        } else {
            data.tax_amount = 0;
        }

        data.remaining_price = before_tax + tax_price;
        data.sold_date = (new Date()).toISOString();

    }

    if(is_status_changed && is_status_changed.new_value == "delivery_assigned" && is_status_changed.old_value == "sold") {

        if(!data.delivery_id) {
            throw dependencies.exceptionHandling.throwError("delivery is necessary! delivery field must be filled", 500);
        }

    }

    if(is_status_changed && is_status_changed.new_value == "delivered") {

        if(!["sold", "on_the_way"].includes(is_status_changed.old_value)) {
            throw dependencies.exceptionHandling.throwError("sold by is necessary!", 500);
        }

    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateSellBefore;