const FieldsMapper = require("../../infrastructure/FieldMapper");
const UserRoles = require("../../Interface/UserRoles");
const { v4: uuidv4 } = require('uuid');

module.exports = async function (reqUser, data, dependencies, smsService) {

    if(![UserRoles.Admin].includes(reqUser.Roles[0])) {
        throw dependencies.exceptionHandling.throwError("Unauthorized user!", 403);
    }

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[{]}|;:,<.>/?';

    const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;

    // let password = 'password';
    let password = '';
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    for (let i = 0; i < 4; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    let current_date = new Date().toISOString();

    // password = password.split('').sort(() => Math.random() - 0.5).join('');
    data.password = await dependencies.encryption.hash(password);
    data.created_on = current_date;
    data.updated_on = current_date;
    // data.refering_number = uuidv4();

    
    // const userData = new UserEntity(data);
    const userData = FieldsMapper.mapFields(data, "user");
    userData.role = data.role;

    let user = await dependencies.databasePrisma.user.create({
        data: userData
    });

    user.Password = password;

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return user;

}