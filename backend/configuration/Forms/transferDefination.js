const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const transferDefination = {
    "name": "transfer",
    "backup_order": 90,
    title: "Sell Order",
    id: "transfer",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "transfer_number",
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
        "transfer_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "transfer_number",
            label: "Transfer Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": []
        },
        "store_from_id": {
            id: "store_from_id",
            label: "Out From",
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
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": []
        },
        "store_to_id": {
            id: "store_to_id",
            label: "Receiver",
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
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": []
        },
        "type": {
            id: "type",
            label: "Type",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 50,
            "required": true,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "status": {
            id: "status",
            label: "Status",
            description: "",
            "type": FieldType.choice,
            "minLength": 1,
            "maxLength": 50,
            "required": false,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.BranchManager, UserRoles.Finance]
        },
        "delivery_id": {
            id: "delivery_id",
            label: "Delivery",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
        },
        "sent_to": {
            id: "sent_to",
            label: "Sent To",
            description: "",
            "type": FieldType.string,
            "minLength": 5,
            "maxLength": 999,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
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
            readonly: true,
            notOnList: false,
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "accepted_by": {
            id: "accepted_by",
            label: "Accepted By",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "started_on": {
            id: "started_on",
            label: "Started On",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin]
        },
        "finished_on": {
            id: "finished_on",
            label: "Finished On",
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

            "writeRoles": [UserRoles.Admin, UserRoles.Finance],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance]
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
            "id": "transfer_has_from_store",
            "table": "store",
            "column": "store_from_id",
            "property": "fromStore"
        },
        {
            "id": "transfer_has_to_store",
            "table": "store",
            "column": "store_to_id",
            "property": "toStore"
        },
        {
            "id": "reference_transfer_delivery",
            "table": "delivery",
            "column": "delivery_id",
            "property": "DeliveredBy"
        },
        {
            "id": "reference_transfer_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_transfer_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        },
        {
            "id": "reference_transfer_user_approved_by",
            "table": "user",
            "column": "approved_by",
            "property": "approvedBy"
        },
        {
            "id": "reference_user_transfer_accepted_by",
            "table": "user",
            "column": "accepted_by",
            "property": "acceptedBy"
        }
    ],
    "children": [
        {
            "id": "reference_transfer_has_finished_product",
            "table": "transfer_product",
            "property": "transferProducts"
        },
    ],

    "writeRoles": [UserRoles.Admin, UserRoles.Finance],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Sells, UserRoles.BranchManager, UserRoles.Finance],
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
                    "left": UserRoles.Sells,
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
                    "column": "store_from_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
                    },
                    "connector": "OR"
                },
                {
                    "column": "store_to_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
                    },
                    "connector": "OR"
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
                },
                {
                    "left": {
                        "name": "currentUser",
                        "property": "Roles"
                    },
                    "operator": "contains",
                    "right": UserRoles.Sells,
                    "connector": "AND"
                }
            ],
            "filter": [
                {
                    "column": "store_to_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
                    },
                    "connector": "OR"
                },
                {
                    "column": "store_from_id",
                    "operator": "in",
                    "value": {
                        "name": "currentUser",
                        "property": "Stores"
                    },
                    "connector": "OR"
                },
                {
                    "column": "status",
                    "operator": "in",
                    "value": ["store_approved", "received", "cancelled"],
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
    "createAccessCondition": [
        {
            "left": {
                "name": "currentData",
                "property": "store_to_id"
            },
            "operator": "not",
            "right": {
                "name": "currentData",
                "property": "store_from_id"
            },
            "connector": "AND"
        }
    ],
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
        before: "createSellOrderBefore"
    },
    "updateScript": {
        before: "updateTransferBefore",
        after: "updateTransferAfter"
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
            "id": "ref_transfer_product",
            "table": "transfer_product",
            label: "Ordered Products",
            "column_id": "transfer_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells]
        }
    ],
    actions: [
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Accept/Start Production",
        //     class: "btn-success",
        //     action: "acceptConsumption",
        //     condition: "acceptConsumptionCondition",
        //     stayOnForm: true
        // },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Send Production Order",
        //     class: "btn-warning",
        //     action: "requestConsumption",
        //     condition: "requestConsumptionCondition",
        //     stayOnForm: true
        // },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Ask Production Approval",
        //     class: "btn-warning",
        //     action: "requestProductionItemApproval",
        //     condition: "requestProductionItemApprovalCondition",
        //     stayOnForm: true
        // },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Accept Produced Items",
        //     class: "btn-success",
        //     action: "acceptProducedItems",
        //     condition: "acceptProducedItemsCondition",
        //     stayOnForm: true
        // },
        // {
        //     roles: [UserRoles.Admin],
        //     lable: "Cancel",
        //     class: "btn-danger",
        //     action: "cancelProduction",
        //     condition: "cancelProductionCondition",
        //     stayOnForm: true
        // },
        // {
        //     roles: [UserRoles.Admin, UserRoles.BranchManager],
        //     lable: "Change View",
        //     class: "btn-success",
        //     action: "changeProductionView",
        //     stayOnForm: true,
        //     noRedirect: true,
        //     notBelow: true,
        //     showOnNewForm: true
        // },
        {
            roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            lable: "Change View",
            class: "btn-success",
            action: "changeTransferView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = transferDefination;