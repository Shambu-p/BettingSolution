const FieldsMapper = require("../infrastructure/FieldMapper");
const fieldRules = require("../configuration/fieldRules");
const RoleBasedValidator = require("../infrastructure/service/authentication/RoleBasedValidator");
const FlowManager = require("../infrastructure/ProcessManagement/FlowManager");
const UserRoles = require("../Interface/UserRoles");

const DefaultController = {
    create: async function (reqUser, table, data, dependencies, smsService) {

        const userData = FieldsMapper.mapFields(data, table);
        // console.log("mapped data ", userData);
        let loadRelated = await RoleBasedValidator.dataLoaderWithObject(table, userData, reqUser, dependencies);
        // console.log("realated records loaded ", loadRelated);
        let validator = new RoleBasedValidator(table, dependencies, reqUser, loadRelated);
        let condition_check = validator.checkConditionResult();

        if(!condition_check) {
            throw dependencies.exceptionHandling.throwError("Unauthorized access! operation failed!", 403);
        }

        let validation_result = await validator.validateCreate();

        validation_result.created_on = (new Date()).toISOString();
        validation_result.created_by = reqUser.Id;
        validation_result.updated_on = (new Date()).toISOString();
        validation_result.updated_by = reqUser.Id

        let before_result;
        let after_result;
        if(fieldRules[table].createScript && fieldRules[table].createScript.before) {
            let before_script_name = `./scripts/${fieldRules[table].createScript.before}`;
            let before_logic = require(before_script_name);
            before_result = await before_logic(reqUser, validation_result, dependencies, smsService);
        } else {
            before_result = validation_result
        }

        console.log("validation result ", before_result);

        let record = await dependencies.databasePrisma[table].create({
            data: before_result
        });

        let recordActivity = await dependencies.databasePrisma.activity.create({
            data: {
                description: `Record has been created!`,
                table_id: table,
                record_id: record.sys_id,
                created_by: reqUser.sys_id,
                created_on: (new Date()).toISOString(),
                updated_by: reqUser.sys_id,
                updated_on: (new Date()).toISOString()
            }
        });

        if(fieldRules[table].createScript && fieldRules[table].createScript.after) {
            let after_script_name = `./scripts/${fieldRules[table].createScript.after}`;
            let after_logic = require(after_script_name);
            after_result = await after_logic(reqUser, {...loadRelated, ...record}, dependencies, smsService);
        } else {
            after_result = record;
        }

        if(!["flow_defination", "waiting_process", "process"].includes(table)) {

            let manager = new FlowManager(dependencies);
            manager.fireRecordBased((reqUser.Roles.includes(UserRoles.System) ? "both" : "user_interaction_only"), table, after_result);

        }

        return after_result;

    },
    update: async function (reqUser, table, data, dependencies, smsService) {

        let foundRecord = await RoleBasedValidator.dataLoaderWithId(table, data.sys_id, reqUser, dependencies, true, true);

        if(!foundRecord) {
            throw dependencies.exceptionHandling.throwError("record not found.", 404);
        }

        // let changes = FieldsMapper.identifyChanges();

        // if(changes.length == 0) {
        //     throw dependencies.exceptionHandling.throwError("No change detected", 404);
        // }

        let validator = new RoleBasedValidator(table, dependencies, reqUser, foundRecord, data);
        let condition_check = validator.checkConditionResult(null, "updateAccessCondition");

        if(!condition_check) {
            throw dependencies.exceptionHandling.throwError("Unauthorized access! operation failed!", 403);
        }

        let validation_result = await validator.validate();

        let validatedData = {...data, ...validation_result};

        validatedData.updated_on = (new Date()).toISOString();
        validatedData.updated_by = reqUser.Id

        let before_result;
        let after_result;
        if(fieldRules[table].updateScript && fieldRules[table].updateScript.before) {
            let before_script_name = `./scripts/${fieldRules[table].updateScript.before}`;
            let before_logic = require(before_script_name);
            before_result = await before_logic(reqUser, validatedData, validator.Changes, dependencies, smsService);
        } else {
            before_result = validatedData;
        }

        let record = await dependencies.databasePrisma[table].update({
            data: before_result,
            where: {
                sys_id: before_result.sys_id
            }
        });

        if(validator.Changes.length > 0) {

            let changesDescription = 'Record Updated <br/>';
            validator.Changes.forEach((ch) => {
                if(!['created_on', "updated_on", "created_by", "updated_by"].includes(ch.column))
                changesDescription += `<br/>${ch.column}: ${ch.old_value} => ${ch.new_value}`;
            });
            
            let recordActivity = await dependencies.databasePrisma.activity.create({
                data: {
                    description: changesDescription,
                    table_id: table,
                    record_id: record.sys_id,
                    created_by: reqUser.sys_id,
                    created_on: (new Date()).toISOString(),
                    updated_by: reqUser.sys_id,
                    updated_on: (new Date()).toISOString()
                }
            });

        }

        if(fieldRules[table].updateScript && fieldRules[table].updateScript.after) {
            let after_script_name = `./scripts/${fieldRules[table].updateScript.after}`;
            let after_logic = require(after_script_name);
            after_result = await after_logic(reqUser, { ...foundRecord, ...record }, validator.Changes, dependencies, smsService);
        } else {
            after_result = record;
        }

        // if(validator.Changes.length > 0) {

        //     let manager = new FlowManager(dependencies);
        //     manager.fireWaitingProcess(table, after_result);

        // }

        return after_result;

    },
    getSingle: async function (reqUser, table_name, id, dependencies, relation) {

        let validator = new RoleBasedValidator(table_name, dependencies, reqUser);
        let additional_filter = validator.prepareAdditionalFilter();

        let condition;
        if(additional_filter) {
            if(additional_filter.length == 1) {
                condition = { sys_id: id, ...additional_filter[0] }
            } else if(additional_filter.length > 1) {
                condition = { sys_id: id, AND: additional_filter }
            }
        } else {
            condition = { sys_id: id }
        }

        let record = await RoleBasedValidator.dataLoaderWithCondition(table_name, condition, reqUser, dependencies, (relation && ["reference", "reference_children"].includes(relation)), (relation && ["children", "reference_children"].includes(relation)));
        if (!record) {
            throw dependencies.exceptionHandling.throwError("No record exist with the given id", 404);
        }

        return record;

    },
    getList: async function (table_name, condition, type) {

        // let loadRelated = await RoleBasedValidator.dataLoaderWithObject(table, userData, reqUser, dependencies);
        let include = {}

        if(type) {

            let keys = Object.keys(fieldRules[table_name].keys);
            keys.forEach(ky => {
                include[ky.table] = true;
            });

        }

        return {whereQuery: condition, include};
    
    },
    deleteRecords: async function (reqUser, table, id, dependencies) {

        // const foundRecords = await dependencies.databasePrisma[table].findMany({
        //     where: { sys_id: { in: id } }
        // });

        const foundRecords = await RoleBasedValidator.dataLoaderWithId(table, id, reqUser, dependencies, true);
        console.log(foundRecords, "found records");

        if (foundRecords.length == 0) {
            throw dependencies.exceptionHandling.throwError("record does not exist", 404);
        }

        let validator;
        let passed_ids = [];

        foundRecords.forEach(record => {

            validator = new RoleBasedValidator(table, dependencies, reqUser, record);
            let condition_check = validator.checkConditionResult(null, "deleteAccessCondition");

            if(condition_check) {
                passed_ids.push(record.sys_id);
            }

        });

        let before_result;
        let after_result;
        if(fieldRules[table].deleteScript && fieldRules[table].deleteScript.before) {
            let before_script_name = `./scripts/${fieldRules[table].deleteScript.before}`;
            let before_logic = require(before_script_name);
            before_result = await before_logic(reqUser, foundRecords.filter(fr => (passed_ids.includes(fr.sys_id))), dependencies, smsService);
        } else {
            before_result = passed_ids;
        }

        const result = await dependencies.databasePrisma[table].deleteMany({
            where: { sys_id: { in: before_result } }
        });

        if(fieldRules[table].deleteScript && fieldRules[table].deleteScript.after) {
            let after_script_name = `./scripts/${fieldRules[table].deleteScript.after}`;
            let after_logic = require(after_script_name);
            after_result = await after_logic(reqUser, foundRecords.filter(fr => (before_result.includes(fr.sys_id))), dependencies, smsService);
        } else {
            after_result = before_result;
        }

        return {
            found: foundRecords.filter(fr => (before_result.includes(fr.sys_id))),
            deleted: before_result
        };

    }
};

module.exports = DefaultController;