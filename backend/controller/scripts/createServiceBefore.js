const { v4: uuidv4 } = require('uuid');

function addMonthsToDate(date, months) {

    if (typeof months !== 'number') {
        throw new Error("Invalid months: Provide a valid number.");
    }

    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);

    return newDate.toISOString();
}

function addDaysToDate(date, days) {

    if (typeof days !== 'number') {
        throw new Error("Invalid months: Provide a valid number.");
    }

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    return newDate.toISOString();
}

async function createServiceBefore(reqUser, data, dependencies, smsService) {

    if(data.next_payment_date) {

        if((new Date(data.last_payment_date).getTime()) >= (new Date(data.next_payment_date).getTime()) || (new Date(data.next_payment_date).getTime() <= (new Date().getTime()))) {
            throw dependencies.exceptionHandling.throwError("next payment date cannot be before or as the same date as the last payment date or current date!", 500);
        }

    }

    let period = 1;

    switch(data.interval_type) {
        case "quarterly":
            period = 3;
        case "half_yearly":
            period = 6;
        case "yearly":
            period = 12;
        default:
            period = 1;
    }

    if(!data.next_payment_date) {
        data.next_payment_date = (data.interval_type == 'weekly' ? addDaysToDate(date.last_payment_date, 7) : addMonthsToDate(data.last_payment_date, period));
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createServiceBefore;