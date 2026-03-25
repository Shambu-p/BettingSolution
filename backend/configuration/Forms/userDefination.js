const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const userDefination = {
    "name": "user",
    "backup_order": 1,
    title: "User",
    id: "user",
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
    canAddAttachment: [],
    activityRoles: [UserRoles.Admin],
    realId: "sys_id",
    idColumn: "full_name",
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
        "full_name": {
            id: "full_name",
            label: "Full Name",
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
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "phone": {
            id: "phone",
            label: "Phone Number",
            description: "",
            "type": FieldType.string,
            "minLength": 10,
            "maxLength": 13,
            "unique": true,
            "required": true,

            order: 10,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "active": {
            id: "active",
            label: "Is Active",
            description: "",
            "type": FieldType.boolean,
            "required": true,
            "defaultValue": true,

            order: 20,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin]
        },
        "password": {
            id: "password",
            label: "Password",
            description: "",
            "type": FieldType.string,
            "minLength": 2,
            "maxLength": 100,

            order: 30,
            visible: false,
            readonly: false,
            notOnList: true,
            onChange: "default",

            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        },
        "created_on": {
            id: "created_on",
            label: "Created On",
            description: "",
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },

            order: 40,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Guest, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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

            order: 50,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Guest, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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

            order: 60,
            visible: true,
            readonly: true,
            notOnList: false,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Guest, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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

            order: 70,
            visible: true,
            readonly: true,
            notOnList: false,
            references: "user",
            displayField: "full_name",
            onChange: "default",

            "writeRoles": [],
            "readRoles": [UserRoles.Admin, UserRoles.Guest, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
            "updateRoles": []
        }
    },
    "keys": [
        {
            "id": "reference_user_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_user_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_user_roles",
            "table": "userRole",
            "property": "roles"
        },
        {
            id: "reference_order_user_id",
            table: "order",
            property: "ordersAsUser"
        },
        {
            id: "reference_order_seller_id",
            table: "order",
            property: "ordersAsSeller"
        },
        {
            id: "reference_order_user_created_by",
            table: "order",
            property: "ordersCreated"
        },
        {
            id: "reference_order_user_updated_by",
            table: "order",
            property: "ordersUpdated"
        },
        {
            "id": "reference_user_user_created_by",
            "table": "user",
            "property": "usersCreated"
        },
        {
            "id": "reference_user_user_updated_by",
            "table": "user",
            "property": "usersUpdated"
        },
        {
            "id": "reference_userRole_user_created_by",
            "table": "userRole",
            "property": "userRolesCreated"
        },
        {
            "id": "reference_userRole_user_updated_by",
            "table": "userRole",
            "property": "userRolesUpdated"
        },
        {
            "id": "reference_attachment_user_created_by",
            "table": "attachment",
            "property": "attachmentsCreated"
        },
        {
            "id": "reference_attachment_user_updated_by",
            "table": "attachment",
            "property": "attachmentsUpdated"
        },
        {
            "id": "reference_attachmentDocument_user_created_by",
            "table": "attachment_document",
            "property": "attachmentDocumentsCreated"
        },
        {
            "id": "reference_attachmentDocument_user_updated_by",
            "table": "attachment_document",
            "property": "attachmentDocumentsUpdated"
        },
        {
            "id": "reference_choice_user_created_by",
            "table": "choice",
            "property": "choicesCreated"
        },
        {
            "id": "reference_choice_user_updated_by",
            "table": "choice",
            "property": "choicesUpdated"
        },
        {
            "id": "reference_nav_role_user_created_by",
            "table": "navigation_role",
            "property": "NavigationsCreated"
        },
        {
            "id": "reference_nav_role_user_updated_by",
            "table": "navigation_role",
            "property": "NavigationsUpdated"
        },
        {
            "id": "reference_auto_number_user_updated_by",
            "table": "auto_number",
            "property": "autoGenerateUpdated"
        },
        {
            "id": "reference_activity_user_created_by",
            "table": "activity",
            "property": "activityCreated"
        },
        {
            "id": "reference_activity_user_updated_by",
            "table": "activity",
            "property": "activityUpdated"
        },
        {
            "id": "reference_api_user_created_by",
            "table": "api_user",
            "property": "CreatedApiUsers"
        },
        {
            "id": "reference_api_user_updated_by",
            "table": "api_user",
            "property": "UpdatedApiUsers"
        },
        {
            "id": "reference_endpoint_updated_by",
            "table": "endpoint",
            "property": "UpdatedEndpoints"
        },
        {
            "id": "reference_endpoint_created_by",
            "table": "endpoint",
            "property": "CreatedEndpoints"
        },

        {
            "id": "reference_process_user_created_by",
            "table": "process",
            "property": "processesCreated"
        },
        {
            "id": "reference_process_user_updated_by",
            "table": "process",
            "property": "processesUpdated"
        },
        {
            "id": "reference_flow_defination_user_created_by",
            "table": "flow_defination",
            "property": "flowsCreated"
        },
        {
            "id": "reference_flow_defination_user_updated_by",
            "table": "flow_defination",
            "property": "flowsUpdated"
        },
        {
            "id": "reference_waiting_process_user_created_by",
            "table": "waiting_process",
            "property": "waitingProcessesCreated"
        },
        {
            "id": "reference_waiting_process_user_updated_by",
            "table": "waiting_process",
            "property": "waitingProcessesUpdated"
        },
        {
            "id": "reference_ui_component_created_by",
            "table": "ui_component",
            "property": "UIComponentsCreated"
        },
        {
            "id": "reference_ui_component_updated_by",
            "table": "ui_component",
            "property": "UIComponentsUpdated"
        },
        {
            "id": "reference_system_nav_user_created_by",
            "table": "system_nav",
            "property": "navigationCreated"
        },
        {
            "id": "reference_system_nav_user_updated_by",
            "table": "system_nav",
            "property": "navigationUpdated"
        },



        {
            "id": "reference_inventory_created_by",
            "table": "inventory_item",
            "property": "inventoryCreated"
        },
        {
            "id": "reference_inventory_updated_by",
            "table": "inventory_item",
            "property": "inventoryUpdated"
        },
        {
            "id": "reference_delivery_created_by",
            "table": "delivery",
            "property": "deliveryCreated"
        },
        {
            "id": "reference_delivery_updated_by",
            "table": "delivery",
            "property": "deliveryUpdated"
        },
        {
            "id": "reference_product_user_created_by",
            "table": "product",
            "property": "productCreated"
        },
        {
            "id": "reference_product_user_updated_by",
            "table": "product",
            "column": "updated_by",
            "property": "productUpdated"
        },
        {
            "id": "reference_customer_user_created_by",
            "table": "customer",
            "property": "customerCreated"
        },
        {
            "id": "reference_customer_user_updated_by",
            "table": "customer",
            "property": "customerUpdated"
        },
        {
            "id": "reference_store_user_managed_by",
            "table": "store",
            "property": "manageStores"
        },
        {
            "id": "reference_store_user_created_by",
            "table": "store",
            "property": "storeCreated"
        },
        {
            "id": "reference_store_user_updated_by",
            "table": "store",
            "property": "storeUpdated"
        },
        {
            "id": "reference_store_item_user_created_by",
            "table": "store_item",
            "property": "storeItemCreated"
        },
        {
            "id": "reference_store_item_user_updated_by",
            "table": "store_item",
            "property": "storeItemUpdated"
        },
        {
            "id": "reference_product_store_product_user_created_by",
            "table": "store_product",
            "property": "storeProductCreated"
        },
        {
            "id": "reference_product_store_product_user_updated_by",
            "table": "store_product",
            "property": "storeProductUpdated"
        },
        {
            "id": "reference_purchase_approved_by",
            "table": "purchase",
            "property": "approvedPurchases"
        },
        {
            "id": "reference_purchase_user_created_by",
            "table": "purchase",
            "property": "purchaseCreated"
        },
        {
            "id": "reference_purchase_user_updated_by",
            "table": "purchase",
            "property": "purchaseUpdated"
        },
        {
            "id": "reference_purchase_item_user_created_by",
            "table": "purchase_item",
            "property": "purchaseItemCreated"
        },
        {
            "id": "reference_purchase_item_user_updated_by",
            "table": "purchase_item",
            "property": "purchaseItemUpdated"
        },
        {
            "id": "reference_service_created_by",
            "table": "service",
            "property": "serviceCreated"
        },
        {
            "id": "reference_service_updated_by",
            "table": "service",
            "property": "serviceUpdated"
        },
        {
            "id": "reference_production_managed_by",
            "table": "production",
            "property": "managedProductions"
        },
        {
            "id": "reference_production_user_created_by",
            "table": "production",
            "property": "productionsCreated"
        },
        {
            "id": "reference_production_user_updated_by",
            "table": "production",
            "property": "productionsUpdated"
        },
        {
            "id": "reference_auto_number_user_created_by",
            "table": "auto_number",
            "property": "autoGenerateCreated"
        },
        
        {
            "id": "reference_production_consumption_user_created_by",
            "table": "production_consumption",
            "property": "consumptionCreated"
        },
        {
            "id": "reference_production_consumption_user_updated_by",
            "table": "production_consumption",
            "property": "consumptionUpdated"
        },
        {
            "id": "reference_finished_product_user_created_by",
            "table": "finished_product",
            "property": "finishedProductCreated"
        },
        {
            "id": "reference_finished_product_user_updated_by",
            "table": "finished_product",
            "property": "finishedProductUpdated"
        },


        {
            "id": "reference_sell_sold_by",
            "table": "sell",
            "property": "Sells"
        },
        {
            "id": "reference_sell_user_created_by",
            "table": "sell",
            "property": "sellsCreated"
        },
        {
            "id": "reference_sell_user_updated_by",
            "table": "sell",
            "property": "sellsUpdated"
        },
        {
            "id": "reference_sell_product_user_created_by",
            "table": "sell_product",
            "property": "sellCreated"
        },
        {
            "id": "reference_sell_product_user_updated_by",
            "table": "sell_product",
            "property": "sellUpdated"
        },
        {
            "id": "reference_account_user_created_by",
            "table": "account",
            "property": "accountsCreated"
        },
        {
            "id": "reference_account_user_updated_by",
            "table": "account",
            "property": "accountsUpdated"
        },
        {
            "id": "reference_transaction_user_created_by",
            "table": "transaction",
            "property": "transactionsCreated"
        },
        {
            "id": "reference_transaction_user_updated_by",
            "table": "transaction",
            "property": "transactionsUpdated"
        },
        {
            "id": "reference_user_works_in_store",
            "table": "user_store",
            "property": "WorksIn"
        },
        {
            "id": "reference_userStore_user_created_by",
            "table": "user_store",
            "property": "userStoreCreated"
        },
        {
            "id": "reference_userStore_user_updated_by",
            "table": "user_store",
            "property": "userStoreUpdated"
        },
        {
            "id": "reference_transfer_user_created_by",
            "table": "transfer",
            "property": "transfersCreated"
        },
        {
            "id": "reference_transfer_user_updated_by",
            "table": "transfer",
            "property": "transfersUpdated"
        },
        {
            "id": "reference_transfer_product_user_created_by",
            "table": "transfer_product",
            "property": "transferProdctusCreated"
        },
        {
            "id": "reference_transfer_product_user_updated_by",
            "table": "transfer_product",
            "property": "transferProductsUpdated"
        },
        {
            "id": "reference_receive_product_has_receiver",
            "table": "receive_product",
            "property": "productReceived"
        },
        {
            "id": "reference_receive_product_has_created_by",
            "table": "receive_product",
            "property": "productReceivedCreater"
        },
        {
            "id": "reference_receive_product_has_updated_by",
            "table": "receive_product",
            "property": "productReceivedUpdater"
        },
        {
            "id": "reference_issue_user_created_by",
            "table": "issue_ticket",
            "property": "issuePoster"
        },
        {
            "id": "reference_issue_user_updated_by",
            "table": "issue_ticket",
            "property": "issueUpdater"
        },
        {
            "id": "reference_transfer_user_approved_by",
            "table": "transfer",
            "property": "approvedTransfers"
        },
        {
            "id": "reference_user_transfer_accepted_by",
            "table": "transfer",
            "property": "acceptedTransfers"
        },
        {
            "id": "reference_charger_station_user_created_by",
            "table": "station",
            "property": "StationCreated"
        },
        {
            "id": "reference_charger_station_user_updated_by",
            "table": "station",
            "property": "StationUpdated"
        },
        {
            "id": "reference_charger_payment_rate_user_created_by",
            "table": "payment_rate",
            "property": "PaymentRateCreated"
        },
        {
            "id": "reference_charger_payment_rate_user_updated_by",
            "table": "payment_rate",
            "property": "PaymentRateUpdated"
        },
        {
            "id": "reference_rate_range_user_created_by",
            "table": "rate_range",
            "property": "RateRangeCreated"
        },
        {
            "id": "reference_rate_range_user_updated_by",
            "table": "rate_range",
            "property": "RateRangeUpdated"
        },
        {
            "id": "reference_charger_connector_user_created_by",
            "table": "charger_connector",
            "property": "chargerConnectorCreated"
        },
        {
            "id": "reference_charger_connector_user_updated_by",
            "table": "charger_connector",
            "property": "chargerConnectorUpdated"
        },
        {
            "id": "reference_charger_access_card_user_user_id",
            "table": "charger_access_card",
            "property": "chargerAccessCardUser"
        },
        {
            "id": "reference_charger_access_card_user_created_by",
            "table": "charger_access_card",
            "property": "chargerAccessCardCreated"
        },
        {
            "id": "reference_charger_access_card_user_updated_by",
            "table": "charger_access_card",
            "property": "chargerAccessCardUpdated"
        },
        {
            "id": "reference_charger_trx_user_user_id",
            "table": "charger_trx",
            "property": "chargedUser"
        },
        {
            "id": "reference_charger_trx_user_created_by",
            "table": "charger_trx",
            "property": "chargerTrxCreated"
        },
        {
            "id": "reference_charger_trx_user_updated_by",
            "table": "charger_trx",
            "property": "chargerTrxUpdated"
        },




        {
            "id": "reference_main_trx_user_created_by",
            "table": "main_transaction",
            "property": "MainTrxCreated"
        },
        {
            "id": "reference_main_trx_user_updated_by",
            "table": "main_transaction",
            "property": "MainTrxUpdater"
        },
        {
            "id": "reference_post_user_created_by",
            "table": "post",
            "property": "postsCreated"
        },
        {
            "id": "reference_post_user_updated_by",
            "table": "post",
            "property": "postsUpdated"
        },

        


    ],
    "writeRoles": [UserRoles.Admin],
    "updateRoles": [UserRoles.Admin],
    "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner],
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
                }
            ],
            "filter": [
                {
                    "column": "sys_id",
                    "operator": "equals",
                    "value": {
                        "name": "currentUser",
                        "property": "Id"
                    },
                    "connector": "OR"
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
                }
            ],
            "filter": []
        }
    ],
    "createAccessCondition": true,
    "updateAccessCondition": true,
    // [
        // {
        //     "left": {
        //         "name": "currentUser",
        //         "property": "Id"
        //     },
        //     "operator": "equals",
        //     "right": {
        //         "name": "currentData",
        //         "property": "sys_id"
        //     },
        //     "connector": "OR"
        // }
    // ],
    "deleteAccessCondition": true,
    "createScript": {
        "before": "createUserBefore"
    },
    "updateScript": {
        "before": "updateUserBefore"
    },
    "deleteScript": {
    },
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_user_role",
            "table": "userRole",
            label: "User Role",
            "column_id": "user_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        },
        {
            "id": "ref_manage_stores",
            "table": "store",
            label: "Stores Managed",
            "column_id": "manager",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        },
        {
            "id": "ref_work_stores",
            "table": "user_store",
            label: "Works In",
            "column_id": "user_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        },
        {
            "id": "ref_charger_access_cards",
            "table": "charger_access_card",
            label: "Charger Access Cards",
            "column_id": "user_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner, UserRoles.Sells, , UserRoles.ChargeStationOperator, UserRoles.ChargeStationOwner]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        },
        {
            roles: [UserRoles.Admin],
            lable: "Reset Password",
            class: "btn-secondary",
            action: "resetPassword",
            condition: "userResetPasswordCondition",
            stayOnForm: true
        }
    ]
};

module.exports = userDefination;