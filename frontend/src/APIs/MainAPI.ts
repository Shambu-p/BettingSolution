
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import IPagination from "../Intefaces/IPagination";
import Utils from "../Models/Utils";
import { authFileRequest, Authorized } from "./api";

class MainAPI {

    private static valueMapper(new_value: {operator: string, value: any, type: string}) {

        if(new_value.type == FieldTypes.NUMBER || new_value.type == FieldTypes.REFERENCE) {
            new_value.value = Number.isInteger(new_value.value) ? parseInt(new_value.value) : parseFloat(new_value.value);
        } else if((new_value.type == FieldTypes.DATE || new_value.type == FieldTypes.DATETIME)) {
            new_value.value = new Date(new_value.value).toISOString();
        }

        return new_value;

    }

    // public static async getAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

    //     try {
    //         // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
    //         // let query = "";

    //         // let new_condition: any = {};

    //         // for (const key in condition) {
    //         //     new_condition[key] = this.valueMapper(condition[key]);
    //         // }
            
    //         return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}`, condition);

    //     } catch (error: any) {
    //         console.log(error.message);
    //         return {
    //             Items: [],
    //             PageNumber: 1,
    //             PageSize: 10,
    //             TotalCount: 0
    //         };
    //     }
    // }
    
    public static async getorAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {

            // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
            // let query = "";

            // let new_condition: any = {};

            // for (const key in condition) {
            //     new_condition[key] = this.valueMapper(condition);
            // }
            
            return await Authorized(token).bodyRequest("post", `crud/getorlist/${tableName}/${pageNumber}/${pageSize}?relation=reference`, condition ?? {});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any, relation?: ("reference"|"children"|"children_reference")): Promise<IPagination<any>> {

        try {

            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?${relation ? "relation=" : ""}${(relation ?? "")}`, {condition: Utils.objectToQueryObject(condition), sort: {created_on: "desc"}});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getReportConfigs(token: string): Promise<any> {

        try {

            return await Authorized(token).bodyRequest("get", `crud/get_report_config`);

        } catch (error: any) {
            console.log(error.message);
            return {};
        }
    }

    public static async getWithDirectCondition(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any, relation?: ("reference"|"children"|"children_reference")): Promise<IPagination<any>> {

        try {

            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?${relation ? "relation=" : ""}${(relation ?? "")}`, {condition});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getReportData(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any, order_by?: any): Promise<IPagination<any>> {

        try {

            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?relation=reference`, {condition, sort: (order_by ?? {created_on: "asc"})});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getAllv2(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any, order_by?: any, relation?: ("reference"|"children"|"children_reference")): Promise<IPagination<any>> {

        try {

            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}${relation ? ("?relation=" + relation) : ""}`, {condition, sort: (order_by ?? {created_on: "asc"})});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async loadAttachments(token: string, table: string, record_id: string): Promise<IPagination<any>> {

        try {
            // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
            // let query = "";
            return await Authorized(token).bodyRequest("post", `crud/getlist/attachment/1/0`, {
                condition: Utils.objectToQueryObject({
                    record: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: record_id
                    },
                    table: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: table
                    }
                })
            });
        } catch (error: any) {
            // console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async loadActivities(token: string, table: string, record_id: string): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/activity/1/0?relation=reference`, {
                condition: Utils.objectToQueryObject({
                    record_id: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: record_id
                    },
                    table_id: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: table
                    }
                }),
                sort: {
                    created_on: "desc"
                }
            });
        } catch (error: any) {
            // console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getSingle(token: string, tableName: string, id: string, relation?: ("reference"|"children"|"children_reference")): Promise<any> {
        try {
            return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}?${relation ? "relation=" : ""}${(relation ?? "")}`);
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getSingleRelated(token: string, tableName: string, id: number): Promise<any> {
        try {
            return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}?type=related`);
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getAllRelated(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition);
        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async createNew(token: string, table: string, new_data: any): Promise<any> {
        return await Authorized(token).bodyRequest("post", "crud/create", {tableName: table, data: new_data});
    }

    public static async update(token: string, tableName: string, new_data: any): Promise<any> {
        return await Authorized(token).bodyRequest("put", "crud/update", {tableName, data: new_data});
    }

    public static async forSelectBox(token: string, table: string, as_id: string, as_label: string) {
        try {
            return await Authorized(token).bodyRequest("get", `crud/selectbox/${table}/${as_id}/${as_label}`);
        } catch (error: any) {
            return null;
        }
    }
    public static async delete(token: string, table: string, id: string) {
        return await Authorized(token).bodyRequest("delete", `crud/delete/${table}/${id}`);
    }

    public static async deleteList(token: string, table: string, id_s: string[]) {
        return await Authorized(token).bodyRequest("post", `crud/delete`, {tableName: table, id: id_s });
    }

    public static async addAttachment(token: string, table: string, record: string, attachment: {file: any, name: string}){
        return await authFileRequest(token, "post", "file/upload", {table, record: `${record}`, ...attachment});
    }
}

export default MainAPI;