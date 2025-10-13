const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const activityDefination = {
    "name": "activity",
    "backup_order": 10,
    title: "Activities",
    id: "activity",
    activityRoles: [],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "created_on",
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "description": {
            "type": FieldType.longText,
            "maxLength": 50,
            "minLength": 3,
            "required": true,

            id: "description",
            label: "description",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "table_id": {
            "type": FieldType.string,
            "minLength": 30,
            "maxLength": 38,
            "required": true,

            id: "table_id",
            label: "Table",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "record_id": {
            "type": FieldType.string,
            "minLength": 30,
            "maxLength": 38,
            "required": true,

            id: "record_id",
            label: "Record",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        }
    },
    "keys": [
        {
            "id": "reference_activity_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_activity_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [],
    "writeRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [],
    "createAaccessCondition": true,
    "deleteAccessCondition": true,
    "updateAaccessCondition": true,
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
    ],
    actions: [
    ]
};

module.exports = activityDefination;