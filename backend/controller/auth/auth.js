const UserRoles = require("../../Interface/UserRoles");

module.exports = class AuthController {

    dependencies;

    constructor(deps){
        this.dependencies = deps;
    }


    async login({ phone, password }) {
        try {
             
            let user = await this.dependencies.databasePrisma.user.findFirst({
                where: {
                    phone: phone
                },
                include: {
                    roles: true,
                    WorksIn: true,
                    manageStores: true
                }
            });

            if (!user) {
                throw this.dependencies.exceptionHandling.throwError("User not found", 404);
            }

            const verifyPassword = await this.dependencies.encryption.compare(password, user.password);

            if (!verifyPassword) {
                throw this.dependencies.exceptionHandling.throwError("Incorrect password", 401);
            } else {

                let role = user.roles.map(rls => rls.role);
                let stores = user.WorksIn.map(rls => rls.store_id);
                let manages = user.manageStores.map(rls => rls.sys_id);
                const payload = { ...user, Id: user.sys_id, Roles: role, Stores: stores, Manages: manages, roles: undefined, WorksIn: undefined, manageStores: undefined };

                if(!role.includes(UserRoles.Admin) && !role.includes(UserRoles.Finance)) {
                    
                    if(payload.Stores.length == 0) {
                        throw this.dependencies.exceptionHandling.throwError("You Don't have access to any stores! please contact your manager.", 401);
                    }

                }

                const token = this.dependencies.tokenGenerator.generate(payload, this.dependencies.appSecretKey);
                return {
                    Token: token,
                    ...payload
                }

            }

        }

        catch (error) {
            this.dependencies.logger(error);
            if(error.statusCode){
                throw this.dependencies.exceptionHandling.throwError(error.message, error.statusCode);
            }else{
                throw this.dependencies.exceptionHandling.throwError(error.message, 500);
            }
        }

    }

    async logOut() {

    }
    
   
    async authenticate(req, res, next){
             try {

                const token = req.headers.authorization.split(" ")[1];
                const user = await getDep().tokenGenerator.verify(token, this.dependencies.appSecretKey);/* as JwtPayload*/;
                req.user = user;
            }
            catch (error) {  
                this.dependencies.logger(error);
                if(error.statusCode){
                    throw this.dependencies.exceptionHandling.throwError(error.message, error.statusCode);
                }else{
                    throw this.dependencies.exceptionHandling.throwError(error.message, 500);
                }   }
    
            next();
    }




}
