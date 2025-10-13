const UserRoles = require("../Interface/UserRoles");

module.exports = async function (reqUser, id, oldPassword, newPassword, dependencies) {

    try {

        const user = await dependencies.databasePrisma.user.findFirst({
            where: {
                sys_id: id
            }
        });

        if(!user) {
            throw dependencies.exceptionHandling.throwError("user not found.", 404);
        }

        if(!reqUser.Roles.includes(UserRoles.Admin) && user.sys_id != reqUser.sys_id) {
            throw dependencies.exceptionHandling.throwError("Unauthorized Access! Only the admin and the user owning the record can change a password.", 401); 
        }

        if(!reqUser.Roles.includes(UserRoles.Admin)) {

            let verification = await dependencies.encryption.compare(oldPassword, user.password);
            if(!verification) {
                throw dependencies.exceptionHandling.throwError("Old password does not match!", 401); 
            }

        }

        return await dependencies.databasePrisma.user.update({
            where: {
                sys_id: id
            },
            data: {
                password: await dependencies.encryption.hash(newPassword)
            }
        });

    } catch (error) {

        dependencies.logger(error);
        if(error.statusCode){
            throw dependencies.exceptionHandling.throwError(error.message, error.statusCode);
        }else{
            throw dependencies.exceptionHandling.throwError('Internal Server Error', 500);
        }

    }

}