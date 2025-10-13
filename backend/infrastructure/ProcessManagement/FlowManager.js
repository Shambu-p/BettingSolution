const SystemUser = require("../../controller/auth/SystemUser");
const DefaultController = require("../../controller/DefaultController");
const SMSService = require("../service/SMS/SMSservice");
const Utils = require("../service/Utils");
const FlowActions = require("./FlowActions");
const fs = require('fs');
const FlowExecuter = require("./FlowExecuter");

class FlowManager {

    dependencies;
    smsService;


    constructor(deps) {
        this.dependencies = deps;
        this.smsService = new SMSService(deps);
    }

    // type can be create or update
    /**
     * called from default controller to trigger record based flows
     * @param {string} type can be create or update
     * @param {string} table_id the table internal name
     * @param {any} record object of the record data
     */
    async fireRecordBased(type, table_id, record) {

        try {

            this.dependencies.logger(`triggering record based flow for table_id: ${table_id} and record: ${JSON.stringify(record.sys_id)}`);

            // fetch flow defination associated with the table_id
            let flows = await this.tableFlowDefinations(table_id, type);
            let meetFlows = [];

            // check if the record meet the criteria written in script.
            for (let flow of flows) {
                if (await FlowExecuter.executeTrigger(JSON.parse(flow.specification).trigger, flow.sys_id, record)) {
                    meetFlows.push(flow);
                }
            }

            // trigger the flows
            for (let flow of meetFlows) {

                let process = await this.createProcess(flow.sys_id);
                FlowManager.updateProcessData(process.sys_id, {
                    trigger_data: record,
                    process_record: process,
                    flow_record: flow,
                    variables: {},
                    current_state: "running",
                    completed_states: [],
                    error_log: []
                });

                let executor = new FlowExecuter(flow.sys_id, process.sys_id, JSON.parse(flow.specification), {
                    dependencies: this.dependencies,
                    sms: this.smsService
                });

                executor.start();

            }

        } catch(error) {
            this.dependencies.logger(`faild triggering record based flow for table_id: ${table_id} and record: ${JSON.stringify(record.sys_id)}`);
            this.dependencies.logger(error);
        }

    }

    async ManuallyFireRecordBasedFlow(table_id, record_id, flow_id) {

        this.dependencies.logger(`manually triggering record based flow for table_id: ${table_id} and record: ${record_id} using flow ${flow_id}`);

        // fetch flow defination associated with the table_id
        // trigger the flows
        let record = await this.dependencies.databasePrisma[table_id].findFirst({
            where: {
                sys_id: record_id
            }
        });

        let flow = await this.dependencies.databasePrisma.flow_defination.findFirst({
            where: {
                sys_id: flow_id
            }
        });

        let process = await this.createProcess(flow.sys_id);
        FlowManager.updateProcessData(process.sys_id, {
            trigger_data: record,
            process_record: process,
            flow_record: flow,
            variables: {},
            current_state: "running",
            completed_states: [],
            error_log: []
        });

        let trigger_result = await FlowExecuter.executeTrigger(JSON.parse(flow.specification).trigger, flow.sys_id, record);
        if (trigger_result) {

            let executor = new FlowExecuter(flow.sys_id, process.sys_id, JSON.parse(flow.specification), this.dependencies);
            await executor.start();

        } else {
            FlowManager.updateProcessData(process.sys_id, {
                trigger_data: record,
                process_record: process,
                flow_record: flow,
                variables: {},
                current_state: "running",
                completed_states: [],
                error_log: ["Does not meet the Triggering condition."]
            });
            await FlowManager.changeProcessState(process.sys_id, "failed", this.dependencies);
        }

        return process.sys_id;

    }

    async fireManualFlow(triggerData, flow_id) {

        this.dependencies.logger(`triggering sub flow with flow id ${flow_id}`);

        let flow = await this.dependencies.databasePrisma.flow_defination.findFirst({
            where: {
                sys_id: flow_id
            }
        });

        let process = await this.createProcess(flow.sys_id);
        FlowManager.updateProcessData(process.sys_id, {
            trigger_data: triggerData,
            process_record: process,
            flow_record: flow,
            variables: {},
            current_state: "running",
            completed_states: [],
            error_log: [],
            outPutData: {}
        });

        let executor = new FlowExecuter(flow.sys_id, process.sys_id, JSON.parse(flow.specification), this.dependencies, true);
        let result = await executor.start();

        return result;

    }

    async ManuallyTriggerSubFlow(triggerData, flow_id) {

        this.dependencies.logger(`triggering sub flow with flow id ${flow_id}`);

        let flow = await this.dependencies.databasePrisma.flow_defination.findFirst({
            where: {
                sys_id: flow_id
            }
        });

        let process = await this.createProcess(flow.sys_id);
        FlowManager.updateProcessData(process.sys_id, {
            trigger_data: triggerData,
            process_record: process,
            flow_record: flow,
            variables: {},
            current_state: "running",
            completed_states: [],
            error_log: [],
            outPutData: {}
        });

        let executor = new FlowExecuter(flow.sys_id, process.sys_id, JSON.parse(flow.specification), this.dependencies, true);
        await executor.start();

        return process.sys_id;

    }

    /**
     * called from main server.js file every 5 minutes
     * it will fetch all next run date passed flow_definations and trigger them.
     */
    async fireTimeBased() {

        try {

            this.dependencies.logger("/////////////////////////////// triggering time based flows");
            let flows = await this.nextToRunDefinations();
            let meetFlows = [];
            let dt = new Date();
            let timeout = 0;

            for(let flow of flows) {

                if(Utils.checkDate(dt.toISOString(), flow.next_run_date) >= 0) {
                    meetFlows.push(flow);
                    await this.updateFlowNextRunDate(
                        flow.sys_id,
                        await FlowExecuter.executeTrigger(JSON.parse(flow.specification).trigger, flow.sys_id, flow.next_run_date)
                    );
                } else {
                    await this.updateFlowNextRunDate(
                        flow.sys_id, 
                        await FlowExecuter.executeTrigger(JSON.parse(flow.specification).trigger, flow.sys_id, dt.toISOString())
                    );
                }

            }

            for (let flow of meetFlows) {

                let process = await this.createProcess(flow.sys_id);
                FlowManager.updateProcessData(process.sys_id, {
                    trigger_data: null,
                    process_record: process,
                    flow_record: flow,
                    variables: {},
                    current_state: "running",
                    completed_states: []
                });

                // calculate left time to next run
                timeout = (new Date(flow.next_run_date).getTime() - new Date().getTime());

                
                setTimeout(async () => {

                    let executor = new FlowExecuter(flow.sys_id, process.sys_id, JSON.parse(flow.specification), {
                        dependencies: this.dependencies,
                        sms: this.smsService
                    });

                    executor.start();

                }, timeout);

            }

        } catch(error) {
            this.dependencies.logger(`faild triggering time based flow`);
            this.dependencies.logger(error);
        }

    }

    async fireWaitingProcess(table_id, record) {

        try {

            this.dependencies.logger(`triggering waiting processes flow for table_id: ${table_id} and record: ${record.sys_id}`);

            // fetch flow defination associated with the table_id
            let flows = await this.getWaitingProcesses(record.sys_id, table_id);

            // check if the record meet the criteria written in script.
            for (let flow of flows) {

                FlowManager.setProcessVariable(flow.process_id, flow.variable_name, record);
                let flow_record = await FlowManager.getProcessFlow(flow.process_id);

                let executor = new FlowExecuter(
                    flow_record.sys_id,
                    flow_record.process_id,
                    JSON.parse(flow_record.specification),
                    {
                        dependencies: this.dependencies,
                        sms: this.smsService
                    }
                );

                executor.start();

            }

        } catch(error) {
            this.dependencies.logger(`faild triggering record based flow for table_id: ${table_id} and record: ${JSON.stringify(record.sys_id)}`);
            this.dependencies.logger(error);
        }

    }

    /**
     * this function will run the flow defination trigger script and get the next run date from the trigger script
     * @param {string} flow_id flow defination sys_id the flow should be time based and the trigger should return next run date time.
     */
    async getNextRunDate(flow_id, current_date_time) {

        let script_name = `../../controller/ProcessTrigger/${flow_id}`;
        let script_function = require(script_name);
        return await script_function(current_date_time, {
            dependencies: this.dependencies,
            sms: this.smsService
        });

    }

    /**
     * this function update flow record on flow defination table make sure the date is in future if it is in the past
     * this flow will never be triggered again.
     * @param {string} flow_id flow defination sys_id should be time based flow
     * @param {string} next_run_date iso time string of next run time of the given flow_id
     */
    async updateFlowNextRunDate(flow_id, next_run_date) {

        await this.dependencies.databasePrisma.flow_defination.update({
            where: {
                sys_id: flow_id
            },
            data: {
                next_run_date: next_run_date
            }
        });

    }

    /**
     * this function will update process data file with the process_id
     * @param {string} process_id process record sys_id
     * @param {any} updated_data data to be changed to string and saved in json file
     */
    static updateProcessData(process_id, updated_data) {
        let filePath = `./Runtime/ProcessData/${process_id}.json`;
        fs.writeFileSync(filePath, JSON.stringify(updated_data));
    }

    /**
     * this function find the file using the process_id and parse the json data from the file to object
     * @param {string} process_id process record sys_id
     */
    static getProcessData(process_id) {

        let filePath = `./Runtime/ProcessData/${process_id}.json`;
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath));
        }

    }

    static getProcessRecord(process_id) {

        let process_data = FlowManager.getProcessData(process_id);
        return process_data.process_record;
        
    }

    static getProcessFlow(process_id) {
        let process_data = FlowManager.getProcessData(process_id);
        return process_data.flow_record;
    }
    
    static getProcessVariable(process_id, variable_name) {
        let process_data = FlowManager.getProcessData(process_id);
        return process_data.variables[variable_name];
    }

    static setProcessVariable(process_id, variable_name, variable_value) {
        let process_data = FlowManager.getProcessData(process_id);
        process_data.variables[variable_name] = variable_value;
        FlowManager.updateProcessData(process_id, process_data);
    }

    static startState(process_id, state_name) {

        let process_data = FlowManager.getProcessData(process_id);
        process_data.current_state = state_name;
        FlowManager.updateProcessData(process_id, process_data);

    }

    static completeState(process_id, state_name) {

        let process_data = FlowManager.getProcessData(process_id);
        process_data.completed_states.push(state_name);
        FlowManager.updateProcessData(process_id, process_data);

    }

    static isCompleted(process_id, state_name) {

        let process_data = FlowManager.getProcessData(process_id);
        return process_data.completed_states.includes(state_name);

    }

    static async changeProcessState(process_id, state_name, deps) {

        // update process record in process table

        deps.logger(`//////////////////////////// change process state to ${state_name}.`);
        deps.logger(`//////////////////////////// process id: ${process_id}.`);

        let process_record = FlowManager.getProcessRecord(process_id);

        const controller = require("../../controller/DefaultController");
        const smsNotification = new SMSService(deps);
        await controller.update(SystemUser, "process", {
            ...process_record,
            state: state_name
        }, deps, smsNotification);

    }

    async createProcess(flow_id) {

        const controller = require("../../controller/DefaultController");
        return await controller.create(SystemUser, "process", {
            flow_id,
            state: "running",
            started_on: new Date().toISOString()
        }, this.dependencies, this.smsService);

    }

    /**
     * this function will fetch flow records from flow defination table with next run date is within the next 5 minutes
     */
    async nextToRunDefinations() {

        return await this.dependencies.databasePrisma.flow_defination.findMany({
            where: {
                initiation_type: "time_based",
                next_run_date: {
                    lte: new Date(new Date().getTime() + 2 * 60 * 1000).toISOString(),
                    // gte: new Date().toISOString()
                },
                active: true
            }
        });

    }

    /**
     * fetch all record based flow definations with the given table_id. 
     * @param {string} table_id table name to fetch flow with.
     */
    async tableFlowDefinations(table_id, environment) {

        return await this.dependencies.databasePrisma.flow_defination.findMany({
            where: {
                initiation_type: "record_based",
                table_id: table_id,
                trigger_environment: environment,
                active: true
            }
        });

    }

    /**
     * this function will fetch process records taht are waiting record associated with the record_id from witing process table.
     * @param {string} record_id record sys_id which the process is waiting
     * @param {string} table_id table internal name associated with the record_id
     */
    async getWaitingProcesses(record_id, table_id) {

        return await this.dependencies.databasePrisma.waiting_process.findMany({
            where: {
                record_id: record_id,
                table_id: table_id
            }
        });

    }

};

module.exports = FlowManager;