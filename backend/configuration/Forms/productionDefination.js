const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const productionDefination = {
    "name": "production",
    "backup_order": 40,
    title: "Production Order Raw Material",
    id: "production",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "prod_number",
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
        "prod_number": {
            "type": FieldType.string,
            "maxLength": 40,
            "minLength": 3,
            "required": false,
            unique: true,

            id: "prod_number",
            label: "Production Number",
            description: "",
            order: 1,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Finance],
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells],
            "updateRoles": []
        },
        "status": {
            id: "status",
            label: "Production Status",
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager]
        },
        "managed_by": {
            id: "managed_by",
            label: "Managed By",
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
        },
        "total_consumed_price": {
            id: "total_consumed_price",
            label: "Consumed Price",
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
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "total_produced_price": {
            id: "total_produced_price",
            label: "Produced Price",
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
            "readRoles": [UserRoles.Finance, UserRoles.Admin],
            "updateRoles": [UserRoles.Admin]
        },
        "remark": {
            id: "remark",
            label: "Remark",
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

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Finance, UserRoles.Admin, UserRoles.ProductionManager],
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Finance, UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager]
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin, UserRoles.ProductionManager]
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
            "id": "reference_store_has_production",
            "table": "store",
            "column": "store_id",
            "property": "productionStore"
        },
        {
            "id": "reference_production_managed_by",
            "table": "user",
            "column": "managed_by",
            "property": "ManagedBy"
        },
        {
            "id": "reference_production_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_production_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        },
    ],
    "children": [
        {
            "id": "reference_production_has_production_consumption",
            "table": "production_consumption",
            "property": "Consumption"
        },
        {
            "id": "reference_production_has_finished_product",
            "table": "finished_product",
            "property": "finishedProducts"
        },
        {
            "id": "reference_production_transaction",
            "table": "transaction",
            "property": "transactions"
        },
        {
            "id": "reference_production_has_receive_product",
            "table": "receive_product",
            "property": "ReceiveSlips"
        }
    ],
    "writeRoles": [UserRoles.Admin],
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
                    "column": "managed_by",
                    "operator": "equals",
                    "value": {
                        "name": "currentUser",
                        "property": "sys_id"
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
        before: "createProductionBefore"
    },
    "updateScript": {
        before: "updateProductionBefore",
        after: "updateProductionAfter"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_production_consumption",
            "table": "production_consumption",
            label: "Consumption",
            "column_id": "production_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
        },
        {
            "id": "ref_finished_product",
            "table": "finished_product",
            label: "Finished Goods",
            "column_id": "production_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Accept/Start Production",
            class: "btn-success",
            action: "acceptConsumption",
            condition: "acceptConsumptionCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin],
            lable: "Send Production Order",
            class: "btn-warning",
            action: "requestConsumption",
            condition: "requestConsumptionCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin],
            lable: "Ask Production Approval",
            class: "btn-warning",
            action: "requestProductionItemApproval",
            condition: "requestProductionItemApprovalCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin],
            lable: "Accept Produced Items",
            class: "btn-success",
            action: "acceptProducedItems",
            condition: "acceptProducedItemsCondition",
            stayOnForm: true
        },
        {
            roles: [UserRoles.Admin],
            lable: "Cancel",
            class: "btn-danger",
            action: "cancelProduction",
            condition: "cancelProductionCondition",
            stayOnForm: true
        },
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
            action: "changeProductionView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: true
        }
    ]
};

module.exports = productionDefination;