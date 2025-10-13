const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const serviceDefination = {
    "name": "service",
    "backup_order": 35,
    title: "Services Used",
    id: "service",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
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
            id: "name",
            label: "Service Name",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "customer_id": {
            id: "customer_id",
            label: "Customer/Provider",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "customer",
            displayField: "name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "type": {
            id: "type",
            label: "Service Type",
            description: "",
            "type": FieldType.choice,
            "minLength": 3,
            "maxLength": 20,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "interval_type": {
            id: "interval_type",
            label: "Payment Interval",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 20,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "price": {
            id: "price",
            label: "Price",
            description: "",
            "type": FieldType.float,
            "required": true,
            "defaultValue": 0,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "last_payment_date": {
            id: "last_payment_date",
            label: "Last Payment Date",
            description: "",
            "type": FieldType.date,
            "defaultValue": {
                "name": "currentDate"
            },
            required: true,

            order: 40,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "next_payment_date": {
            id: "next_payment_date",
            label: "Next Payment Date",
            description: "",
            "type": FieldType.date,
            "defaultValue": {
                "name": "currentDate"
            },
            required: false,

            order: 40,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
        },
        "created_on": {
            id: "created_on",
            label: "Created On",
            description: "",
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            order: 40,
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

            order: 50,
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

            order: 60,
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

            order: 70,
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
            "id": "reference_service_provider",
            "table": "customer",
            "column": "customer_id",
            "property": "Provider"
        },
        {
            "id": "reference_service_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_service_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_service_transaction",
            "table": "transaction",
            "property": "transactions"
        },
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.Finance],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
        // {
        //     "condition": [
        //         {
        //             "left": {
        //                 "name": "currentUser",
        //                 "property": "Roles"
        //             },
        //             "operator": "notIn",
        //             "right": UserRoles.Admin,
        //             "connector": "AND"
        //         }
        //     ],
        //     "filter": [
        //         {
        //             "column": "sys_id",
        //             "operator": "equals",
        //             "value": {
        //                 "name": "currentUser",
        //                 "property": "Id"
        //             },
        //             "connector": "OR"
        //         }
        //     ]
        // },
        // {
        //     "condition": [
        //         {
        //             "left": {
        //                 "name": "currentUser",
        //                 "property": "Roles"
        //             },
        //             "operator": "contains",
        //             "right": UserRoles.Admin,
        //             "connector": "AND"
        //         }
        //     ],
        //     "filter": []
        // }
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
        //         "property": "sys_id"
        //     },
        //     "connector": "OR"
        // }
    ],
    "deleteAccessCondition": true,
    "createScript": {
        before: "createServiceBefore"
    },
    "updateScript": {
        before: "updateServiceBefore",
        after: "updateServiceAfter"
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
            stayOnForm: true
        }
    ]
};

module.exports = serviceDefination;