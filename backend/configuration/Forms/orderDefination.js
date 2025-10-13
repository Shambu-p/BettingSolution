const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const orderDefination = {
    name: "order",
    backup_order: 90,
    title: "Orders",
    id: "order",
    realId: "sys_id",
    idColumn: "sys_id",
    fields: {
        sys_id: {
            type: FieldType.string,
            maxLength: 40,
            minLength: 32,
            required: false,
            id: "sys_id",
            label: "System Id",
            description: "",
            order: 1,
            visible: false,
            readonly: true,
            notOnList: true,
            onChange: "default",
            writeRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        },
        order_number: {
            type: FieldType.string,
            maxLength: 40,
            minLength: 3,
            required: false,
            unique: true,
            id: "order_number",
            label: "Order Number",
            description: "",
            order: 1.5,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        },
        user_id: {
            type: FieldType.reference,
            minLength: 32,
            maxLength: 38,
            required: true,
            id: "user_id",
            label: "Order by",
            description: "",
            order: 2,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "user",
            displayField: "full_name",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells]
        },
        seller_id: {
            type: FieldType.reference,
            minLength: 32,
            maxLength: 38,
            required: true,
            id: "seller_id",
            label: "Seller",
            description: "",
            order: 3,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            references: "user",
            displayField: "full_name",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells]
        },
        order_date: {
            type: FieldType.dateTime,
            id: "order_date",
            label: "Order Date",
            description: "",
            order: 4,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells]
        },
        delivered_date: {
            type: FieldType.dateTime,
            id: "delivered_date",
            label: "Delivered Date",
            description: "",
            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells]
        },
        status: {
            id: "status",
            label: "Order Status",
            description: "",
            type: FieldType.string,
            required: false,
            order: 6,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            writeRoles: [UserRoles.Admin, UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells]
        },
        description: {
            id: "description",
            label: "Description",
            description: "",
            type: FieldType.longText,
            minLength: 3,
            maxLength: 999,
            required: false,
            order: 7,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            writeRoles: [UserRoles.Client],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: [UserRoles.Client]
        },
        created_by: {
            id: "created_by",
            label: "Created by",
            type: FieldType.reference,
            minLength: 32,
            maxLength: 38,
            defaultValue: {
                name: "currentUser",
                property: "Id"
            },
            order: 40,
            visible: true,
            readonly: true,
            notOnList: true,
            references: "user",
            displayField: "full_name",
            onChange: "default",
            writeRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        },
        created_on: {
            id: "created_on",
            label: "Created On",
            type: FieldType.dateTime,
            defaultValue: {
                name: "currentDate"
            },
            order: 30,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",
            writeRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        },
        updated_by: {
            id: "updated_by",
            label: "Updated by",
            type: FieldType.reference,
            minLength: 32,
            maxLength: 38,
            defaultValue: {
                name: "currentUser",
                property: "Id"
            },
            order: 45,
            visible: true,
            readonly: true,
            notOnList: true,
            references: "user",
            displayField: "full_name",
            onChange: "default",
            writeRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        },
        updated_on: {
            id: "updated_on",
            label: "Updated On",
            type: FieldType.dateTime,
            defaultValue: {
                name: "currentDate"
            },
            order: 35,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",
            writeRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
            updateRoles: []
        }
    },
    keys: [
        {
            id: "reference_order_user_id",
            table: "user",
            column: "user_id",
            property: "user"
        },
        {
            id: "reference_order_seller_id",
            table: "user",
            column: "seller_id",
            property: "seller"
        },
        {
            id: "reference_order_user_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_order_user_updated_by",
            table: "user",
            column: "updated_by",
            property: "updater"
        }
    ],
    writeRoles: [UserRoles.Admin, UserRoles.Client],
    updateRoles: [UserRoles.Admin, UserRoles.Client, UserRoles.Sells],
    readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Client, UserRoles.Sells],
    deleteRoles: [UserRoles.Admin],
    createAccessCondition: true,
    updateAccessCondition: [],
    deleteAccessCondition: true,
    createScript: {},
    updateScript: {},
    deleteScript: {},
    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [],
    children: [
        {
            id: "reference_sell_order_id",
            table: "sell",
            property: "sells"
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        }
    ]
};

module.exports = orderDefination;
