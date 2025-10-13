
// flow script defination
/**
 * this function will be called when the flow is triggered.
 * @param {string} process_id process record sys_id
 * @param {FlowActions} actions actions object to perform actions on the process
 * @param {any} optionalData optional data passed to the script
 */
module.exports = async function(process_id, actions, optionalData) {

	// script content will go here

	await actions.delay(6000);
	// optionalData.dependencies.logger("////////////////////////////////////////////////////////////// flow completed");
	return [
        "var_one",
        "var_two",
        "var_three"
    ];

};