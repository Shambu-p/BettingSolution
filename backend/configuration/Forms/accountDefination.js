const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const accountDefination = {
    "name": "account",
    "backup_order": 80,
    title: "System Accounts",
    id: "account",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "account_number",
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
        "account_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "account_number",
            label: "Account Number",
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
        "name": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": true,
            unique: true,

            id: "name",
            label: "Account Name",
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
        "type": {
            "type": FieldType.choice,
            "maxLength": 40,
            "minLength": 3,
            "required": true,

            id: "type",
            label: "Account Type",
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
            label: "Account Status",
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
            "updateRoles": [UserRoles.Admin]
        },
        "balance": {
            id: "balance",
            label: "Total Balance",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "related_account": {
            "type": FieldType.reference,
            "maxLength": 40,
            "minLength": 32,
            "required": false,

            id: "related_account",
            label: "Related Account",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "account",
            displayField: "account_number",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
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
            notOnList: false,
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
            "id": "reference_related_account",
            "table": "account",
            "column": "related_account",
            "property": "related"
        },
        {
            "id": "reference_account_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_account_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_related_account",
            "table": "account",
            "property": "relatedAccounts"
        },
        {
            "id": "reference_transaction_account_id",
            "table": "main_transaction",
            "property": "GLTrxs"
        },
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.Finance],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
    ],
    "deleteAccessCondition": true,
    "createScript": {
        before: "createAccountBefore"
    },
    "updateScript": {
        // before: "updateSellBefore",
        // after: "updateSellAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
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

module.exports = accountDefination;