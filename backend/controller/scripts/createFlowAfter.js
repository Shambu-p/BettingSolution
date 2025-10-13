const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const fs = require('fs');

async function createFlowAfter(reqUser, data, dependencies, smsService) {

    // create flow trigger js file in controller/ProcessTrigger and flow script js file in controller/ProcessScript

    let trigger_file_content = "";
    let flow_script_content = `

        // flow script defination
        /**
         * this function will be called when the flow is triggered.
         * @param {string} process_id process record sys_id
         * @param {FlowActions} actions actions object to perform actions on the process
         * @param {any} optionalData optional data passed to the script
         */
        module.exports = async function(process_id, actions, optionalData) {

            // script content will go here

            await actions.delay(60000);
            await actions.changeProcessState("completed");
            optionalData.dependencies.logger("////////////////////////////////////////////////////////////// flow completed");

        };
    `;

    if(data.initiation_type == "time_based") {
        trigger_file_content = `

    // flow trigger defination
    /**
     * this function will be called when the flow is triggered.
     * @param {string} current_date_time current iso date time
     * @param {any} optionalData optional data passed to the script
     * @returns {string} next run date time
     */
    module.exports = async function(current_date_time, optionalData) {

        optionalData.dependencies.logger("next run date fetching ");
        // next run date should be 1 hour from now
        return new Date(new Date(current_date_time).getTime() + 60 * 60 * 1000).toISOString();

    };

`;
    } else if(data.initiation_type == "record_based") {
        trigger_file_content = `

    // flow trigger defination
    /**
     * this function will be called to check the flow meet the 
     * requirement to be trigger before the main flow script actually triggered.
     * @param {any} record trigger record object
     * @param {any} optionalData optional data passed to the script
     * @returns {boolean} true if the trigger record data meet the requirement
     */
    module.exports = async function(record, optionalData) {

        optionalData.dependencies.logger("trigger condition is being checked ");
        return false;

    };

`;
    }

    fs.writeFileSync(`./controller/ProcessTrigger/${data.sys_id}.js`, trigger_file_content);
    fs.writeFileSync(`./controller/ProcessScript/${data.sys_id}.js`, flow_script_content);

    return data;

}

module.exports = createFlowAfter;