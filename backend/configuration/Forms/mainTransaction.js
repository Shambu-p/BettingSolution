const FieldType = require("../../Interface/FieldType");
const TransactionType = require("../../Interface/TransactionType");
const UserRoles = require("../../Interface/UserRoles");

const mainTransactionDefination = {
    "name": "main_transaction",
    "backup_order": 100,
    title: "Main Transaction",
    id: "main_transaction",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "trx_id",
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
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": []
        },
        "trx_id": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": false,

            id: "trx_id",
            label: "Transaction ID",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": []
        },
        "sys_trx": {
            id: "sys_trx",
            label: "System Transaction",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,

            order: 40,
            visible: true,
            readonly: true,
            notOnList: true,
            references: "transaction",
            displayField: "trx_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": []
        },
        "account_id": {
            "type": FieldType.reference,
            "maxLength": 40,
            "minLength": 3,
            "required": true,

            id: "account_id",
            label: "Account",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "account",
            displayField: "account_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": []
        },
        "type": {
            "type": FieldType.choice,
            "maxLength": 40,
            "minLength": 3,
            "required": true,
            allowedValues: [
                TransactionType.debit,
                TransactionType.credit
            ],

            id: "type",
            label: "Type",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": []
        },
        "narration": {
            "type": FieldType.longText,
            "maxLength": 999,
            "minLength": 5,
            "required": false,

            id: "narration",
            label: "Narration",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
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
            "id": "reference_transaction_sys_trx",
            "table": "transaction",
            "column": "sys_trx",
            "property": "Parent"
        },
        {
            "id": "reference_transaction_account_id",
            "table": "account",
            "column": "account_id",
            "property": "GeneralLedger"
        },
        {
            "id": "reference_main_trx_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_main_trx_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [],
    "readRoles": [UserRoles.Admin, UserRoles.Finance],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
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
    },
    "updateScript": {
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

module.exports = mainTransactionDefination;