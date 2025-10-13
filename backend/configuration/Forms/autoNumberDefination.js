const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const autoNumberDefination = {
    "name": "auto_number",
    "backup_order": 40,
    title: "Auto Generated Number",
    id: "auto_number",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "name",
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
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "name": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": true,
            unique: true,

            id: "name",
            label: "Name Description",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "current_number": {
            id: "current_number",
            label: "Current Number",
            description: "",
            "type": FieldType.string,
            "minLength": 4,
            "maxLength": 10,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "prefix": {
            id: "prefix",
            label: "Prefix",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 5,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "sufix": {
            id: "sufix",
            label: "Sufix",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 5,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
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
            "id": "reference_auto_number_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_auto_number_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin],
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
                }
            ],
            "filter": [
                {
                    "column": "sys_id",
                    "operator": "equals",
                    "value": {
                        "name": "currentUser",
                        "property": "Id"
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
                    "connector": "AND"
                }
            ],
            "filter": []
        }
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
        {
            "left": {
                "name": "currentUser",
                "property": "Id"
            },
            "operator": "equals",
            "right": {
                "name": "currentData",
                "property": "created_by"
            },
            "connector": "OR"
        }
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
    onload: "defaultOnload",
    relatedList: [
        // {
        //     "id": "ref_purchase_items",
        //     "table": "purchase_item",
        //     label: "Purchase Items",
        //     "column_id": "purchase_id",
        //     "order": 1,
        //     "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
        // }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Approve",
        //     class: "btn-success",
        //     action: "approvePurchase",
        //     condition: "purchaseApprovalButtonCondition",
        //     stayOnForm: true
        // }
    ]
};

module.exports = autoNumberDefination;