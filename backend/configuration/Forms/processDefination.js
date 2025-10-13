const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const processDefination = {
    name: "process",
    title: "Process",
    id: "process",
    "backup_order": 30,
    realId: "sys_id",
    idColumn: "flow_id",
    canReadAttachment: [UserRoles.Admin, UserRoles.BranchManager],
    canAddAttachment: [UserRoles.Admin],
    activityRoles: [UserRoles.Admin],
    
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
            visible: false,
            notOnList: true,
            onChange: "default",

            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        flow_id: {
            id: "flow_id",
            label: "Flow Definition",
            type: FieldType.reference,
            references: "flow_defination",
            displayField: "name",
            required: true,
            description: "The flow definition this process belongs to",
            order: 2,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        state: {
            id: "state",
            label: "State",
            type: FieldType.choice,
            maxLength: 50,
            minLength: 3,
            required: true,
            order: 3,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",
            options: [
                { value: "RUNNING", label: "Running" },
                { value: "COMPLETED", label: "Completed" },
                { value: "FAILED", label: "Failed" },
                { value: "CANCELLED", label: "Cancelled" }
            ],

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        started_on: {
            id: "started_on",
            label: "Started On",
            type: FieldType.dateTime,
            required: true,
            order: 4,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        finished_on: {
            id: "finished_on",
            label: "Finished On",
            type: FieldType.dateTime,
            required: false,
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
            order: 9,
            visible: true,
            readonly: true,
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
            order: 10,
            visible: true,
            readonly: true,
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
            order: 11,
            visible: true,
            readonly: true,
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
            order: 12,
            visible: true,
            readonly: true,
            notOnList: false,
            onChange: "default",
            
            writeRoles: [],
            updateRoles: [],
            readRoles: [UserRoles.Admin, UserRoles.System],
        }
    },
    
    keys: [
        {
            id: "reference_flow_definition_processes",
            table: "flow_defination",
            column: "flow_id",
            property: "flow"
        },
        {
            id: "reference_process_user_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_process_user_updated_by",
            table: "user",
            column: "updated_by",
            property: "updater"
        }
    ],
    
    children: [
        {
            id: "reference_waiting_process_process_id",
            table: "waiting_process",
            property: "waitingProcesses"
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
    
    // listView: {
    //     defaultSort: { field: "started_on", order: "desc" },
    //     columns: ["flow_id", "state", "started_on", "finished_on", "created_by"],
    //     pageSize: 20
    // },
    
    // formLayout: {
    //     sections: [
    //         {
    //             title: "Process Information",
    //             fields: ["flow_id", "state", "started_on", "finished_on", "error_message"]
    //         },
    //         {
    //             title: "Input/Output",
    //             fields: ["input_parameters", "output_result"]
    //         },
    //         {
    //             title: "Audit Information",
    //             fields: ["created_on", "updated_on", "created_by", "updated_by"]
    //         }
    //     ]
    // }

    "createScript": {
    },
    "updateScript": {
        "before": "updateProcessBefore"
    },
    "deleteScript": {
    },

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [],
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
            lable: "Execution Detail",
            class: "btn-secondary",
            action: "processDetailview",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: false
        }
    ]
};

module.exports = processDefination;
