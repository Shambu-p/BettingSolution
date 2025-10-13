const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const postDefination = {
    name: "post",
    title: "Post",
    id: "post",
    backup_order: 50,
    realId: "sys_id",
    idColumn: "title",
    canReadAttachment: [UserRoles.Admin, UserRoles.System],
    canAddAttachment: [UserRoles.Admin, UserRoles.System],
    activityRoles: [UserRoles.Admin, UserRoles.System],


    fields: {
        sys_id: {
            type: FieldType.string,
            maxLength: 40,
            minLength: 32,
            required: false,
            id: "sys_id",
            label: "System Id",
            visible: false,
            readonly: true,
            notOnList: true,
            order: 1,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        title: {
            type: FieldType.string,
            required: true,
            id: "title",
            label: "Title",
            minLength: 3,
            maxLength: 50,
            visible: true,
            readonly: false,
            notOnList: false,
            order: 2,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Guest],
        },
        description: {
            type: FieldType.longText,
            required: true,
            minLength: 3,
            maxLength: 900,
            id: "description",
            label: "Description",
            visible: true,
            readonly: false,
            notOnList: true,
            order: 3,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Guest],
        },
        created_on: {
            type: FieldType.dateTime,
            readonly: true,
            id: "created_on",
            label: "Created On",
            visible: true,
            readonly: true,
            notOnList: false,
            order: 4,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        updated_on: {
            type: FieldType.dateTime,
            readonly: true,
            id: "updated_on",
            label: "Updated On",
            visible: true,
            notOnList: false,
            order: 5,
            onChange: "default",
            
            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        created_by: {
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            minLength: 32,
            maxLength: 38,
            readonly: true,
            id: "created_by",
            label: "Created By",
            visible: true,
            notOnList: false,
            order: 6,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        updated_by: {
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            minLength: 32,
            maxLength: 38,
            readonly: true,
            id: "updated_by",
            label: "Updated By",
            visible: true,
            readonly: true,
            notOnList: false,
            order: 7,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        }
    },
    keys: [
        {
            id: "reference_post_user_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_post_user_updated_by",
            table: "user",
            column: "updated_by",
            property: "updater"
        }
    ],

    children: [],

    writeRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
    updateRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
    readRoles: [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells, UserRoles.Guest],
    deleteRoles: [UserRoles.Admin, UserRoles.System],

    "additionalFilter": [],
    "createAccessCondition": true,
    "updateAccessCondition": true,
    "deleteAccessCondition": true,


    "createScript": {
    },
    "updateScript": {
    },
    "deleteScript": {
    },

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [],
    actions: [
        {
            roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.System],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        }
    ]

};

module.exports = postDefination;
