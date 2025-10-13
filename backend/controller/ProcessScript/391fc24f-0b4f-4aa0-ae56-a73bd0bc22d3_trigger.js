

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