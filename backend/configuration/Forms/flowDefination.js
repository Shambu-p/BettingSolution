const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const flowDefination = {
    name: "flow_defination",
    title: "Flow Definition",
    id: "flow_defination",
    "backup_order": 20,
    realId: "sys_id",
    idColumn: "name",
    canReadAttachment: [UserRoles.Admin, UserRoles.System],
    canAddAttachment: [UserRoles.Admin, UserRoles.System],
    activityRoles: [UserRoles.Admin, UserRoles.System],

    fields: {
        sys_id: {
            id: "sys_id",
            label: "System Id",
            type: FieldType.string,
            description: "",
            maxLength: 40,
            minLength: 32,
            required: false,
            order: 1,
            visible: false,
            readonly: true,
            notOnList: true,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        name: {
            type: FieldType.string,
            label: "Name",
            id: "name",
            description: "",
            maxLength: 100,
            minLength: 2,
            required: true,
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        internal_name: {
            type: FieldType.string,
            label: "Internal Name",
            id: "internal_name",
            description: "Unique identifier (letters, numbers, underscores only)",
            maxLength: 100,
            minLength: 2,
            required: true,
            unique: true,

            order: 2,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        initiation_type: {
            type: FieldType.choice,
            options: [
                { value: "manual", label: "Manual" },
                { value: "time_based", label: "Scheduled" },
                { value: "record_based", label: "Record Based" }
            ],
            label: "Initiation Type",
            id: "initiation_type",
            description: "",
            maxLength: 30,
            minLength: 3,
            required: true,
            order: 3,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        trigger_environment: {
            type: FieldType.choice,
            maxLength: 30,
            minLength: 3,
            required: false,
            label: "Trigger Environment",
            id: "trigger_environment",
            description: "",
            options: [
                { value: "user_interaction_only", label: "User Interaction" },
                { value: "both", label: "System & User Interaction" }
            ],
            order: 4,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        next_run_date: {
            type: FieldType.dateTime,
            required: false,
            label: "Next Run Date",
            id: "next_run_date",
            description: "",
            order: 5,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        table_id: {
            type: FieldType.string,
            maxLength: 50,
            required: false,
            label: "Table ID",
            description: "Optional reference to a database table",
            id: "table_id",
            description: "",
            order: 6,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        specification: {
            type: FieldType.json,
            maxLength: 50,
            required: false,
            label: "Specification",
            description: "",
            id: "specification",
            order: 6,
            visible: true,
            readonly: true,
            notOnList: true,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        active: {
            type: FieldType.boolean,
            default: false,
            label: "Active",
            description: "Whether this flow is active",
            id: "active",
            description: "",
            order: 7,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            required: true,

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        created_on: { 
            type: FieldType.dateTime,
            readonly: true,
            id: "created_on",
            label: "Created On",
            description: "",
            order: 8,
            visible: true,
            readonly: true,
            notOnList: false,
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
            description: "",
            order: 9,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        created_by: {
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            readonly: true,
            id: "created_by",
            label: "Created By",
            description: "",
            order: 10,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        updated_by: {
            type: FieldType.reference,
            references: "user",
            displayField: "full_name",
            readonly: true,
            id: "updated_by",
            label: "Updated By",
            description: "",
            order: 11,
            visible: true,
            readonly: true,
            notOnList: false,

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        }
    },
    
    keys: [
        {
            id: "reference_flow_defination_user_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_flow_defination_user_updated_by",
            table: "user",
            column: "updated_by",
            property: "updater"
        }
    ],

    children: [
        {
            id: "reference_flow_definition_processes",
            table: "process",
            property: "processes",
        }
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
        // "after": "createFlowAfter",
        "before": "createFlowBefore"
    },
    "updateScript": {
    },
    "deleteScript": {
    },

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_flow_processes",
            "table": "process",
            label: "Processes",
            "column_id": "flow_id",
            "order": 1,
            "readRoles": [UserRoles.Admin, UserRoles.System]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin, UserRoles.System],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: false
        },
        {
            roles: [UserRoles.Admin, UserRoles.System],
            lable: "Flow Designer",
            class: "btn-success",
            action: "changeFlowView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: false
        },
        {
            roles: [UserRoles.Admin, UserRoles.System],
            lable: "Test Flow",
            class: "btn-primary",
            action: "testFlowView",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: false
        }
    ]

};

module.exports = flowDefination;
