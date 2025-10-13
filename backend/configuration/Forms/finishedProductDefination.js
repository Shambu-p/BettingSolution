const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const finishedProductDefination = {
    "name": "finished_product",
    "backup_order": 50,
    title: "Produced Items",
    id: "finished_product",
    canReadAttachment: [UserRoles.Admin],
    canAddAttachment: [],
    activityRoles: [UserRoles.Admin],
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
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
            displayField: "product_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin,UserRoles.ProductionManager]
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
            onChange: "storeOnFinishedProduct",
            references: "store",
            displayField: "name",

            "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin,UserRoles.ProductionManager]
        },
        "production_id": {
            id: "production_id",
            label: "Production Info",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "production",
            displayField: "prod_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin,UserRoles.ProductionManager]
        },
        "slip_id": {
            id: "slip_id",
            label: "Slip Info",
            description: "",
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "required": true,

            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            references: "receive_product",
            displayField: "slip_number",
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin,UserRoles.ProductionManager]
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

            "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
            "updateRoles": [UserRoles.Admin,UserRoles.ProductionManager]
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

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
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
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager],
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
            "id": "reference_store_has_finished_product",
            "table": "store",
            "column": "store_id",
            "property": "finishedProductStore"
        },
        {
            "id": "reference_production_has_finished_product",
            "table": "production",
            "column": "production_id",
            "property": "Production"
        },
        {
            "id": "reference_slip_has_finished_product",
            "table": "receive_product",
            "column": "slip_id",
            "property": "ReceiveSlip"
        },
        {
            "id": "reference_finished_product_has_product",
            "table": "product",
            "column": "product_id",
            "property": "producedItem"
        },
        {
            "id": "reference_finished_product_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_finished_product_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
    ],
    "writeRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
    "updateRoles": [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
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
        after: "createFinishedProductAfter",
        before: "createFinishedProductBefore"
    },
    "updateScript": {
        before: "updateFinishedProductBefore",
        after: "updateFinishedProductAfter"
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
            roles: [UserRoles.Admin, UserRoles.ProductionManager],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        }
    ]
};

module.exports = finishedProductDefination;