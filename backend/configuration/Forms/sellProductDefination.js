const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const sellProductDefination = {
    "name": "sell_product",
    "backup_order": 45,
    title: "Sell Products",
    id: "sell_product",
    activityRoles: [UserRoles.Admin],
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "product_id",
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
        "product_id": {
            id: "product_id",
            label: "Product",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "product",
            displayField: "name",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "store_id": {
            id: "store_id",
            label: "Store/Branch/Seller",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "storeOnSellProduct",
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "sell_id": {
            id: "sell_id",
            label: "Sell Info",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "sell",
            displayField: "sell_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "unit_price": {
            id: "unit_price",
            label: "Unit Price",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
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

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
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
            "id": "reference_store_has_sell_product",
            "table": "store",
            "column": "store_id",
            "property": "sellProductStore"
        },
        {
            "id": "reference_sell_has_sell_product",
            "table": "sell",
            "column": "sell_id",
            "property": "Sell"
        },
        {
            "id": "reference_sell_product_has_product",
            "table": "product",
            "column": "product_id",
            "property": "sellProduct"
        },
        {
            "id": "reference_sell_product_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_sell_product_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
    "deleteRoles": [UserRoles.Admin, UserRoles.Sells],
    "additionalFilter": [
        {
            "condition": [
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "notIn",
                    "right": UserRoles.Admin,
                    "connector": "AND"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "notIn",
                    "right": UserRoles.Finance,
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
        after: "createSellProductAfter",
        before: "createSellProductBefore"
    },
    "updateScript": {
        after: "updateSellProductAfter",
        before: "updateSellProductBefore"
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

module.exports = sellProductDefination;