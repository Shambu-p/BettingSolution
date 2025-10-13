const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const issueTicketDefination = {
    "name": "issue_ticket",
    "backup_order": 5,
    title: "Issues",
    id: "issue_ticket",
    activityRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    canReadAttachment: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    canAddAttachment: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    realId: "sys_id",
    idColumn: "issue_number",
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
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "issue_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "issue_number",
            label: "Ticket Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "subject": {
            id: "subject",
            label: "Subject",
            description: "",
            "type": FieldType.string,
            "minLength": 7,
            "maxLength": 38,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells]
        },
        "description": {
            id: "description",
            label: "Description",
            description: "",
            "type": FieldType.longText,
            "minLength": 5,
            "maxLength": 999,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells]
        },
        "resolution_note": {
            id: "resolution_note",
            label: "Resolution Note",
            description: "",
            "type": FieldType.longText,
            "minLength": 5,
            "maxLength": 999,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "type": {
            id: "type",
            label: "Issue Type",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 20,
            "required": true,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells]
        },
        "status": {
            id: "status",
            label: "Issue State",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 20,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells]
        },
        "immediate_image": {
            id: "immediate_image",
            label: "immediate_image",
            description: "",
            "type": FieldType.longText,
            "minLength": 32,
            "maxLength": 999,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
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
            "id": "reference_issue_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_issue_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
        {
            "condition": [
                {
                    "left": UserRoles.Admin,
                    "operator": "notIn",
                    "right": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "connector": "AND"
                }
            ],
            "filter": [
                {
                    "column": "created_by",
                    "operator": "equals",
                    "value": {
                        "name": "currentUser",
                        "property": "sys_id"
                    },
                    "connector": "AND"
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
        before: "createTicketBefore"
    },
    "updateScript": {
        before: "",
        after: ""
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
            roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            lable: "Change View",
            class: "btn-success",
            action: "changePurchaseView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = issueTicketDefination;