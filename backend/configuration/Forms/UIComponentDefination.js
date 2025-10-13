const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const UIComponentDefination = {
    name: "ui_component",
    title: "UI Component",
    id: "ui_component",
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
        title: {
            type: FieldType.string,
            label: "Title",
            id: "title",
            description: "",
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
        name: {
            type: FieldType.string,
            label: "Name",
            id: "name",
            description: "Unique identifier use only alphabet letters (no space and other signes)",
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
        ui_type: {
            type: FieldType.choice,
            options: [
                { value: "component", label: "Component" },
                { value: "page", label: "Page" }
            ],
            label: "Type",
            id: "ui_type",
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
        usage: {
            type: FieldType.choice,
            default: false,
            label: "Usage",
            description: "",
            id: "usage",
            options: [
                { value: "mobile", label: "on Mobile" },
                { value: "desktop", label: "on Desktop" },
                { value: "both", label: "on Both" }
            ],
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
        route_params: {
            type: FieldType.string,
            label: "Route Params",
            id: "route_params",
            description: "route params should be like /:id/:name/:sid...",
            maxLength: 200,
            minLength: 2,
            required: false,
            order: 1,
            visible: true,
            readonly: false,
            notOnList: false,
            onChange: "default",

            writeRoles: [UserRoles.Admin, UserRoles.System],
            updateRoles: [UserRoles.Admin, UserRoles.System],
            readRoles: [UserRoles.Admin, UserRoles.System],
        },
        component_script: {
            type: FieldType.script,
            maxLength: 30,
            minLength: 3,
            required: false,
            label: "Component Script",
            id: "trigger_environment",
            description: "",
            order: 4,
            visible: false,
            readonly: false,
            notOnList: false,
            onChange: "default",

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
            id: "reference_ui_component_created_by",
            table: "user",
            column: "created_by",
            property: "creater"
        },
        {
            id: "reference_ui_component_updated_by",
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
        "after": "createUIComponentAfter",
        "before": "createUIComponentBefore"
    },
    "updateScript": {
        "after": "updateUIComponentAfter",
    },
    "deleteScript": {
    },

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
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
            lable: "Build Page",
            class: "btn-success",
            action: "changeToPageBuilder",
            stayOnForm: true,
            noRedirect: true,
            notBelow: true,
            showOnNewForm: false
        }
    ]

};

module.exports = UIComponentDefination;
