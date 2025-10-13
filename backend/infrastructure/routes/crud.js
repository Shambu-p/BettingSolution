const express = require("express");
const AuthService = require("../service/authentication/auth");
const prisma = require("@prisma/client");
const SMSService = require("../service/SMS/SMSservice");
const ChangePassword = require("../../controller/ChangePassword");
const DefaultController = require("../../controller/DefaultController");
const RoleBasedValidator = require("../service/authentication/RoleBasedValidator");
const AccessRoleTypes = require("../../Interface/AccessRoleTypes");
const fieldRules = require("../../configuration/fieldRules");
const reportConfiguration = require("../../configuration/reportConfig");

module.exports = class Crud {

    dependencies;
    router;
    smsService;

    constructor(deps) {
        this.dependencies = deps;
        this.router = express.Router();
        this.smsService = new SMSService(deps);
    }

    getRoute() {

        // const controllers = Controller(this.dependencies);

        /**
         * @swagger
         * /create:
         *   post:
         *     summary: Get a list of users
         *     description: Retrieve a list of users from the database.
         *     responses:
         *       200:
         *         description: Successful response with a list of users.
         */
        this.router.post("/create", AuthService.authenticate, async (req, res, next) => {

            try {

                if (!req.body.tableName) {
                    throw this.dependencies.exceptionHandling.throwError("requestBody must contain tableName property", 400);
                }

                if (!req.body.data) {
                    throw this.dependencies.exceptionHandling.throwError("requestBody must contain data property", 400);
                }

                let { tableName, data } = req.body;
                let model = await prisma.Prisma.ModelName[tableName];

                if (!model) {
                    throw this.dependencies.exceptionHandling.throwError("table not found", 404);
                }

                let validation_result = RoleBasedValidator.checkAccessOnTable(tableName, req.user, AccessRoleTypes.writeRole);
                if (validation_result) {
                    await this.dependencies.routingValidator.validateRecord(tableName, data, false);

                    // let record;
                    // if(controllers[tableName] && controllers[tableName].create) {
                    //     record = await controllers[tableName].create(req.user, data, this.dependencies, this.smsService);
                    // }else {
                    //     record = await DefaultController.create(req.user, tableName, data, this.dependencies);
                    // }

                    let record = await DefaultController.create(req.user, tableName, data, this.dependencies, this.smsService);
                    return res.status(200).json(record);

                } else {
                    throw this.dependencies.exceptionHandling.throwError("you don't have access on the specified table!", 403);
                }

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode){
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }

        });

        this.router.get("/getform/:table/:id", AuthService.authenticate, async (req, res, next) => {

            const { relation } = req.query;

            try {
           
                if (!req.params.table) {
                    throw this.dependencies.exceptionHandling.throwError("requestParms must contain table property", 400);
                }
                if (!req.params.id) {
                    throw this.dependencies.exceptionHandling.throwError("requestParms must contain id property", 400);
                }

                let model = await prisma.Prisma.ModelName[req.params.table];
                if (!model) {
                    throw this.dependencies.exceptionHandling.throwError("table not found", 404);
                }

                let validation_result = RoleBasedValidator.checkAccessOnTable(req.params.table, req.user, AccessRoleTypes.readRole);
                if(!validation_result) {
                    throw this.dependencies.exceptionHandling.throwError("you don't have read access on the specified table!", 403);
                }
                // let record;
                // if(controllers[req.params.table] && controllers[req.params.table].get) {
                //     record = await controllers[req.params.table].get(req.user, req.params.id, this.dependencies, this.smsService, type);
                // } else {
                //     record = await DefaultController.getSingle(req.params.table, req.params.id, this.dependencies, type);
                // }

                let record = await DefaultController.getSingle(req.user, req.params.table, req.params.id, this.dependencies, relation);
                return res.status(200).json(record);
                
            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode){
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }
        });

        this.router.post("/getlist/:tableName/:PageNumber/:PageSize", AuthService.authenticate, async (req, res, next) => {

            let { relation } = req.query;

            try {

                let model = await prisma.Prisma.ModelName[req.params.tableName];

                if (!model) {
                    throw this.dependencies.exceptionHandling.throwError("table not found", 404);
                }

                let orderBy = [];

                if(req.body.sort) {

                    for (let key in req.body.sort) {
                        orderBy.push({
                            [key]: req.body.sort[key]
                        });
                    }

                }

                let access_check = RoleBasedValidator.checkAccessOnTable(req.params.tableName, req.user);

                if(!access_check) {
                    throw this.dependencies.exceptionHandling.throwError("Current user does not have access on the current table!", 404);
                }

                let whereQuery = {}, include = {};

                let validator = new RoleBasedValidator(req.params.tableName, this.dependencies, req.user);
                let addition_condition = validator.prepareAdditionalFilter();

                console.log(`${req.params.tableName} conditions `, addition_condition);

                if(addition_condition) {
                    if(addition_condition.length == 1) {
                        whereQuery = { ...req.body.condition, ...addition_condition[0] };
                    } else if(addition_condition.length > 1) {
                        whereQuery = { ...req.body.condition, AND: addition_condition };
                    }
                } else {
                    whereQuery = { ...req.body.condition }
                }

                if(relation && ["reference", "reference_children"].includes(relation)) {

                    if(fieldRules[req.params.tableName] && fieldRules[req.params.tableName].keys) {
                        let related_tables = fieldRules[req.params.tableName].keys;
    
                        related_tables.forEach(related_table => {
                            include[related_table.property] = true;
                        });
                    }

                }

                this.dependencies.logger(req.params.tableName, whereQuery);

                const totalCount = await this.dependencies.databasePrisma[req.params.tableName].findMany({
                    where: whereQuery,
                });

                let records = [];
                records = await this.dependencies.databasePrisma[req.params.tableName].findMany(
                    (parseInt(req.params.PageSize) > 0 && parseInt(req.params.PageNumber) > 0) ? ({
                        where: whereQuery,
                        orderBy: orderBy,
                        include: include,
                        take: parseInt(req.params.PageSize),
                        skip: (parseInt(req.params.PageNumber) - 1) * parseInt(req.params.PageSize)
                    }) : ({
                        where: whereQuery,
                        orderBy: orderBy,
                        include: include
                    })
                );

                return res.status(200).json({
                    Items: records,
                    PageNumber: req.params.PageNumber,
                    TotalCount: totalCount.length,
                    PageSize: parseInt(req.params.PageSize)
                });

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode){
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }

        });

        this.router.put("/update", AuthService.authenticate, async (req, res, next) => {

            try {

                let { tableName, data } = req.body;

                if (!tableName || !data) {
                    throw this.dependencies.exceptionHandling.throwError("table and data are required in the request body", 400);
                }

                let model = await prisma.Prisma.ModelName[tableName];

                if (!model) {
                    throw this.dependencies.exceptionHandling.throwError("table not found", 404);
                }

                if(!data.sys_id) {
                    throw this.dependencies.exceptionHandling.throwError("request body must atleast have an Id", 400);
                }

                let record;
                let validated = await this.dependencies.routingValidator.validateRecord(tableName, data);
                if (validated) {
                    // if(controllers[tableName] && controllers[tableName].update) {
                    //     record = await controllers[tableName].update(req.user, data, this.dependencies, this.smsService);
                    // } else {
                    //     record = await DefaultController.update(req.user, tableName, data, this.dependencies);
                    // }
                    record = await DefaultController.update(req.user, tableName, data, this.dependencies, this.smsService);
                }

                return res.status(200).json(record);

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode){
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }

        });

        this.router.put("/changePassword", AuthService.authenticate, async (req, res, next) => {

            try {

                let { oldPassword, newPassword, id } = req.body;

                if (!id) {
                   throw this.dependencies.exceptionHandling.throwError("data object must contain 'id' property", 400);
                }
                if (!oldPassword) {
                    throw this.dependencies.exceptionHandling.throwError("data object must contain 'oldPassword' property", 400);
                }
                if (!newPassword) {
                    throw this.dependencies.exceptionHandling.throwError("data object must contain 'newPassword' property", 400);
                }

                let record = await ChangePassword(req.user, id, oldPassword, newPassword, this.dependencies);
                return res.status(200).json(record);

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode){
                    return res.status(error.statusCode).json({ message: error.message })
                } else {
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }

        });

        this.router.post("/delete", AuthService.authenticate, async (req, res, next) => {
            try {

                let { tableName, id } = req.body;

                if(!id || !tableName) {
                    throw this.dependencies.exceptionHandling.throwError("request body must have a data and table properties", 400);
                }

                if(!id) {
                    throw this.dependencies.exceptionHandling.throwError("request body must atleast have an Id", 400);
                }

                let model = await prisma.Prisma.ModelName[tableName];

                if (!model) {
                    throw this.dependencies.exceptionHandling.throwError("table not found", 404);
                }

                let validation_result = RoleBasedValidator.checkAccessOnTable(tableName, req.user, AccessRoleTypes.deleteRole);
                if (!validation_result) {
                    throw this.dependencies.exceptionHandling.throwError("you don't have access on the specified table!", 403);
                }

                let record;
                // if(controllers[tableName] && controllers[tableName].delete) {
                //     record = await controllers[tableName].delete(req.user, Array.isArray(id) ? id : [id], req.body.condition, this.dependencies, this.smsService);
                // } else {
                //     record = await DefaultController.deleteRecords(tableName, Array.isArray(id) ? id : [id], this.dependencies);
                // }
                record = await DefaultController.deleteRecords(req.user, tableName, Array.isArray(id) ? id : [id], this.dependencies);

                return res.status(200).json({
                    status: 200,
                    message: "record deleted succesfully",
                    ...record
                });

            }
            catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode) {
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }
        });

        this.router.get("/get_report_config", AuthService.authenticate, async (req, res, next) => {
            try {

                return res.status(200).json(reportConfiguration(req.user));

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode) {
                    return res.status(error.statusCode).json({ message: error.message })
                }else{
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }
        });

        return this.router;

    }

}

