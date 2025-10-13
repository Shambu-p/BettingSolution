const { v4: uuidv4 } = require('uuid');

async function createUserBefore(reqUser, data, dependencies, smsService) {


    const numberChars = '0123456789';
    let password = 'password';

    // for (let i = 0; i < 8; i++) {
    //     password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    // }

    data.created_on = (new Date()).toISOString();
    data.updated_on = (new Date()).toISOString();
    data.password = await dependencies.encryption.hash(password);
    // data.refering_text = uuidv4();

    await smsService.sendSMS(data.phone, `Dear ${data.full_name} use your phone number to sign in to your account and the password is ${password}.`);
    return data;

}

module.exports = createUserBefore;