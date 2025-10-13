
async function updateProcessBefore(reqUser, data, changes, dependencies, smsService) {

    let is_state_changed = changes.find(change => change.column == "state");
    if(is_state_changed && ["completed", "failed", "cancelled"].includes(data.state)) {
        data.finished_on = (new Date()).toISOString();
    }

    return data;

}

module.exports = updateProcessBefore;