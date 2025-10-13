const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

async function createFlowBefore(reqUser, data, dependencies, smsService) {

    let flow_spec = {
        trigger: {
            "id": "trigger",
            "position": {
                "x": 0,
                "y": 0
            },
            "type": "triggerNode",
            "data": {
                "label": "Trigger",
                "internalName": "trigger",
                "description": "",

                "triggerType": data.initiation_type, // record_based, time_based, one_time, manual
                "actionType": "normal", // advanced, normal
                "reccurrence": "none", // only for time based triggers
                "given_datetime": "", // only for time based triggers
                "condition": [], // only for record based triggers
                "table_id": "", // only for record based triggers

                "type": "triggerNode",
                "next": ""
            },
            "selected": false,
            "measured": {
                "width": 400,
                "height": 100
            }
        },
        actions: []
    };

    data.specification = JSON.stringify(flow_spec);

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createFlowBefore;