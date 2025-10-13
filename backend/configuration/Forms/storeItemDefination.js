const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const storeItemDefination = {
    "name": "store_item",
    "backup_order": 20,
    title: "Store Item",
    id: "store_item",
    activityRoles: [UserRoles.Admin, UserRoles.BranchManager],
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager],
    canAddAttachment: [UserRoles.Admin, UserRoles.BranchManager],
    realId: "sys_id",
    idColumn: "item_id",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "item_id": {
            id: "item_id",
            label: "Inventory Item",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "inventory_item",
            displayField: "name",
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "quantity": {
            id: "quantity",
            label: "Available Quantity",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "total_price": {
            id: "total_price",
            label: "Total Price",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "level_state": {
            id: "level_state",
            label: "Level State",
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "store_id": {
            id: "store_id",
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
            "id": "reference_store_has_store_item",
            "table": "store",
            "column": "store_id",
            "property": "inStore"
        },
        {
            "id": "reference_store_item_inventory_item_in_store",
            "table": "inventory_item",
            "column": "item_id",
            "property": "inventoryItem"
        },
        {
            "id": "reference_store_item_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_store_item_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
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
                    "left": UserRoles.Finance,
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
                    "column": "store_id",
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
                },
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
        "before": "createStoreItemBefore"
    },
    "updateScript": {
        "before": "updateStoreItemBefore"
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
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        }
    ]
};

module.exports = storeItemDefination;