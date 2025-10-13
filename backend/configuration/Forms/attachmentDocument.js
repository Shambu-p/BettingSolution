const FieldType = require("../../Interface/FieldType");
const UserRoles = require("../../Interface/UserRoles");
const { readRoles } = require("./accountDefination");

const attachmentDocument = {
	"name": "attachment_document",
	"backup_order": 21,
	title: "Attachment Document",
	id: "attachment_document",
	actions: [],
	activityRoles: [],
	canReadAttachment: [],
    canAddAttachment: [],
	realId: "sys_id",
	idColumn: "created_on",
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
			"readRoles": [UserRoles.Admin],
			"updateRoles": []
		},
		"content": {
			"type": FieldType.longText,
			"minLength": 1,
			"required": true,

			id: "content",
			label: "Content",
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
			notOnList: false,
			onChange: "default",

			"writeRoles": [UserRoles.Admin],
			"readRoles": [UserRoles.Admin],
			"updateRoles": []
		},
		"attachment_id": {
			"type": FieldType.reference,
			"minLength": 32,
			"maxLength": 38,
			"required": true,

			id: "attachment_id",
			label: "Attachment ID",
			description: "",
			order: 1,
			visible: true,
			readonly: true,
			notOnList: false,
			references: "attachment",
			displayField: "name",
			onChange: "default",

			"writeRoles": [UserRoles.Admin],
			"readRoles": [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
			"updateRoles": ["admin", "finance", "branch_manager", "sells"]
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
			notOnList: false,
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
			onChange: "default",
			references: "user",
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
			onChange: "default",
			references: "user",
			displayField: "full_name",
			"writeRoles": [UserRoles.Admin],
			"readRoles": [UserRoles.Admin],
			"updateRoles": []
		}
	},
	"writeRoles": [UserRoles.Admin],
	readRoles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
	"updateRoles": [UserRoles.Admin],
	"deleteRoles": [UserRoles.Admin],
	"keys": [
		{
			"id": "reference_attachmentDocument_attachment_attachment_id",
			"table": "attachment",
			"column": "attachment_id",
			"property": "Attachment"
		},
		{
			"id": "reference_attachmentDocument_user_created_by",
			"table": "user",
			"column": "created_by",
			"property": "creater"
		},
		{
			"id": "reference_attachmentDocument_user_updated_by",
			"table": "user",
			"column": "updated_by",
			"property": "updater"
		}
	],
	"children": [],
	"additionalFilter": [],
	"createAaccessCondition": true,
	"deleteAccessCondition": true,
	"updateAaccessCondition": true,

	onsubmit: "defaultOnsubmit",
	listLoader: "defaultListLoader",
	onload: "defaultOnload",
	relatedList: [
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
}


module.exports = attachmentDocument;