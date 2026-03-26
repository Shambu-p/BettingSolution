const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const navigationRoleDefination = {
    "name": "navigation_role",
    "backup_order": 40,
    title: "Navigation Role",
    id: "navigation_role",
    activityRoles: [UserRoles.Admin],
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

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },

        "role": {
            id: "role",
            label: "Role",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 200,
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

        "nav_id": {
            id: "nav_id",
            label: "Navigation",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "system_nav",
            displayField: "name",

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
            "id": "reference_nav_role_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_nav_role_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        },
        {
            "id": "reference_system_nav_roles",
            "table": "system_nav",
            "column": "nav_id",
            "property": "Navigation"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
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
        }
    ]
};

module.exports = navigationRoleDefination;