const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const storeDefination = {
    "name": "store",
    "backup_order": 15,
    title: "Store",
    id: "store",
    activityRoles: [UserRoles.Admin, UserRoles.BranchManager],
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager],
    canAddAttachment: [UserRoles.BranchManager],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "location": {
            id: "location",
            label: "Store Location",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 100,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "manager": {
            id: "manager",
            label: "Manager",
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

            order: 25,
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
            "id": "reference_store_user_managed_by",
            "table": "user",
            "column": "manager",
            "property": "managedBy"
        },
        {
            "id": "reference_store_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_store_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_store_has_store_item",
            "table": "store_item",
            "property": "storeItems"
        },
        {
            "id": "reference_product_item_has_one_store",
            "table": "store_product",
            "property": "storeProducts"
        },
        {
            "id": "reference_store_has_purchase",
            "table": "purchase",
            "property": "storePurchases"
        },
        {
            "id": "reference_store_has_purchase_item",
            "table": "purchase_item",
            "property": "storePurchaseItems"
        },
        {
            "id": "reference_store_has_production",
            "table": "production",
            "property": "Productions"
        },
        {
            "id": "reference_store_has_production_consumption",
            "table": "production_consumption",
            "property": "storeConsumption"
        },
        {
            "id": "reference_store_has_finished_product",
            "table": "finished_product",
            "property": "finishedProducts"
        },
        {
            "id": "reference_store_has_sell",
            "table": "sell",
            "property": "storeSells"
        },
        {
            "id": "reference_store_has_sell_product",
            "table": "sell_product",
            "property": "storeSellProduct"
        },
        {
            "id": "reference_store_has_worker",
            "table": "user_store",
            "property": "workers"
        },
        {
            "id": "transfer_has_from_store",
            "table": "transfer",
            "property": "fromStores"
        },
        {
            "id": "transfer_has_to_store",
            "table": "transfer",
            "property": "toStores"
        },
        {
            "id": "reference_store_has_receive_products",
            "table": "receive_product",
            "property": "receveSlips"
        }
    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin, UserRoles.BranchManager],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Finance],
    "deleteRoles": [UserRoles.Admin],
    "additionalFilter": [
        {
            "condition": [
                {
                    "left": UserRoles.Finance,
                    "operator": "notIn",
                    "right": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "connector": "AND"
                },
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
                    "column": "sys_id",
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
            "id": "ref_store_items",
            "table": "store_item",
            label: "R.M. Level",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells]
        },
        {
            "id": "ref_store_product",
            "table": "store_product",
            label: "F. Products Level",
            "column_id": "store_id",
            "order": 2,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells]
        },
        {
            "id": "ref_store_purchases",
            "table": "purchase",
            label: "Purchases",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
        },
        {
            "id": "ref_store_sells",
            "table": "sell",
            label: "Sells",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance]
        },
        {
            "id": "ref_store_productions",
            "table": "production",
            label: "R.M. Production Order",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager]
        },
        {
            "id": "ref_order_request_out",
            "table": "transfer",
            label: "Order Request Out",
            "column_id": "store_from_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance]
        },
        {
            "id": "ref_order_request_in",
            "table": "transfer",
            label: "Return Request",
            "column_id": "store_to_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells]
        },
        {
            "id": "ref_store_purchase_item",
            "table": "purchase_item",
            label: "R.M. In",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
        },
        {
            "id": "ref_store_consumption",
            "table": "production_consumption",
            label: "R.M. Out",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
        },
        {
            "id": "ref_store_produced_items",
            "table": "finished_product",
            label: "F.P. In",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager]
        },
        {
            "id": "ref_store_product_out",
            "table": "sell_product",
            label: "F.P. Out",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]
        },
        {
            "id": "ref_store_receive_product_out",
            "table": "receive_product",
            label: "Receive F.P.",
            "column_id": "store_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Finance]
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

module.exports = storeDefination;