const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const purchaseItemDefination = {
    "name": "purchase_item",
    "backup_order": 30,
    title: "Purchase Items",
    id: "purchase_item",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": []
        },
        "item_id": {
            id: "item_id",
            label: "Row Material",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
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
            onChange: "storeOnPurchaseItem",
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": []
        },
        "purchase_id": {
            id: "purchase_id",
            label: "Purchase Info",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "purchase",
            displayField: "purchase_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
        },
        "quantity": {
            id: "quantity",
            label: "Quantity",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
        },
        "unit_price": {
            id: "unit_price",
            label: "Unit Price",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "tax_percentage": {
            id: "tax_percentage",
            label: "Tax Percentage",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "before_tax": {
            id: "before_tax",
            label: "Price Before Tax",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin]
        },
        "tax_amount": {
            id: "tax_amount",
            label: "Tax Amount",
            description: "",
            "type": FieldType.float,
            "minLength": 1,
            "maxLength": 11,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance],
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
            "id": "reference_store_has_purchase_item",
            "table": "store",
            "column": "store_id",
            "property": "purchaseItemStore"
        },
        {
            "id": "reference_purchased_has_purchase_item",
            "table": "purchase",
            "column": "purchase_id",
            "property": "Purchase"
        },
        {
            "id": "reference_purchased_item_has_inventory_item",
            "table": "inventory_item",
            "column": "item_id",
            "property": "purchaseItem"
        },
        {
            "id": "reference_purchase_item_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_purchase_item_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
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
        after: "createPurchaseItemAfter",
        before: "createPurchaseItemBefore"
    },
    "updateScript": {
        after: "updatePurchaseItemAfter"
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
        //     label: "Store Items",
        //     "column_id": "store_id",
        //     "order": 1,
        //     "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
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

module.exports = purchaseItemDefination;