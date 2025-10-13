const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const purchaseDefination = {
    "name": "purchase",
    "backup_order": 25,
    title: "Purchase",
    id: "purchase",
    activityRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
    canReadAttachment: [UserRoles.Admin, UserRoles.Finance],
    canAddAttachment: [UserRoles.Admin, UserRoles.Finance],
    realId: "sys_id",
    idColumn: "purchase_number",
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
        "purchase_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "purchase_number",
            label: "Purchase Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": []
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager],
            "updateRoles": []
        },
        "customer_id": {
            id: "customer_id",
            label: "Customer/Vendor",
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
            references: "customer",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
        },
        "status": {
            id: "status",
            label: "Purchase Status",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 20,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
        },
        "approved_by": {
            id: "approved_by",
            label: "Approved By",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance]
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
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "paid_amount": {
            id: "paid_amount",
            label: "Paid Amount",
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

            "writeRoles": [],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "remained_amount": {
            id: "remained_amount",
            label: "Remained Amount",
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

            "writeRoles": [],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
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

            "writeRoles": [],
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
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
            "id": "reference_store_has_purchase",
            "table": "store",
            "column": "store_id",
            "property": "purchaseStore"
        },
        {
            "id": "reference_purchase_approved_by",
            "table": "user",
            "column": "approved_by",
            "property": "ApprovedBy"
        },
        {
            "id": "reference_purchase_customer",
            "table": "customer",
            "column": "customer_id",
            "property": "boughtFrom"
        },
        {
            "id": "reference_purchase_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_purchase_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_purchased_has_purchase_item",
            "table": "purchase_item",
            "property": "purchaseItems"
        },
        {
            "id": "reference_purchase_transaction",
            "table": "transaction",
            "property": "transactions"
        },
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.Finance],
    "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
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
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.BranchManager,
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
                },
                {
                    "column": "status",
                    "operator": "not",
                    "value": "draft",
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
        before: "createPurchaseBefore"
    },
    "updateScript": {
        before: "updatePurchaseBefore",
        after: "updatePurchaseAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "purchaseOnLoad",
    relatedList: [
        {
            "id": "ref_purchase_items",
            "table": "purchase_item",
            label: "Purchase Items",
            "column_id": "purchase_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
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
            roles: [UserRoles.Admin, UserRoles.BranchManager],
            lable: "Approve",
            class: "btn-success",
            action: "approvePurchase",
            condition: "purchaseApprovalButtonCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager],
            lable: "Change View",
            class: "btn-success",
            action: "changePurchaseView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = purchaseDefination;