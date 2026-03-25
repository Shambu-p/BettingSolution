const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const accessCardDefination = {
    "name": "charger_access_card",
    "backup_order": 15,
    title: "Charger Access Card",
    id: "charger_access_card",
    application_id: "green_addis",
    activityRoles: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    canReadAttachment: [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
    canAddAttachment: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    realId: "sys_id",
    idColumn: "id_token",
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
        "id_token": {
            id: "id_token",
            label: "Id Token",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 50,
            "required": true,
            unique: true,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "id_number": {
            id: "id_number",
            label: "Id Number",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
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

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "wallet_amount": {
            id: "wallet_amount",
            label: "Wallet Amount",
            description: "",
            "type": FieldType.double,
            "minLength": 1,
            "maxLength": 50,
            "required": false,

            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner, UserRoles.ChargeStationOperator],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
            "id": "reference_charger_access_card_user_user_id",
            "table": "user",
            "column": "user_id",
            "property": "User"
        },
        {
            "id": "reference_charger_access_card_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_charger_access_card_user_updated_by",
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
        {
            "id": "reference_charger_trx_access_card_card_id",
            "table": "charger_trx",
            "property": "chargerTransactions"
        },
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
    "updateRoles": [UserRoles.Admin, UserRoles.BranchManager],
    "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner, UserRoles.ChargeStationOperator],
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
                },
                {
                    "left": UserRoles.ChargeStationOperator,
                    "operator": "notIn",
                    "right": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "connector": "AND"
                },
                {
                    "left": UserRoles.ChargeStationOwner,
                    "operator": "notIn",
                    "right": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "connector": "AND"
                },
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
                    "connector": "OR"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.ChargeStationOwner,
                    "connector": "OR"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.ChargeStationOperator,
                    "connector": "OR"
                }
            ],
            "filter": []
        }
    ],
    "createAccessCondition": true,
    "updateAccessCondition": [
        {
            "left": {
                "name": "currentUser",
                "property": "Id"
            },
            "operator": "not",
            "right": {
                "name": "currentData",
                "property": "user_id"
            },
            "connector": "AND"
        },
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

module.exports = accessCardDefination;