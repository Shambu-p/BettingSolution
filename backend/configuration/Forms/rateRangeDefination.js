const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const rateRangeDefination = {
    "name": "rate_range",
    "backup_order": 15,
    title: "Rate Range",
    id: "rate_range",
    application_id: "green_addis",
    activityRoles: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    canReadAttachment: [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
    canAddAttachment: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    realId: "sys_id",
    idColumn: "type",
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
        "rate_id": {
            id: "rate_id",
            label: "Parent Rate",
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
            references: "payment_rate",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "type": {
            id: "type",
            label: "Type",
            description: "",
            "type": FieldType.choice,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "typeOnRateRange",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "from_kw": {
            id: "from_kw",
            label: "From (kW)",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "to_kw": {
            id: "to_kw",
            label: "Up-To (kW)",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "rate_amount": {
            id: "rate_amount",
            label: "Rate Amount (Birr)",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "fixed_amount": {
            id: "fixed_amount",
            label: "Fixed Amount",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: false,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "fee_ratio": {
            id: "fee_ratio",
            label: "Fee Ratio",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "active": {
            id: "active",
            label: "Is Active",
            description: "",
            "type": FieldType.boolean,
            "required": true,
            "defaultValue": true,

            order: 25,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
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
            "id": "reference_payment_rate_rate_range_rate_id",
            "table": "payment_rate",
            "column": "rate_id",
            "property": "parentRate"
        },
        {
            "id": "reference_rate_range_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_rate_range_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        // {
        //     "id": "reference_store_has_store_item",
        //     "table": "store_item",
        //     "property": "storeItems"
        // }
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
    "updateRoles": [UserRoles.Admin, UserRoles.BranchManager],
    "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner, UserRoles.ChargeStationOperator],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
        // {
        //     "left": {
        //         "name": "currentUser",
        //         "property": "Id"
        //     },
        //     "operator": "contains",
        //     "right": {
        //         "name": "currentData",
        //         "property": "manager"
        //     },
        //     "connector": "OR"
        // },
        // {
        //     "left": {
        //         "name": "currentUser",
        //         "property": "Roles"
        //     },
        //     "operator": "contains",
        //     "right": UserRoles.Admin,
        //     "connector": "OR"
        // },
        // {
        //     "left": {
        //         "name": "currentUser",
        //         "property": "Roles"
        //     },
        //     "operator": "contains",
        //     "right": UserRoles.Finance,
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
    relatedList: [
        // {
        //     "id": "ref_store_items",
        //     "table": "store_item",
        //     label: "R.M. Level",
        //     "column_id": "store_id",
        //     "order": 1,
        //     "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells]
        // },
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

module.exports = rateRangeDefination;