const FieldsMapper = require("../../infrastructure/FieldMapper");
const UserRoles = require("../../Interface/UserRoles");

module.exports = async function (reqUser, input, dependencies, smsService) {

    if(reqUser.Roles[0] != UserRoles.Admin && reqUser.Id != input.sys_id) {
        throw this.dependencies.exceptionHandling.throwError("Unauthorized Access!", 404);
    }

    const foundUser = await dependencies.databasePrisma.user.findFirst({
        where: {
            sys_id: input.sys_id
        }
    });

    if(!foundUser) {
        throw dependencies.exceptionHandling.throwError("record not found.", 404);
    }

    // if (!reqUser.Roles.includes("admin") && foundUser.id != reqUser.id) {
    //     throw dependencies.exceptionHandling.throwError("Unauthorized access! Only the admin and the user owning the record can update it.", 401);
    // }

    const userData = FieldsMapper.mapFields(input, "user");

    let changes = FieldsMapper.identifyChanges(foundUser, userData);
    userData.password = foundUser.password;
    userData.created_on = foundUser.created_on;
    userData.updated_on = new Date().toISOString();

    changes.forEach(change => {
        if(change.column == "level") {
            userData.level = (reqUser.Roles[0] == UserRoles.Admin) ? change.new_value : change.old_value;
        } else if(change.column == "role") {
            userData.role = (reqUser.Roles[0] == UserRoles.Admin) ? change.new_value : change.old_value;
        } else if(change.column == "refering_number") {
            userData.role = change.old_value;
        }
    });

    return await dependencies.databasePrisma.user.update({
        where: {
            id: input.id
        },
        data: userData,
    });

}