const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const transactionDefination = {
    "name": "transaction",
    "backup_order": 80,
    title: "System Transaction",
    id: "transaction",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "trx_number",
    "fields": {
        "sys_id": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 32,
            "required": false,

            id: "sys_id",
            label: "System Id",
            description: "",
            order: 1,
            visible: false,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "trx_number": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "trx_number",
            label: "Transaction Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "category": {
            "type": FieldType.choice,
            "maxLength": 40,
            "minLength": 3,
            "required": true,

            id: "category",
            label: "Category",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "categoryOnTransaction",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "type": {
            "type": FieldType.choice,
            "maxLength": 40,
            "minLength": 3,
            "required": true,

            id: "type",
            label: "Type",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "status": {
            id: "status",
            label: "Status",
            description: "",
            "type": FieldType.boolean,
            "minLength": 1,
            "maxLength": 50,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "amount": {
            id: "amount",
            label: "amount",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "remark": {
            "type": FieldType.longText,
            "maxLength": 999,
            "minLength": 5,
            "required": false,

            id: "remark",
            label: "Remark",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "sell_id": {
            id: "sell_id",
            label: "Sell",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 40,
            visible: true,
            readonly: false,
            notOnList: true,
            references: "sell",
            displayField: "sell_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "purchase_id": {
            id: "purchase_id",
            label: "Purchase",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 40,
            visible: true,
            readonly: false,
            notOnList: true,
            references: "purchase",
            displayField: "purchase_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "service_id": {
            id: "service_id",
            label: "Service",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 40,
            visible: true,
            readonly: false,
            notOnList: true,
            references: "service",
            displayField: "name",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "production_id": {
            id: "production_id",
            label: "Production",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 40,
            visible: true,
            readonly: false,
            notOnList: true,
            references: "production",
            displayField: "prod_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },

        "created_on": {
            id: "created_on",
            label: "Created On",
            description: "",
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            order: 30,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_on": {
            id: "updated_on",
            label: "Updated On",
            description: "",
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            order: 35,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "created_by": {
            id: "created_by",
            label: "Created by",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 40,
            visible: true,
            readonly: true,
            notOnList: true,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_by": {
            id: "updated_by",
            label: "Updated by",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            order: 45,
            visible: true,
            readonly: true,
            notOnList: true,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        }
    },
    "keys": [
        {
            "id": "reference_purchase_transaction",
            "table": "purchase",
            "column": "purchase_id",
            "property": "purchase"
        },
        {
            "id": "reference_sell_transaction",
            "table": "sell",
            "column": "sell_id",
            "property": "sell"
        },
        {
            "id": "reference_service_transaction",
            "table": "service",
            "column": "service_id",
            "property": "service"
        },
        {
            "id": "reference_production_transaction",
            "table": "production",
            "column": "production_id",
            "property": "production"
        },
        {
            "id": "reference_transaction_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_transaction_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_transaction_sys_trx",
            "table": "main_transaction",
            "property": "Children"
        }
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "updateRoles": [],
    "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
        {
            "condition": [
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "notIn",
                    "right": UserRoles.Admin,
                    "connector": "AND"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "notIn",
                    "right": UserRoles.Finance,
                    "connector": "AND"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.Sells,
                    "connector": "AND"
                }
            ],
            "filter": [
                {
                    "column": "category",
                    "operator": "equals",
                    "value": "sell",
                    "connector": "AND"
                },
                {
                    "column": "sell.store_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
                    },
                    "connector": "OR"
                }
            ]
        },
        {
            "condition": [
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.Admin,
                    "connector": "OR"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.Finance,
                    "connector": "OR"
                }
            ],
            "filter": []
        }
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
        // {
        //     "left": {
        //         "name": "currentUser",
        //         "property": "Id"
        //     },
        //     "operator": "equals",
        //     "right": {
        //         "name": "currentData",
        //         "property": "created_by"
        //     },
        //     "connector": "OR"
        // }
    ],
    "deleteAccessCondition": true,
    "createScript": {
        before: "createTransactionBefore",
        after: "createTransactionAfter"
    },
    "updateScript": {
        // before: "updateSellBefore",
        // after: "updateSellAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "transactionOnLoad",
    relatedList: [
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        },
    ]
};

module.exports = transactionDefination;