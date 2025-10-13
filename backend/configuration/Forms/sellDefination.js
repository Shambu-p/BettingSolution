const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const sellDefination = {
    "name": "sell",
    "backup_order": 40,
    title: "Sells",
    id: "sell",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "sell_number",
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
        "sell_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "sell_number",
            label: "Sell Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
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
            onChange: "default",
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": []
        },
        "status": {
            id: "status",
            label: "Sell Status",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 50,
            "required": false,

            order: 20,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "customer_id": {
            id: "customer_id",
            label: "Sold To",
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
            references: "customer",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "delivery_id": {
            id: "delivery_id",
            label: "Delivered By",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "delivery",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "sold_by": {
            id: "sold_by",
            label: "Sold By",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
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
            "readRoles": [UserRoles.Finance, UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "discount": {
            id: "discount",
            label: "Discount Percentage",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
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
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "has_receipt": {
            id: "has_receipt",
            label: "Has Receipt",
            description: "",
            "type": FieldType.boolean,
            "minLength": 1,
            "maxLength": 11,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
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
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "paid_price": {
            id: "paid_price",
            label: "Paid Price",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "remaining_price": {
            id: "remaining_price",
            label: "Remaining Price",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "order_id": {
            id: "order_id",
            label: "Order",
            description: "",
            type: FieldType.reference,
            minLength: 32,
            maxLength: 38,
            order: 9,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "order",
            displayField: "order_number",
            writeRoles: [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            readRoles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "cancel_reason": {
            id: "cancel_reason",
            label: "Cancellation Reason",
            description: "",
            "type": FieldType.longText,
            "minLength": 3,
            "maxLength": 999,
            "required": false,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]
        },
        "sold_date": {
            id: "sold_date",
            label: "Sold Date",
            description: "",
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            order: 30,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]
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
            notOnList: true,
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
            "id": "reference_sell_order_id",
            "table": "order",
            "column": "order_id",
            "property": "order"
        },
        {
            "id": "reference_sell_delivery",
            "table": "delivery",
            "column": "delivery_id",
            "property": "sellDelivery"
        },
        {
            "id": "reference_sell_customer",
            "table": "customer",
            "column": "customer_id",
            "property": "sellCustomer"
        },
        {
            "id": "reference_store_has_sell",
            "table": "store",
            "column": "store_id",
            "property": "sellStore"
        },
        {
            "id": "reference_sell_sold_by",
            "table": "user",
            "column": "sold_by",
            "property": "SoldBy"
        },
        {
            "id": "reference_sell_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_sell_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_sell_has_sell_product",
            "table": "sell_product",
            "property": "sellProducts"
        },
        {
            "id": "reference_sell_transaction",
            "table": "transaction",
            "property": "transactions"
        },
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
    "deleteRoles": [UserRoles.Admin],
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
                    "connector": "AND"
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.Finance,
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
        before: "createSellBefore"
    },
    "updateScript": {
        before: "updateSellBefore",
        after: "updateSellAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        // {
        //     "id": "ref_production_consumption",
        //     "table": "production_consumption",
        //     label: "Consumption",
        //     "column_id": "production_id",
        //     "order": 1,
        //     "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
        // },
        {
            "id": "ref_sell_products",
            "table": "sell_product",
            label: "Products",
            "column_id": "sell_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin, UserRoles.Finance],
            lable: "Confirm Sell",
            class: "btn-success",
            action: "soldSell",
            condition: "soldSellCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "Assigne Delivery",
            class: "btn-warning",
            action: "AssignedSell",
            condition: "sellAssignedCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "On the Way",
            class: "btn-warning",
            action: "sellOntheway",
            condition: "sellOnthewayCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "Delivered",
            class: "btn-success",
            action: "delivered",
            condition: "sellDeliveredCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "Cancel",
            class: "btn-danger",
            action: "cancelSell",
            condition: "cancelSellCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            lable: "Change View",
            class: "btn-success",
            action: "changeSellView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = sellDefination;