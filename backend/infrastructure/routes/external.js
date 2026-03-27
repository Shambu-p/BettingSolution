const prisma = require("@prisma/client");
const SMSService = require("../service/SMS/SMSservice");
const DefaultController = require("../../controller/DefaultController");
const fieldRules = require("../../configuration/fieldRules");
const SystemUser = require("../../controller/auth/SystemUser");

class External {

    dependencies;
    router;
    smsService;

    constructor(deps) {
        this.dependencies = deps;
        this.smsService = new SMSService(deps);
    }

    getRoute() {

        return async (req, res) => {

            try {

                let endpoint = req.user.allowedEndpoints.find(alde => (`/api/external${alde.route}` == req.path && alde.method == req.method));

                if(!endpoint) {
                    throw this.dependencies.exceptionHandling.throwError("Route not found!", 400);
                }

                let api_result;

                if(endpoint.type == "create") {
                    api_result = await this.createRecord(endpoint, req);
                } else if(endpoint.type == "update") {
                    api_result = await this.updateRecord(endpoint, req);
                } else if(endpoint.type == "fetch") {
                    api_result = await this.getSingle(endpoint, req);
                } else if(endpoint.type == "fetch_many") {
                    api_result = await this.getList(endpoint, req);
                } else {
                    req.systemUser = SystemUser;
                    const api_script = require(`../../controller/APIScripts/${endpoint.sys_id}`);
                    api_result = await api_script(req, this.dependencies, this.smsService, DefaultController);  
                }

                if(api_result) {
                    res.json(api_result);
                } else {
                    res.json({
                        message: "operation successful"
                    });
                }

            } catch (error) {
                this.dependencies.logger(error);
                if(error.statusCode) {
                    return res.status(error.statusCode).json({ message: error.message })
                } else {
                    return res.status(500).json({ message: "Internal Server Error" })
                }
            }

        };

    }

    async getList(endpoint, request) {

        let model = await prisma.Prisma.ModelName[endpoint.table_name];

        if (!model) {
            throw this.dependencies.exceptionHandling.throwError("table not found", 404);
        }

        let orderBy = [];

        if(request.body.sort) {

            for (let key in request.body.sort) {
                orderBy.push({
                    [key]: request.body.sort[key]
                });
            }

        }

        let whereQuery = {}, include = {};

        // let validator = new RoleBasedValidator(endpoint.table_name, this.dependencies, request.user);
        let addition_condition = JSON.parse(endpoint.access_conditions);

        if(addition_condition) {
            whereQuery = { AND: [{...request.body.condition}, ...addition_condition] }
        } else {
            whereQuery = { ...request.body.condition }
        }

        if(request.body.relation && ["reference", "reference_children"].includes(request.body.relation)) {

            if(fieldRules[endpoint.table_name] && fieldRules[endpoint.table_name].keys) {
                let related_tables = fieldRules[endpoint.table_name].keys;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });
            }

        }

        if(endpoint.fields) {
            let selected_fields = JSON.parse(endpoint.fields);

            for(let sf of selected_fields) {
                include[sf] = true;
            }
        }

        this.dependencies.logger(endpoint.table_name, whereQuery);

        const totalCount = await this.dependencies.databasePrisma[endpoint.table_name].findMany({
            where: whereQuery,
        });

        let records = [];
        records = await this.dependencies.databasePrisma[endpoint.table_name].findMany(
            (request.body.PageNumber && request.body.PageSize && parseInt(request.body.PageSize) > 0 && parseInt(request.body.PageNumber) > 0) ? ({
                where: whereQuery,
                orderBy: orderBy,
                select: include,
                take: parseInt(request.body.PageSize),
                skip: (parseInt(request.body.PageNumber) - 1) * parseInt(request.body.PageSize)
            }) : ({
                where: whereQuery,
                orderBy: orderBy,
                select: include
            })
        );

        return {
            Items: records,
            PageNumber: request.body.PageNumber,
            TotalCount: totalCount.length,
            PageSize: parseInt(request.body.PageSize)
        };

    }

    async getSingle(endpoint, request) {

        let model = await prisma.Prisma.ModelName[endpoint.table_name];

        if (!model) {
            throw this.dependencies.exceptionHandling.throwError("table not found", 404);
        }

        let whereQuery = {}, include = {};

        // let validator = new RoleBasedValidator(endpoint.table_name, this.dependencies, request.user);
        let addition_condition = JSON.parse(endpoint.access_conditions);

        if(addition_condition && addition_condition.length > 0) {
            whereQuery = { AND: [{sys_id: request.body.id}, ...addition_condition] }
        } else {
            whereQuery = { sys_id: request.body.id };
        }

        if(request.body.relation && ["reference", "reference_children"].includes(request.body.relation)) {

            if(fieldRules[endpoint.table_name] && fieldRules[endpoint.table_name].keys) {

                let related_tables = fieldRules[endpoint.table_name].keys;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });

            }

        } else if(request.body.relation && ["children", "reference_children"].includes(request.body.relation)) {

            if(fieldRules[endpoint.table_name] && fieldRules[endpoint.table_name].children) {
                let related_tables = fieldRules[endpoint.table_name].children;

                related_tables.forEach(related_table => {
                    include[related_table.property] = true;
                });
            }

        }

        if(endpoint.fields) {
            let selected_fields = JSON.parse(endpoint.fields);

            for(let sf of selected_fields) {
                include[sf] = true;
            }
        }

        this.dependencies.logger(endpoint.table_name, whereQuery);

        return await this.dependencies.databasePrisma[endpoint.table_name].findFirst({
            where: whereQuery,
            select: include
        });

    }

    async createRecord(endpoint, request) {

        let record_data = {};
        let allowed_fields = JSON.parse(endpoint.fields);

        let model = await prisma.Prisma.ModelName[endpoint.table_name];

        if (!model) {
            throw this.dependencies.exceptionHandling.throwError("table not found", 404);
        }

        for(let aldf of allowed_fields) {
            if(request.body[aldf]) {
                record_data[aldf] = request.body[aldf];
            }
        }

        return await DefaultController.create(SystemUser, endpoint.table_name, record_data, this.dependencies, this.smsService);

    }

    async updateRecord(endpoint, request) {

        let record_data = {};
        let allowed_fields = JSON.parse(endpoint.fields);
        let model = await prisma.Prisma.ModelName[endpoint.table_name];

        if (!model) {
            throw this.dependencies.exceptionHandling.throwError("table not found", 404);
        }

        if(!request.body.sys_id) {
            throw this.dependencies.exceptionHandling.throwError("sys_id field is necessary to update a record", 500);
        }

        for(let aldf of allowed_fields) {
            if(request.body[aldf]) {
                record_data[aldf] = request.body[aldf];
            }
        }

        record_data.sys_id = request.body.sys_id;

        return await DefaultController.update(SystemUser, endpoint.table_name, record_data, this.dependencies, this.smsService);

    }

}

module.exports = External;
