const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const systemNavigationDefination = {
    "name": "system_nav",
    "backup_order": 40,
    title: "System Navigation",
    id: "system_nav",
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "name": {
            "type": FieldType.string,
            "maxLength": 100,
            "minLength": 3,
            "required": true,
            unique: true,

            id: "name",
            label: "Name",
            description: "",
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "link": {
            id: "link",
            label: "Link",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 200,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "order": {
            id: "order",
            label: "Order",
            description: "",
            "type": FieldType.number,
            "minLength": 1,
            "maxLength": 500,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "icon": {
            id: "icon",
            label: "Link Icon",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 200,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "parent_id": {
            id: "parent_id",
            label: "Parent Nav",
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "active": {
            id: "active",
            label: "Active",
            description: "",
            "type": FieldType.boolean,
            "minLength": 1,
            "maxLength": 5,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        }
    },
    "keys": [
        {
            "id": "reference_system_nav_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_system_nav_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        },
        {
            "id": "reference_system_nav_parent",
            "table": "system_nav",
            "column": "parent_id",
            "property": "ParentNav"
        }
    ],
    "children": [
        {
            "id": "reference_system_nav_parent",
            "table": "system_nav",
            "property": "ChildNav"
        },
        {
            "id": "reference_system_nav_roles",
            "table": "navigation_role",
            "property": "Roles"
        }
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
        {
            "id": "ref_nav_roles",
            "table": "navigation_role",
            label: "Roles",
            "column_id": "nav_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        },
        {
            "id": "ref_childrens",
            "table": "system_nav",
            label: "Children",
            "column_id": "parent_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        }
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

module.exports = systemNavigationDefination;