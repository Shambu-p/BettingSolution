const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const stationDefination = {
    "name": "station",
    "backup_order": 15,
    title: "Charger Station",
    id: "station",
    application_id: "green_addis",
    activityRoles: [UserRoles.Admin, UserRoles.ChargeStationOwner],
    canReadAttachment: [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
    canAddAttachment: [UserRoles.Admin, UserRoles.ChargeStationOwner],
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

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "legacy_id": {
            id: "legacy_id",
            label: "Legacy Id",
            description: "",
            "type": FieldType.string,
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
        "branch_id": {
            id: "branch_id",
            label: "Store/Branch",
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
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "longitude": {
            id: "longitude",
            label: "Longitude",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 100,
            "required": false,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "latitude": {
            id: "latitude",
            label: "Latitude",
            description: "",
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 100,
            "required": false,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
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
            "minLength": 3,
            "maxLength": 100,
            "required": false,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner]
        },
        "active": {
            id: "active",
            label: "Is Active",
            description: "",
            "type": FieldType.boolean,
            "required": false,
            "defaultValue": true,

            order: 25,
            visible: false,
            readonly: false,
            notOnList: false,
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
            "id": "reference_charger_station_branch_id",
            "table": "store",
            "column": "branch_id",
            "property": "Branch"
        },
        {
            "id": "reference_charger_station_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_charger_station_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_charger_connector_station_station_id",
            "table": "charger_connector",
            "property": "ConnectorPorts"
        }
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
        {
            "left": {
                "name": "currentUser",
                "property": "Id"
            },
            "operator": "contains",
            "right": {
                "name": "currentData",
                "property": "manager"
            },
            "connector": "OR"
        },
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
            "right": UserRoles.Finance,
            "connector": "OR"
        }
    ],
    "deleteAccessCondition": true,
    "createScript": {
        after: "createChargerStationAfter"
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
            "id": "ref_connector_ports",
            "table": "charger_connector",
            label: "Connectors",
            "column_id": "station_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOwner, UserRoles.ChargeStationOperator]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin],
            lable: "Synchronize",
            class: "btn-success",
            action: "defaultUpdate",
            stayOnForm: true
        }
    ]
};

module.exports = stationDefination;