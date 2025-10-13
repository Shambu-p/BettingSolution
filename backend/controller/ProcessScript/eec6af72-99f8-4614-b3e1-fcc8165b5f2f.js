
// flow script defination
/**
 * this function will be called when the flow is triggered.
 * @param {string} process_id process record sys_id
 * @param {FlowActions} actions actions object to perform actions on the process
 * @param {any} optionalData optional data passed to the script
 */
module.exports = async function(process_id, actions, optionalData) {

    if(!actions.isCompleted("create_record")) {

        // let trigger_data = actions.getTriggerData();
        await actions.createRecord("post", {
            title: `process run ${new Date().toISOString()}`,
            description: `process run ${new Date().toISOString()}`
        });

        actions.completeState("create_record");

    }

    await actions.delay(10000);
    await actions.changeProcessState("completed");
    optionalData.dependencies.logger("////////////////////////////////////////////////////////////// flow completed");

};