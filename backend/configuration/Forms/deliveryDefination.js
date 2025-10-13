const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const deliveryDefination = {
    "name": "delivery",
    "backup_order": 10,
    title: "Delivery",
    id: "delivery",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [UserRoles.Admin],
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
            id: "name",
            label: "Name",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "phone_number": {
            id: "phone_number",
            label: "Phone Number",
            description: "",
            "type": FieldType.string,
            "minLength": 10,
            "maxLength": 14,
            "required": true,
            unique: true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "vehicle_type": {
            id: "vehicle_type",
            label: "Vehicle Type",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "vehicle_number": {
            id: "vehicle_number",
            label: "Vehicle Number",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 20,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
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
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_on": {
            id: "updated_on",
            label: "Updated by",
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

            "writeRoles": [UserRoles.Admin],
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

            "writeRoles": [UserRoles.Admin],
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        }
    },
    "keys": [
        {
            "id": "reference_delivery_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_delivery_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_sell_delivery",
            "table": "sell",
            "property": "deliveredSells"
        },
        {
            "id": "reference_transfer_delivery",
            "table": "transfer",
            "property": "deliveredTransfers"
        },
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
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
        //         "property": "Roles"
        //     },
        //     "operator": "contains",
        //     "right": UserRoles.Admin,
        //     "connector": "OR"
        // }
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
    relatedList: [],
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

module.exports = deliveryDefination;