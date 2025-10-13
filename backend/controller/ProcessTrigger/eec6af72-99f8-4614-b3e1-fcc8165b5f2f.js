
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