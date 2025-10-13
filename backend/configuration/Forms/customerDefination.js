const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const customerDefination = {
    "name": "customer",
    "backup_order": 20,
    title: "Customer",
    id: "customer",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
    canAddAttachment: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
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

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "phone_number": {
            id: "phone_number",
            label: "Phone Number",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 50,
            "required": true,
            unique: true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "address": {
            id: "address",
            label: "Address",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 100,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "type": {
            id: "type",
            label: "Type",
            description: "",
            "type": FieldType.choice,
            "minLength": 3,
            "maxLength": 10,
            "required": false,

            order: 15,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "credite_amount": {
            id: "credite_amount",
            label: "Credit Amount",
            description: "",
            "type": FieldType.number,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 15,
            visible: false,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "debt_amount": {
            id: "debt_amount",
            label: "Debt Amount",
            description: "",
            "type": FieldType.number,
            "minLength": 1,
            "maxLength": 20,
            "required": false,

            order: 20,
            visible: false,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "verified": {
            id: "verified",
            label: "Is Verified",
            description: "",
            "type": FieldType.boolean,
            "required": false,
            "defaultValue": true,

            order: 25,
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

            order: 30,
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

            order: 40,
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

            order: 45,
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
            "id": "reference_customer_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_customer_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_purchase_customer",
            "table": "purchase",
            "property": "sellContracts"
        },
        {
            "id": "reference_service_provider",
            "table": "service",
            "property": "servicesProvided"
        },
        {
            "id": "reference_sell_customer",
            "table": "sell",
            "property": "buyContracts"
        },
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
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
        "before": "createCustomerBefore"
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
            "id": "ref_customer_purchases",
            "table": "purchase",
            label: "Purchases Made",
            "column_id": "customer_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
        },
        {
            "id": "ref_service_provided",
            "table": "service",
            label: "Services Provided",
            "column_id": "customer_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.Finance]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        }
    ]
};

module.exports = customerDefination;