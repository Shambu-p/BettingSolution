import { Authorized } from "../APIs/api";
import MainAPI from "../APIs/MainAPI";
import { mapValue } from "../Forms/FormUtils";

const buttonAction: any = {

    defaultUpdate: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {
        let new_data: any = await mapValue(fields, token, table_id);
        let response = await MainAPI.update(token, table_id, new_data);

        return {
            message: "Record Updated Successfully",
            sys_id: response.sys_id
        }
    },

    defaultDuplicate: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.createNew(token, table_id, {...new_data, sys_id: undefined});

        return {
            message: "Record Inserted Successfully",
            sys_id: result.sys_id
        }

    },
    approvePurchase: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "confirmed"});

        return {
            message: "Record Updated Successfully",
            sys_id: result.sys_id
        }

    },
    requestConsumption: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "waiting_consumption_approval"});

        return {
            message: "Production order request has been sent Successfully!",
            sys_id: result.sys_id
        }

    },
    acceptConsumption: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "consumption_confirmed"});

        return {
            message: "Production has been allowed!",
            sys_id: result.sys_id
        }

    },
    requestProductionItemApproval: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "waiting_production_approval"});

        return {
            message: "Finished product approval request is sent!",
            sys_id: result.sys_id
        }

    },
    acceptProducedItems: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "production_confirmed"});

        return {
            message: "Produced Items has been approved and accepted!",
            sys_id: result.sys_id
        }

    },
    cancelProduction: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "production_cancelled"});

        return {
            message: "Production has been cancelled!",
            sys_id: result.sys_id
        }

    },

//////////////////////////////////// sell buttons //////////////////////////////////////////
    cancelSell: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "cancelled"});

        return {
            message: "Sell has been cancelled!",
            sys_id: result.sys_id
        }

    },

    soldSell: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "sold"});

        return {
            message: "Sell has been confirmed!",
            sys_id: result.sys_id
        }

    },

    AssignedSell: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "delivery_assigned"});

        return {
            message: "Delivery has been assigned to sell confirmed!",
            sys_id: result.sys_id
        }

    },

    sellOntheway: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "on_the_way"});

        return {
            message: "Sold Items are on the way!",
            sys_id: result.sys_id
        }

    },

    delivered: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let new_data: any = await mapValue(fields, token, table_id);
        let result = await MainAPI.update(token, table_id, {...new_data, status: "delivered"});

        return {
            message: "Items have been delivered to buyer!",
            sys_id: result.sys_id
        }

    },
    resetPassword: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        // let new_data: any = await mapValue(fields, token, table_id);
        // let result = await MainAPI.update(token, table_id, {...new_data, status: "delivered"});
        let phoneField = fields.find((fld: any) => (fld.id == "phone"));
        let result = await Authorized(token).bodyRequest("post", "auth/password_reset", {
            Phone: phoneField.value
        });

        return {
            message: "Password has been Reset! Email will be sent to user email!",
            sys_id: result.sys_id
        }

    },
    changePurchaseView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/create-purchase/${idField.value}`,
            type: "page",
            page_id: "create-purchase",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeSellView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/create-sell/${idField.value}`,
            type: "page",
            page_id: "create-sell",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeProductionView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        console.log("found id on workspace form!", idField);
        navigation({
            routeAddress: `/production-form/${idField.value}`,
            type: "page",
            page_id: "production-form",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeSlipView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        console.log("found id on workspace form!", idField);
        navigation({
            routeAddress: `/receive-slip/${idField.value}`,
            type: "page",
            page_id: "production-form",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeTransferView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        console.log("found id on workspace form!", idField);
        navigation({
            routeAddress: `/transfer-form/${idField.value}`,
            type: "page",
            page_id: "transfer-form",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });

        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeDesignerView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/api-designer/${idField.value}`,
            type: "page",
            page_id: "api-designer",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "View Changed!",
            sys_id: idField.value
        }

    },
    changeFlowView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/flow-builder/${idField.value}`,
            type: "page",
            page_id: "flow-builder",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "Designer Opened!",
            sys_id: idField.value
        }

    },
    testFlowView: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/test-flow/${idField.value}`,
            type: "page",
            page_id: "test-flow",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "Page Opened!",
            sys_id: idField.value
        }

    },
    processDetailview: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/process-detail/${idField.value}`,
            type: "page",
            page_id: "process-detail",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "Execution Detail Opened!",
            sys_id: idField.value
        }

    },
    changeToPageBuilder: async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

        let idField = fields.find((fld: any) => (fld.id == "sys_id"));
        navigation({
            routeAddress: `/page-builder/${idField.value}`,
            type: "page",
            page_id: "page-builder",
            routeData: {
                params: {
                    id: idField.value
                }
            },
            dataPassed: {}
        });
        return {
            message: "Page Builder Opened!",
            sys_id: idField.value
        }

    },

};

export default buttonAction;