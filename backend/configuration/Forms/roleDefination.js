const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const roleDefination = {
    "name": "userRole",
    "backup_order": 2,
    title: "User Role",
    id: "userRole",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "role",
    "fields": {
        "role": {
            id: "role",
            label: "Role Name",
            description: "",
            "type": FieldType.choice,
            "minLength": 3,
            "maxLength": 30,
            "allowedValues": [
                UserRoles.BranchManager,
                UserRoles.ProductionManager,
                UserRoles.Admin,
                UserRoles.Sells,
                UserRoles.Finance
            ],
            "required": true,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "defaultValue": FieldType.Sells,
            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "user_id": {
            id: "user_id",
            label: "User",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,
            
            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "active": {
            id: "active",
            label: "Is Active",
            description: "",
            "type": FieldType.boolean,
            "required": true,
            "defaultValue": true,
            
            order: 30,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
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
            
            order: 40,
            visible: true,
            readonly: false,
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
            readonly: false,
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
            id: "updated_by",
            label: "Updated by",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },
            
            order: 70,
            visible: true,
            readonly: false,
            notOnList: true,
            displayField: "full_name",
            onChange: "default",
            references: "user",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        }
    },
    "keys": [
        {
            "id": "reference_user_roles",
            "table": "user",
            "column": "user_id",
            "property": "user"
        },
        {
            "id": "reference_userRole_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_userRole_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
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
                    "column": "user_id",
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
    "updateAccessCondition": true,
    "deleteAccessCondition": true,
    "createScript": {
        "before": null
    },
    "updateScript": {
        "before": null
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [],
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

module.exports = roleDefination;