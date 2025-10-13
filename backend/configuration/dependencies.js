const Mysql = require("../infrastructure/persistance/mysql/connection");
const EncryptionService = require("../infrastructure/service/authentication/encryption");
const TokenGeneratorService = require("../infrastructure/service/authentication/tokenGenerator");
const ExceptionHandlingService = require("../infrastructure/service/Exception/ExceptionHandle");
const RoutingValidator = require("../infrastructure/service/validation/routingValidation");
const prisma = require("@prisma/client");
const fs = require('fs');
const path = require('path');

module.exports = class Configuration{
    
    port;
    database;
    appSecretKey;
    appAddress;
    encryption;
    tokenGenerator;
    exceptionHandling;
    routingValidator;
    attachmentDirectory;
    smsConfiguration;
    view_logs = true;

    constructor() {

        this.port = 3005;
        this.database = new Mysql();
        this.databasePrisma = new prisma.PrismaClient(),
        this.appSecretKey = "Store-Solution";
        this.appAddress = `http://localhost:${this.port}`;
        this.encryption = new EncryptionService();
        this.tokenGenerator = new TokenGeneratorService();  
        this.exceptionHandling = new ExceptionHandlingService();       
        this.routingValidator = new RoutingValidator({databasePrisma: this.databasePrisma, exceptionHandling: this.exceptionHandling});


        this.smsConfiguration = {
            disabled: true,
            smsToken: "",
            url: "https://api.geezsms.com/api/v1/sms/send"
        };

    }

    logger(...args) {
        if(this.view_logs) {
            console.log(...args);
        }
    }

}