const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const chargerTrxDefination = {
    "name": "charger_trx",
    "backup_order": 15,
    title: "Charger Transaction",
    id: "charger_trx",
    application_id: "green_addis",
    activityRoles: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    canReadAttachment: [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
    canAddAttachment: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    realId: "sys_id",
    idColumn: "legacy_id",
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
        "legacy_id": {
            id: "legacy_id",
            label: "Legacy Id",
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "id_token": {
            id: "id_token",
            label: "ID Token",
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
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
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
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "card_id": {
            id: "card_id",
            label: "Card Id",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "charger_access_card",
            displayField: "id_token",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "branch_id": {
            id: "branch_id",
            label: "Branch",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "connector_id": {
            id: "connector_id",
            label: "Connector Used",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "charger_connector",
            displayField: "name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        },
        "status": {
            id: "status",
            label: "Status",
            description: "",
            "type": FieldType.choice,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "charge_amount": {
            id: "charge_amount",
            label: "Charge Amount",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "rate": {
            id: "rate",
            label: "Rate Applied",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "total_payment": {
            id: "total_payment",
            label: "Total Payment",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "fee_collected": {
            id: "fee_collected",
            label: "Fee Collected",
            description: "",
            "type": FieldType.double,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
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
            "id": "reference_charger_trx_store_branch_id",
            "table": "store",
            "column": "branch_id",
            "property": "Branch"
        },
        {
            "id": "reference_charger_trx_access_card_card_id",
            "table": "charger_access_card",
            "column": "card_id",
            "property": "AccessCard"
        },
        {
            "id": "reference_charger_trx_charger_connector_connector_id",
            "table": "charger_connector",
            "column": "connector_id",
            "property": "ChargerConnector"
        },
        {
            "id": "reference_charger_trx_user_user_id",
            "table": "user",
            "column": "user_id",
            "property": "User"
        },
        {
            "id": "reference_charger_trx_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_charger_trx_user_updated_by",
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
        {
            "condition": [
                {
                    "left": UserRoles.EVDriver,
                    "operator": "contains",
                    "right": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
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
                    "connector": "AND"
                }
            ]
        },
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
                    "column": "branch_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
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

module.exports = chargerTrxDefination;