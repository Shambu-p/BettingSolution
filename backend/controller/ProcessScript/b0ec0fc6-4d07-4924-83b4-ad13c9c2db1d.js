

// flow script defination
/**
 * this function will be called when the flow is triggered.
 * @param {string} process_id process record sys_id
 * @param {FlowActions} actions actions object to perform actions on the process
 * @param {any} optionalData optional data passed to the script
 */
module.exports = async function(process_id, actions, optionalData) {

    // script content will go here update it

    await actions.delay(60000);
    await actions.changeProcessState("completed");
    optionalData.dependencies.logger("////////////////////////////////////////////////////////////// flow completed");

};
