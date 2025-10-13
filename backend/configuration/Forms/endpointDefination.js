const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const endpointDefination = {
    "name": "endpoint",
    "backup_order": 35,
    title: "API User",
    id: "endpoint",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "route",
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
        "route": {
            "type": FieldType.string,
            "maxLength": 400,
            "minLength": 3,
            "required": true,
            unique: true,

            id: "route",
            label: "Route",
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
        "method": {
            "type": FieldType.choice,
            "maxLength": 100,
            "minLength": 3,
            "required": true,

            id: "method",
            label: "Method",
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
        "api_user_id": {
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            id: "api_user_id",
            label: "API User",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "api_user",
            displayField: "user_name",
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "type": {
            "type": FieldType.choice,
            "maxLength": 100,
            "minLength": 3,
            "required": true,

            id: "type",
            label: "Type",
            description: "read, create, update, delete, advanced",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "table_name": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": false,

            id: "table_name",
            label: "Table Name",
            description: "The name of the table",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "fields": {
            "type": FieldType.longText,
            "maxLength": 900,
            "minLength": 3,
            "required": false,

            id: "fields",
            label: "Fields",
            description: "The fields of the table",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "access_conditions": {
            "type": FieldType.longText,
            "maxLength": 900,
            "minLength": 3,
            "required": false,

            id: "access_conditions",
            label: "Access Conditions",
            description: "The access conditions for the table records",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "created_on": {
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            id: "created_on",
            label: "Created On",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_on": {
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            id: "updated_on",
            label: "Updated On",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "created_by": {
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            id: "created_by",
            label: "Created By",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: true,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_by": {
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },

            id: "updated_by",
            label: "Updated By",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
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
            "id": "reference_endpoint_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_endpoint_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        },
        {
            "id": "reference_endpoint_api_user",
            "table": "api_user",
            "column": "api_user_id",
            "property": "apiUser"
        }
    ],
    "children": [],
    "writeRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [],
    "createAccessCondition": true,
    "deleteAccessCondition": true,
    "updateAccessCondition": true,
    "createScript": {
        "after": "createEndpointAfter",
        "before": "createEndpointBefore"
    },
    "updateScript": {
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
        {
            roles: [UserRoles.Admin],
            lable: "Design",
            class: "btn-primary",
            action: "changeDesignerView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: false
        }
    ]
};

module.exports = endpointDefination;