const fieldRules = require("../../configuration/fieldRules");
const SystemUser = require("../../controller/auth/SystemUser");
const SMSService = require("../service/SMS/SMSservice");
const fs = require('fs');


class FlowActions {

    dependencies;
    processId;
    smsService;

    constructor(process_id, deps) {
        this.dependencies = deps;
        this.processId = process_id;
        this.smsService = new SMSService(deps);
    }

    getProcessFlow() {
        let process_data = this.getProcessData();
        return process_data.flow_record;
    }

    getProcessVariable(variable_name) {
        let process_data = this.getProcessData();
        return process_data.variables[variable_name];
    }

    getOutPutData() {
        let process_data = this.getProcessData();
        return process_data.outPutData;
    }

    setProcessVariable(variable_name, variable_value) {
        let process_data = this.getProcessData()
        process_data.variables[variable_name] = variable_value;
        this.updateProcessData(process_data);
    }

    setOutPutData(data_value) {
        let process_data = this.getProcessData()
        process_data.outPutData = data_value;
        this.updateProcessData(process_data);
    }

    getTriggerData() {
        return this.getProcessData().trigger_data;
    }

    startState(state_name) {
        let process_data = this.getProcessData();
        process_data.current_state = state_name;
        this.updateProcessData(process_data);
    }

    completeState(state_name) {
        let process_data = this.getProcessData();
        process_data.completed_states.push(state_name);
        this.updateProcessData(process_data);
    }

    isCompleted(state_name) {
        let process_data = this.getProcessData();
        return process_data.completed_states.includes(state_name);
    }

    async changeProcessState(state_name) {
        this.dependencies.logger(`//////////////////////////// change process state to ${state_name}.`);
        this.dependencies.logger(`//////////////////////////// process id: ${this.processId}.`);

        // let process_record = FlowManager.getProcessRecord(this.processId);
        let process_data = this.getProcessData(this.processId);
        let process_record = process_data.process_record;

        const controller = require("../../controller/DefaultController");
        const smsNotification = new SMSService(deps);
        await controller.update(SystemUser, "process", {
            sys_id: process_record.sys_id,
            flow_id: process_record.flow_id,
            started_on: process_record.started_on,
            finished_on: process_record.finished_on,
            created_on: process_record.created_on,
            updated_on: process_record.updated_on,
            updated_by: process_record.updated_by,
            created_by: process_record.created_by,
            state: state_name
        }, this.dependencies, smsNotification);
    }

    getProcessData() {
        let filePath = `./Runtime/ProcessData/${this.processId}.json`;
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath));
        }
        return null;
    }

    updateProcessData(updated_data) {
        let filePath = `./Runtime/ProcessData/${this.processId}.json`;
        fs.writeFileSync(filePath, JSON.stringify(updated_data));
    }

    /**
     * 
     * @param {number} seconds 
     * @returns {Promise<void>}
     */
    async delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds));
    }

    async createRecord(table_name, record) {
        const DefaultController = require("../../controller/DefaultController");
        return await DefaultController.create(SystemUser, table_name, record, this.dependencies, this.smsService);
    }

    async updateRecord(table_name, record_id, record) {
        const DefaultController = require("../../controller/DefaultController");
        return await DefaultController.update(SystemUser, table_name, record_id, record, this.dependencies, this.smsService);
    }

    async deleteRecord(table_name, record_id) {
        const DefaultController = require("../../controller/DefaultController");
        return await DefaultController.delete(SystemUser, table_name, record_id, this.dependencies, this.smsService);
    }

    async getRecord(table_name, record_id, relation = "none") {

        let include = {};

        if(relation && ["reference", "reference_children"].includes(relation)) {

            if(fieldRules[table_name] && fieldRules[table_name].keys) {
                let related_tables = fieldRules[table_name].keys;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });
            }

        }

        if(relation && ["children", "reference_children"].includes(relation)) {

            if(fieldRules[table_name] && fieldRules[table_name].children) {
                let related_tables = fieldRules[table_name].children;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });
            }

        }

        return await this.dependencies.databasePrisma[table_name].findFirst({
            where: {
                sys_id: record_id
            },
            include
        });

    }

    async getRecords(table_name, where, relation = "none") {

        let include = {};

        if(relation && ["reference", "reference_children"].includes(relation)) {

            if(fieldRules[table_name] && fieldRules[table_name].keys) {
                let related_tables = fieldRules[table_name].keys;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });
            }

        }

        return await this.dependencies.databasePrisma[table_name].findMany({
            where,
            include
        });

    }

}

module.exports = FlowActions;