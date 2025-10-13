
const ProjectDependencies = require("../../../configuration/dependencies");
const UserRoles = require("../../../Interface/UserRoles");
   
const AuthService = {

    invalidatedTokens : new Set(),
    
    async authenticate(req, res, next){
        try {

            const dependencies = new ProjectDependencies();
                
            if(!req.headers.authorization){

                req.user = {
                    Id: "empty",
                    Roles: [ UserRoles.Guest ],
                };

            } else {
                const token = req.headers.authorization.split(" ")[1];
                const user = await dependencies.tokenGenerator.verify(token, dependencies.appSecretKey);/* as JwtPayload*/;
                req.user = user; 
            }
            next();

        } catch (error) {
            if(error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message })
            }else{
                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
    },

    async authenticateAPI(req, res, next) {
        try {

            const dependencies = new ProjectDependencies();
                
            if(req.query.api_key) {

                let apiUser = await dependencies.databasePrisma.api_user.findFirst({
                    where: {
                        api_key: req.query.api_key
                    },
                    include: {
                        allowedEndpoints: true
                    }
                });

                if (!apiUser) {
                    throw dependencies.exceptionHandling.throwError("API User not found", 404);
                }

                if(req.headers.authorization && apiUser.authentication_type == "key_secret") {

                    const token = req.headers.authorization.split(" ")[1];
                    const user = await dependencies.tokenGenerator.verify(token, apiUser.api_secret);
                    if(!user) {
                        throw dependencies.exceptionHandling.throwError("Authentication failed! Incorrect token structure!", 403);
                    }

                } else if(apiUser.authorization_type == "key_domain") {

                    const origin = req.get("origin");
                    const referer = req.get("referer");
                    const clientIP = req.ip.replace("::ffff:", ""); // normalize IPv4 from IPv6

                    console.log("api authetication .................................", origin, referer, clientIP);

                    // 2. Check Domain
                    if (origin) {
                        const domain = new URL(origin).hostname;
                        if (apiUser.domain_ip != domain) {
                            console.log("client origin and allowed domain not matched ", domain);
                            throw dependencies.exceptionHandling.throwError("Domain not allowed");
                        }
                    } else if (referer) {
                        const domain = new URL(referer).hostname;
                        if (apiUser.domain_ip != domain) {
                            console.log("referer and allowed domain not matched ", domain);
                            throw dependencies.exceptionHandling.throwError("Domain not allowed");
                        }
                    } else {

                        // 3. Check IP
                        if (apiUser.domain_ip != clientIP) {
                            throw dependencies.exceptionHandling.throwError("IP not allowed");
                        }

                    }



                } else {
                    throw dependencies.exceptionHandling.throwError("No Authentication method was detected!", 403);
                }

                req.user = apiUser;

            } else {
                throw dependencies.exceptionHandling.throwError("No Authentication method was detected!", 403);
            }

            next();

        } catch (error) {
            if(error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message })
            } else {
                return res.status(403).json({ message: "Authentication Failed!" })
            }
        }
    },

}

module.exports = AuthService;