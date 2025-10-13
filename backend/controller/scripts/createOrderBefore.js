// Script to set initial values before creating an order
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');

async function createOrderBefore(reqUser, data, dependencies, smsService) {
    // Set status to 'requested' if not provided
    data.status = 'requested';

    // Set order_date to current date/time if not provided
    data.order_date = new Date().toISOString();

    // Set user_id to current user's sys_id if not provided
    data.user_id = reqUser.sys_id;

    // Set order_number using auto_number config 'client_order_number'
    let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
        where: {
            name: "client_order_number"
        }
    });
    if (!found_auto_number) {
        throw new Error("auto number for client_order_number not found!");
    }
    data.order_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;

    await dependencies.databasePrisma.auto_number.update({
        data: {
            current_number: Utils.incrementStringNumber(found_auto_number.current_number)
        },
        where: {
            name: "client_order_number"
        }
    });

    return data;
}

module.exports = createOrderBefore;
