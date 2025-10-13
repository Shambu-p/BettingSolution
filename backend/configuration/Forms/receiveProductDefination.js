const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const receiveProductDefination = {
    "name": "receive_product",
    "backup_order": 45,
    title: "Product Receiving Slip",
    id: "receive_product",
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
    canAddAttachment: [UserRoles.Admin, UserRoles.BranchManager],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "slip_number",
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
        "slip_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "slip_number",
            label: "Production Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": []
        },
        "production_id": {
            id: "production_id",
            label: "Production",
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
            references: "production",
            displayField: "prod_number",

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": []
        },
        "status": {
            id: "status",
            label: "Receive Status",
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

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager]
        },
        "received_by": {
            id: "received_by",
            label: "Received By",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": false,

            order: 10,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",
            references: "user",
            displayField: "full_name",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
        },
        "received_on": {
            id: "received_on",
            label: "Received On",
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
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
            "id": "reference_production_has_receive_product",
            "table": "production",
            "column": "production_id",
            "property": "Production"
        },
        {
            "id": "reference_store_has_receive_products",
            "table": "store",
            "column": "store_id",
            "property": "Store"
        },
        {
            "id": "reference_receive_product_has_receiver",
            "table": "user",
            "column": "received_by",
            "property": "Receiver"
        },
        {
            "id": "reference_receive_product_has_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_receive_product_has_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_slip_has_finished_product",
            "table": "finished_product",
            "property": "finishedProducts"
        },
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
    "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
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
                    "right": UserRoles.ProductionManager,
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
                    "column": "Production.managed_by",
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
        {
            "left": {
                "name": "currentUser",
                "property": "Stores"
            },
            "operator": "contains",
            "right": {
                "name": "currentData",
                "property": "store_id"
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
            "left": "consumption_confirmed",
            "operator": "equals",
            "right": {
                "name": "currentData",
                "property": "Production.status"
            },
            "connector": "AND"
        }
    ],
    "deleteAccessCondition": true,
    "createScript": {
        before: "createReceiveProductBefore"
    },
    "updateScript": {
        before: "updateReceiveProductBefore",
        after: "updateReceiveProductAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_finished_product",
            "table": "finished_product",
            label: "Products",
            "column_id": "slip_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager]
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
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin, UserRoles.BranchManager],
            lable: "Change View",
            class: "btn-success",
            action: "changeSlipView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = receiveProductDefination;