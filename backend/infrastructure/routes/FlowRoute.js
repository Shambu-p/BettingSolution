
const express = require("express");
const AuthService = require("../service/authentication/auth");
const UserRoles = require("../../Interface/UserRoles");
const fs = require("fs");
const FlowManager = require("../ProcessManagement/FlowManager");
const SMSService = require("../service/SMS/SMSservice");

class FlowRoute {

    dependencies;
    router;

    constructor(deps) {
        this.dependencies = deps;
        this.router = express.Router();
    }

    getRoute() {

        this.router.get("/get_scripts",  AuthService.authenticate, async (req, res, next) => {

            try {

                if(!(req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.System))) {
                    throw this.dependencies.exceptionHandling.throwError("Unauthorized access!", 403);
                }

                let flow_defination_id = req.query.id;

                // get flow trigger script and flow action script file file content
                let trigger_script = fs.readFileSync(`./controller/ProcessTrigger/${flow_defination_id}.js`, "utf8");
                let action_script = fs.readFileSync(`./controller/ProcessScript/${flow_defination_id}.js`, "utf8");

                res.status(200).json({
                    trigger_script,
                    action_script
                });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/update_scripts",  AuthService.authenticate, async (req, res, next) => {

            try {

                if(!(req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.System))) {
                    throw this.dependencies.exceptionHandling.throwError("Unauthorized access!", 403);
                }

                let flow_defination_id = req.body.id;
                let trigger_script = req.body.trigger_script;
                let action_script = req.body.action_script;

                // update flow trigger script and flow action script file file content
                fs.writeFileSync(`./controller/ProcessTrigger/${flow_defination_id}.js`, trigger_script);
                fs.writeFileSync(`./controller/ProcessScript/${flow_defination_id}.js`, action_script);

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

        this.router.post("/trigger_record_based_flow",  AuthService.authenticate, async (req, res, next) => {

            try {

                if(!(req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.System))) {
                    throw this.dependencies.exceptionHandling.throwError("Unauthorized access!", 403);
                }

                let manager = new FlowManager(this.dependencies);

                let execution_result = await manager.ManuallyFireRecordBasedFlow(req.body.table_id, req.body.record_id, req.body.flow_id);

                let process_data = FlowManager.getProcessData(execution_result);
                res.status(200).json(process_data);

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.post("/trigger_sub_flow",  AuthService.authenticate, async (req, res, next) => {

            try {

                if(!(req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.System))) {
                    throw this.dependencies.exceptionHandling.throwError("Unauthorized access!", 403);
                }

                let manager = new FlowManager(this.dependencies);

                let execution_result = await manager.ManuallyTriggerSubFlow(req.body.triggerData, req.body.flow_id);

                let process_data = FlowManager.getProcessData(execution_result);
                res.status(200).json(process_data);

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            }

        });

        this.router.get("/process_data",  AuthService.authenticate, async (req, res, next) => {

            try {

                if(!(req.user.Roles.includes(UserRoles.Admin) || req.user.Roles.includes(UserRoles.System))) {
                    throw this.dependencies.exceptionHandling.throwError("Unauthorized access!", 403);
                }

                if(!req.query.id) {
                    throw this.dependencies.exceptionHandling.throwError("Process data not found", 400);
                }

                let process_data = FlowManager.getProcessData(req.query.id);
                res.status(200).json(process_data);

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

module.exports = FlowRoute;