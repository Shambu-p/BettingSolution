
// const Configuration = require('../../configuration/Configuration');

// const Creator = require("../service/DBManagement/Creator");
// const Validator = require("../service/validation/validation");
// const KemariDB = require("../service/DBManagement/KemariDB");
// const ScriptManager = require('../service/DBManagement/ScriptManager');
// const BaseDataManager = require("../service/BaseDataManager");
const express = require("express");
const DefaultController = require("../../controller/DefaultController");
const AuthService = require("../service/authentication/auth");
const SMSService = require("../service/SMS/SMSservice");
const SystemUser = require("../../controller/auth/SystemUser");


class FileRoute {

    // Database;
    // Infrastructure;
    // router;
    // Configuration;
    // baseConfig;
    // scriptManager;

    // constructor(infrastructure, config, database) {

    //     this.Infrastructure = infrastructure;
    //     this.router = express.Router();
    //     this.Configuration = config;
    //     this.Database = database;
    //     this.baseConfig = Configuration.getConfiguration("./configuration.json");
    //     this.scriptManager = new ScriptManager();

    // }

    dependencies;
    router;
    smsService;

    constructor(deps) {
        this.dependencies = deps;
        this.router = express.Router();
        this.smsService = new SMSService(deps);
    }

    getRoute() {

        function splitStringByLength(str, length) {
            let result = [];
            for (let i = 0; i < str.length; i += length) {
                result.push(str.substring(i, i + length));
            }
            return result;
        }

        this.router.get("/:id", async (req, res, next) => {

            try {

                let fileId = req.params.id;
                if (!fileId) {
                    throw new Error("request params must contain id property", 400);
                }
    
                const foundFile = await this.dependencies.databasePrisma.attachment.findFirst({
                    where: {
                        sys_id: req.params.id
                    },
                    include: {
                        Documents: true
                    }
                });
    
                if(!foundFile){
                    return res.status(404).json({ message: `File with the Id ${req.params.id} not found` })
                }

                let base64Data = foundFile.Documents.map(doc => (doc.content)).join("");
                const fileBuffer = Buffer.from(base64Data, 'base64');
                res.setHeaders(new Headers({
                    'Content-Disposition': `attachment; filename="${foundFile.file_name}"`,
                    'Content-Type': foundFile.extension
                }));
                res.end(fileBuffer);
    
            } catch (error) {

                console.log(error);
                return res.status(500).json({ message: error.message });

            }
        });

        this.router.post("/create", AuthService.authenticate, async (req, res, next) => {

            try {

                if (!req.body.content) {
                    throw new Error("content needs to be sent!");
                }

                if (typeof req.body.content != 'string') {
                    throw new Error("Content should be base64 encoded string!");
                }

                // let data = req.body;
                let split_data = req.body.content.split(",");

                // let base_data = BaseDataManager.getData();
                let file_content = splitStringByLength(split_data[1], 10485760); //1,073,741,823   1731672

                let attachment_record = await DefaultController.create(req.user, "attachment", { ...req.body, content: undefined }, this.dependencies, this.smsService);
                for(let single_content of file_content) {
                    await DefaultController.create(SystemUser, "attachment_document", { attachment_id: attachment_record.sys_id, content: single_content }, this.dependencies, this.smsService);
                }

                return res.status(200).json(attachment_record);

            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message })
            }

        });
    
        return this.router;

    }

}

module.exports = FileRoute;