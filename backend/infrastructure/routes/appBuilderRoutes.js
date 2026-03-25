const express = require("express");

const fieldRules = require("../../configuration/fieldRules");
const SMSService = require("../service/SMS/SMSservice");
const fs = require("fs");
const UserRoles = require("../../Interface/UserRoles");
const TableDefinitionController = require("../AppBuilder/TableDefinitionController");
const AuthService = require("../service/authentication/auth");



class AppBuilderRoutes {

    dependencies;
    router;
    smsService;

    constructor(deps) {
        this.dependencies = deps;
        this.router = express.Router();
        this.smsService = new SMSService(deps);
    }

    getRoute() {

        this.router.post("/all_table", AuthService.authenticate, async (req, res, next) => {

            try {

                if (req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.AppBuilder)) {
                    res.status(200).json(await TableDefinitionController.getAll(req, res, next));
                } else {
                    res.status(403).json({ message: "Forbidden Access!" });
                }

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/table_list", AuthService.authenticate, async (req, res, next) => {

            try {

                if (req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.AppBuilder)) {
                    res.status(200).json(await TableDefinitionController.getForList());
                } else {
                    res.status(403).json({ message: "Forbidden Access!" });
                }

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/single_config", AuthService.authenticate, async (req, res, next) => {

            try {

                if (req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.AppBuilder)) {
                    res.status(200).json(await TableDefinitionController.getOne(req.query.app_id, req.query.table_id));
                } else {
                    res.status(403).json({ message: "Forbidden Access!" });
                }

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/def_create", AuthService.authenticate, async (req, res, next) => {

            try {

                if (!req.user.Roles.includes(UserRoles.Admin) && !req.user.Roles.includes(UserRoles.AppBuilder)) {
                    throw new Error("Forbidden Access!");
                }

                let found_auto_number = await this.dependencies.databasePrisma.auto_number.findFirst({
                    where: {
                        name: "backup_order"
                    }
                });

                if (!found_auto_number) {
                    throw new Error("auto number for backup order not found!");
                }

                const defination = req.body;
                defination.backup_order = parseInt(found_auto_number.current_number, 10);
                await TableDefinitionController.create(defination)

                await dependencies.databasePrisma.auto_number.update({
                    data: {
                        current_number: defination.backup_order + 1
                    },
                    where: {
                        name: "backup_order"
                    }
                });

                res.status(200).json("Table definition created successfully!");

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/def_update", AuthService.authenticate, async (req, res, next) => {

            try {

                if (!req.user.Roles.includes(UserRoles.Admin) && !req.user.Roles.includes(UserRoles.AppBuilder)) {
                    throw new Error("Forbidden Access!");
                }

                const defination = req.body;
                await TableDefinitionController.update(defination);

                res.status(200).json("Table definition updated successfully!");

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        return this.router;
    }
}

module.exports = AppBuilderRoutes;