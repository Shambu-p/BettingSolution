const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const fs = require("fs");

async function createEndpointAfter(reqUser, data, dependencies, smsService) {

    if(data.type == "advanced") {

        let content = `

module.exports = (req, dependencies, notification) => {

}`;
    
    
        fs.writeFileSync(`./controller/APIScripts/${data.sys_id}.js`, content, "utf-8");
    
    }

    return data;

}

module.exports = createEndpointAfter;