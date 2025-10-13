const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const waitingProcessDefination = {
    name: "waiting_process",
    title: "Waiting Process",
    "backup_order": 40,
    id: "waiting_process",
    realId: "sys_id",
    idColumn: "sys_id",
    canReadAttachment: [UserRoles.Admin, UserRoles.System],
    canAddAttachment: [UserRoles.Admin, UserRoles.System],
    activityRoles: [UserRoles.Admin, UserRoles.System],

    fields: {
        sys_id: {
            type: FieldType.string,
            visible: false,
            readonly: true,
            order: 1,
            description: "",
            maxLength: 40,
            minLength: 32,
            required: false,
            id: "sys_id",
            label: "System Id",
            notOnList: true,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        table_id: {
            id: "table_id",
            label: "Table ID",
            type: FieldType.string,
            required: true,
            description: "The table name where the record exists",
            order: 2,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        record_id: {
            id: "record_id",
            label: "Record ID",
            type: FieldType.string,
            required: true,
            description: "The ID of the record being waited on",
            order: 3,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        variable_name: {
            id: "variable_name",
            label: "Variable Name",
            type: FieldType.string,
            required: true,
            description: "Name of the variable to store the record in",
            order: 4,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        process_id: {
            id: "process_id",
            label: "Process",
            type: FieldType.reference,
            references: "process",
            displayField: "sys_id",
            required: true,
            description: "The process waiting for the record",
            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        created_on: {
            id: "created_on",
            label: "Created On",
            type: FieldType.dateTime,
            readonly: true,
            order: 8,
            visible: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        updated_on: {
            id: "updated_on",
            label: "Updated On",
            type: FieldType.dateTime,
            readonly: true,
            order: 9,
            visible: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        created_by: {
            id: "created_by",
            label: "Created By",
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            readonly: true,
            order: 10,
            visible: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        updated_by: {
            id: "updated_by",
            label: "Updated By",
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            readonly: true,
            order: 11,
            visible: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        }
    },

    keys: [
        {
            id: "reference_waiting_process_process_id",
            table: "process",
            column: "process_id",
            property: "process"
        },
        {
            id: "reference_waiting_process_user_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_waiting_process_user_updated_by",
            table: "user",
            column: "updated_by",
            property: "updater"
        }
    ],

    children: [

    ],

    writeRoles: [UserRoles.Admin, UserRoles.System],
    updateRoles: [UserRoles.Admin, UserRoles.System],
    readRoles: [UserRoles.Admin, UserRoles.System],
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

    relatedList: [],
    actions: [
        {
            roles: [UserRoles.Admin, UserRoles.System],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        }
    ]
};

module.exports = waitingProcessDefination;
