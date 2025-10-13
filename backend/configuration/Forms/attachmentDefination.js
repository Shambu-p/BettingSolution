const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");

const attachmentDefination = {
    "name": "attachment",
    "backup_order": 20,
    title: "Attachment",
    id: "attachment",
    actions: [],
    activityRoles: [],
    canReadAttachment: [],
    canAddAttachment: [],
    realId: "sys_id",
    idColumn: "name",
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
        "name": {
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 100,
            "required": true,

            id: "name",
			label: "Name",
			description: "",
			order: 1,
			visible: true,
			readonly: false,
			notOnList: false,
			onChange: "default",

            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "table": {
            "type": FieldType.string,
            "minLength": 3,
            "maxLength": 50,
            "required": true,
            id: "table",
			label: "Table Name",
			description: "",
			order: 1,
			visible: true,
			readonly: false,
			notOnList: false,
			onChange: "default",
            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "record": {
            "type": FieldType.string,
            "minLength": 32,
            "maxLength": 38,
            id: "record",
			label: "Record",
			description: "",
			order: 1,
			visible: true,
			readonly: false,
			notOnList: false,
			onChange: "default",
            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "file_name": {
            "type": FieldType.string,
            "minLength": 5,
            "maxLength": 100,
            id: "file_name",
			label: "File Name",
			description: "",
			order: 1,
			visible: true,
			readonly: false,
			notOnList: false,
			onChange: "default",
            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "extension": {
            "type": FieldType.string,
            "minLength": 1,
            "maxLength": 50,
            id: "extension",
			label: "Extension",
			description: "",
			order: 1,
			visible: true,
			readonly: false,
			notOnList: false,
			onChange: "default",
            "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
            "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]
        },
        "created_on": {
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },
            id: "created_on",
			label: "Created On",
			description: "",
			order: 1,
			visible: true,
			readonly: true,
			notOnList: true,
			onChange: "default",
            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_on": {
            "type": FieldType.dateTime,
            "defaultValue": {
                "name": "currentDate"
            },
            id: "updated_on",
			label: "Updated On",
			description: "",
			order: 1,
			visible: true,
			readonly: true,
			notOnList: true,
			onChange: "default",
            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "created_by": {
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },
            id: "created_by",
			label: "Created By",
			description: "",
			order: 1,
			visible: true,
			readonly: true,
			notOnList: true,
            references: "user",
			onChange: "default",
            displayField: "full_name",
            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        },
        "updated_by": {
            "type": FieldType.reference,
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },
            id: "updated_by",
			label: "Updated By",
			description: "",
			order: 1,
			visible: true,
			readonly: true,
			notOnList: true,
            references: "user",
			onChange: "default",
            displayField: "full_name",
            "writeRoles": [UserRoles.Admin],
            "readRoles": [UserRoles.Admin],
            "updateRoles": []
        }
    },
    "writeRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
    "readRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
    "updateRoles": [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells],
    "deleteRoles": [UserRoles.Admin],
    "keys": [
        {
            "id": "reference_attachment_user_created_by",
            "table": "user",
            "column": "created_by",
            "property": "creater"
        },
        {
            "id": "reference_attachment_user_updated_by",
            "table": "user",
            "column": "updated_by",
            "property": "updater"
        }
    ],
    "children": [
        {
            "id": "reference_attachmentDocument_attachment_attachment_id",
            "table": "attachment_document",
            "property": "Documents"
        }
    ],
    "additionalFilter": [],
    "createAaccessCondition": true,
    "deleteAccessCondition": true,
    "updateAaccessCondition": true,

    onsubmit: "defaultOnsubmit",
    listLoader: "defaultListLoader",
    onload: "defaultOnload",
    relatedList: [
        {
            "id": "ref_attachment_docs",
            "table": "attachment_document",
            label: "Documents",
            "column_id": "attachment_id",
            "order": 1,
            "readRoles": [UserRoles.Admin]
        }
    ],
    actions: [
        {
            roles: [UserRoles.Admin],
            lable: "Update",
            class: "zbtn",
            action: "defaultUpdate",
            stayOnForm: true
        }
    ]
};

module.exports = attachmentDefination;