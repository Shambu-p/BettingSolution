
const express = require("express");

const fieldRules = require("../../configuration/fieldRules");
const SMSService = require("../service/SMS/SMSservice");
const MigrationManager = require("../DBManagement/MigrationManager");
const prisma = require("@prisma/client");

const seedData = require("../../configuration/seedData");
const fs = require("fs");
const DefaultController = require("../../controller/DefaultController");
const SystemUser = require("../../controller/auth/SystemUser");
const UserRoles = require("../../Interface/UserRoles");
const start_config = require("../../ecosystem.config.js")

class SystemRoute {

    dependencies;
    router;
    smsService;

    constructor(deps) {
        this.dependencies = deps;
        this.router = express.Router();
        this.smsService = new SMSService(deps);
    }

    getRoute() {

        this.router.get("/sync_db", async (req, res, next) => {

            try {

                let collections = Object.values(fieldRules);

                console.log("generating schema");
                MigrationManager.updateSchema(collections, `./prisma/schema.prisma`);

                console.log("saving backup");
                await MigrationManager.backupData("./Runtime/Backup", this.dependencies.databasePrisma, collections);

                console.log("migrating new schema");
                // let migration_name = uuidv4();
                // migration_name = migration_name.replace("-", "");
                let cmd_result = await MigrationManager.executeCommand(`npx prisma db push --force-reset --accept-data-loss`);
                console.log("migration result ", cmd_result);

                console.log(`cleaning the database!`);
                await MigrationManager.cleanDataForRestore(collections, this.dependencies.databasePrisma);

                console.log("restoring backup data");
                await MigrationManager.restoreBackupData("./Runtime/Backup", this.dependencies.databasePrisma, collections);
                res.status(200).json({
                    message: "success!"
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/restore_backup", async (req, res, next) => {

            try {

                let collections = Object.values(fieldRules);

                console.log(`cleaning the database!`);
                await MigrationManager.cleanDataForRestore(collections, this.dependencies.databasePrisma);

                console.log("restoring backup data");
                await MigrationManager.restoreBackupData("./Runtime/Backup", this.dependencies.databasePrisma, collections);
                res.status(200).json({
                    message: "success!"
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/backup_data", async (req, res, next) => {

            try {

                let collections = Object.values(fieldRules);

                console.log("saving backup");
                await MigrationManager.backupData("./Runtime/Backup", this.dependencies.databasePrisma, collections);
                await MigrationManager.archiveBackupFiles("./Runtime/Backup", "./Runtime");

                res.status(200).json({
                    message: "success!"
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/migrate_schema", async (req, res, next) => {

            try {

                console.log("migrating new schema");
                let cmd_result = await MigrationManager.executeCommand(`npx prisma db push --force-reset --accept-data-loss`);
                console.log("migration result ", cmd_result);

                res.status(200).json({
                    message: "success!"
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/update_schema", async (req, res, next) => {

            try {

                let collections = Object.values(fieldRules);

                console.log("generating schema");
                MigrationManager.updateSchema(collections, `./prisma/schema.prisma`);

                res.status(200).json({
                    message: "success!"
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/base_data", async (req, res, next) => {

            try {

                let collections = Object.values(fieldRules);
                res.status(200).json(collections);

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/seed_data", async (req, res, next) => {

            try {

                // for(let user of seedData.user) {
                //     await DefaultController.create(SystemUser, "user", user, this.dependencies, this.smsService);
                // }
                // for(let user of seedData.user) {
                //     await DefaultController.create(SystemUser, "user", user, this.dependencies, this.smsService);
                // }

                await this.dependencies.databasePrisma.user.createMany({
                    data: seedData.user
                });

                // await this.dependencies.databasePrisma.userRole.createMany({
                //     data: seedData.userrole
                // });

                await this.dependencies.databasePrisma.choice.createMany({
                    data: seedData.choice
                });

                res.status(200).json({message: "operation successful"});

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/change_db_name", async (req, res, next) => {

            try {

                if(!req.body.database_name) {
                    throw new Error("database name should be set.")
                }
                if(!req.body.user_name) {
                    throw new Error("database user name should be set.")
                }


                let server_config = `mysql://${req.body.user_name}:${req.body.password ? encodeURIComponent(req.body.password) : ""}@localhost:3306/${req.body.database_name}`;
                console.log("config file ", start_config.apps)
                start_config.apps[0].env.DATABASE_URL = server_config;

                fs.writeFileSync(
                    "./ecosystem.config.js",
                    `module.exports = ${JSON.stringify(start_config)}`,
                    'utf8'
                );
                fs.writeFileSync(
                    "./.env",
                    `
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# DATABASE_URL='mysql://abnet:Password123%3F@localhost:3306/db_name'

DATABASE_URL=${server_config}
`,
                    'utf8'
                );

                res.status(200).json({message: "operation successful"});

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/register_admin", async (req, res, next) => {

            try {

                if(!req.body.first_name) {
                    throw new Error("last_name should be set.")
                }
                if(!req.body.last_name) {
                    throw new Error("last_name should be set.")
                }

                if(!req.body.phone) {
                    throw new Error("phone number should be set.")
                }

                

                let newUser = await DefaultController.create(SystemUser, "user", {
                    phone: req.body.phone, 
                    full_name: (req.body.first_name + req.body.last_name), 
                    active: true, 
                    password: "password"
                }, this.dependencies, this.smsService);

                await DefaultController.create(SystemUser, "userRole", {
                    user_id: newUser.sys_id,
                    role: UserRoles.Admin,
                    active: true
                }, this.dependencies, this.smsService);
                res.status(200).json(newUser);

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/get_install_state", async (req, res, next) => {

            try {
                let installation_step = fs.readFileSync("./configuration/installationStatus.json", "utf8");
                res.status(200).json(JSON.parse(installation_step));
            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/update_install_state", async (req, res, next) => {

            try {

                fs.writeFileSync("./configuration/installationStatus.json", JSON.stringify(req.body));
                res.status(200).json({message: "operation successful"});

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        return this.router;

    }

}

module.exports = SystemRoute;