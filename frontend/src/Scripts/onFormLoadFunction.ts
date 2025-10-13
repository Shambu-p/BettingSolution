import { equal } from "assert";
import { props } from "../APIs/api";
import MainAPI from "../APIs/MainAPI";
import FieldTypes from "../Enums/FiedTypes";
import TransactionCategory from "../Enums/TransactionCategory";
import UserRoles from "../Enums/UserRoles";
import { mapSingle } from "../Forms/FormUtils";
import AuthResult from "../Intefaces/AuthResult";
import IField from "../Intefaces/IField";
import LocalData from "../Intefaces/LocalData";
import Utils from "../Models/Utils";

const onFormLoadFunction: any = {

    defaultOnload: async (token: string, all_fields: any[], localData: LocalData | any, loggedUser: AuthResult | any, id?: any, table_id?: string): Promise<IField[]> => {

        let is_new_form = (id == "-1")
        let mappings: any = {};

        let data = {};
        if(!is_new_form) {
            data = await MainAPI.getSingle(token, (table_id ?? ""), id);
        }

        all_fields.forEach((fld) => {

            mappings[fld.id] = (data: any) => {

                let value = "";

                if(!is_new_form) {

                    if(FieldTypes.DATETIME == fld.type) {
                        value = Utils.isoToDateTimeLocal(data[fld.id]);
                    } else if(fld.type == FieldTypes.DATE) {
                        value = Utils.dateInputFormat(data[fld.id]);
                    } else {
                        value = data[fld.id];
                    }

                }

                return {
                    value,
                    visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                    readonly: fld.readonly || ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                };

            };
        });

        return mapSingle(all_fields, mappings, data);

    },
    purchaseOnLoad: async (token: string, all_fields: any[], localData: LocalData | any, loggedUser: AuthResult | any, id?: any, table_id?: string): Promise<IField[]> => {

        let is_new_form = (id == "-1")
        let mappings: any = {};

        let data = {};
        if(!is_new_form) {
            data = await MainAPI.getSingle(token, (table_id ?? ""), id);
        }

        all_fields.forEach((fld) => {

            mappings[fld.id] = (data: any) => {

                let value = "";

                if(!is_new_form) {

                    if(FieldTypes.DATETIME == fld.type) {
                        value = Utils.isoToDateTimeLocal(data[fld.id]);
                    } else if(fld.type == FieldTypes.DATE) {
                        value = Utils.dateInputFormat(data[fld.id]);
                    } else {
                        value = data[fld.id];
                    }

                }

                if(fld.id == "status" && value == "confirmed") {
                    mappings.status.readonly = true;
                    return {
                        value,
                        visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                        readonly: true
                    };
                }

                return {
                    value,
                    visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                    readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                };

            };
        });

        let final_fields = mapSingle(all_fields, mappings, data);
        console.log("final fields from purchaseOnLoad", final_fields);
        return final_fields;

    },
    consumptionOnLoad: async (token: string, all_fields: any[], localData: LocalData | any, loggedUser: AuthResult | any, id?: any, table_id?: string): Promise<IField[]> => {

        let is_new_form = (id == "-1")
        let mappings: any = {};

        let data = {};
        if(!is_new_form) {
            data = await MainAPI.getSingle(token, (table_id ?? ""), id);
        }

        all_fields.forEach((fld) => {

            mappings[fld.id] = (data: any) => {

                let value = "";

                if(!is_new_form) {

                    if(FieldTypes.DATETIME == fld.type) {
                        value = Utils.isoToDateTimeLocal(data[fld.id]);
                    } else if(fld.type == FieldTypes.DATE) {
                        value = Utils.dateInputFormat(data[fld.id]);
                    } else {
                        value = data[fld.id];
                    }

                }

                if(fld.id == "status" && value != "draft") {
                    return {
                        value,
                        visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                        readonly: true
                    };
                } else if(fld.id == "item_id") {
                    return {
                        value,
                        referenceCondition: {
                            type: "raw_material"
                        },
                        visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                } else {
                    return {
                        value,
                        visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                }


            };
        });

        let final_fields = mapSingle(all_fields, mappings, data);
        console.log("final fields from purchaseOnLoad", final_fields);
        return final_fields;

    },
    transactionOnLoad: async (token: string, all_fields: any[], localData: LocalData | any, loggedUser: AuthResult | any, id?: any, table_id?: string): Promise<IField[]> => {

        let is_new_form = (id == "-1")
        let mappings: any = {};

        let data = {};
        if(!is_new_form) {
            data = await MainAPI.getSingle(token, (table_id ?? ""), id);
        }

        for(let fld of all_fields) {

            mappings[fld.id] = (data: any) => {

                let value = "";

                if(!is_new_form) {

                    if(FieldTypes.DATETIME == fld.type) {
                        value = Utils.isoToDateTimeLocal(data[fld.id]);
                    } else if(fld.type == FieldTypes.DATE) {
                        value = Utils.dateInputFormat(data[fld.id]);
                    } else {
                        value = data[fld.id];
                    }

                }

                if(fld.id == "purchase_id") {
                    return {
                        value,
                        referenceCondition: {
                            status: "confirmed"
                        },
                        visible: (Utils.roleCheck(loggedUser.Roles, fld.readRoles) && TransactionCategory.purchase == data.category),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                } else if(fld.id == "sell_id") {
                    return {
                        value,
                        referenceCondition: {
                            AND: [
                                {status: { not: "paid" }},
                                {status: { not: "draft" }}
                            ]
                        },
                        visible: (Utils.roleCheck(loggedUser.Roles, fld.readRoles) && [TransactionCategory.sell, TransactionCategory.tax].includes(data.category)),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                } else if(fld.id == "service_id") {
                    return {
                        value,
                        referenceCondition: {
                        },
                        visible: (Utils.roleCheck(loggedUser.Roles, fld.readRoles) && TransactionCategory.serviceFee == data.category),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                } else if(fld.id == "production_id") {
                    return {
                        value,
                        referenceCondition: {
                            OR: [
                                {status: { equals: "consumption_confirmed" }},
                                {status: { equals: "production_confirmed" }}
                            ]
                        },
                        visible: (Utils.roleCheck(loggedUser.Roles, fld.readRoles) && TransactionCategory.production == data.category),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                } else {
                    return {
                        value,
                        visible: (fld.visible && Utils.roleCheck(loggedUser.Roles, fld.readRoles)),
                        readonly: ((is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.writeRoles)) || (!is_new_form && !Utils.roleCheck(loggedUser.Roles, fld.updateRoles)))
                    };
                }


            };
        };

        let final_fields = mapSingle(all_fields, mappings, data);
        console.log("final fields from transaction on load", final_fields);
        return final_fields;

    },

};

export default onFormLoadFunction;