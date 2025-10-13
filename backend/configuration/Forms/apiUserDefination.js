const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const apiUserDefination = {
    "name": "api_user",
    "backup_order": 30,
    title: "API User",
    id: "api_user",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "user_name",
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
        "user_name": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": true,

            id: "user_name",
            label: "User Name",
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
        "api_key": {
            "type": FieldType.string,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            id: "api_key",
            label: "API Key",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "api_secret": {
            "type": FieldType.string,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            id: "api_secret",
            label: "API Secret Key",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "expire_on": {
            "type": FieldType.dateTime,
            "required": false,

            id: "expire_on",
            label: "Expiration Date",
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
        "domain_ip": {
            "type": FieldType.string,
            "minLength": 5,
            "maxLength": 100,
            "required": false,

            id: "domain_ip",
            label: "Domain Name or IP Address",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "authorization_type": {
            "type": FieldType.choice,
            "required": true,

            id: "authorization_type",
            label: "Auth Type",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
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
            "id": "reference_api_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_api_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_endpoint_api_user",
            "table": "endpoint",
            "property": "allowedEndpoints"
        }
    ],
    "writeRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [],
    "createAccessCondition": true,
    "deleteAccessCondition": true,
    "updateAccessCondition": true,
    "createScript": {
        "before": "createAPIUserBefore"
    },
    "updateScript": {
    },
    "deleteScript": {
    },

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_api_user_endpoints",
            "table": "endpoint",
            label: "Endpoints",
            "column_id": "api_user_id",
            "order": 1,
            "readRoles": [UserRoles.Admin]
        },
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Duplicate",
        //     class: "zbtn-outline",
        //     action: "defaultDuplicate",
        //     stayOnForm: true
        // }
    ]
};

module.exports = apiUserDefination;