import UserRoles from "../Enums/UserRoles";

const actionCondition: any = {

    purchaseApprovalButtonCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "waiting_approval";

    },
    cancelProductionCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return (statusField.value != "draft" && !["production_confirmed", "production_cancelled"].includes(statusField.value));

    },
    acceptProducedItemsCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "waiting_production_approval";

    },
    requestProductionItemApprovalCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "consumption_confirmed";

    },
    acceptConsumptionCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "waiting_consumption_approval";

    },
    requestConsumptionCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "draft";

    },

//////////////////////////////////// sell action button conditions /////////////////////////////////////////////////////////////////

    cancelSellCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "draft";

    },
    soldSellCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "draft";

    },
    sellAssignedCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "sold";

    },
    sellOnthewayCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return statusField.value == "delivery_assigned";

    },
    sellDeliveredCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let statusField = fields.find((fld: any) => (fld.id == "status"));
        if(!statusField) {
            return false;
        }

        return ["on_the_way", "sold"].includes(statusField.value);

    },
    userResetPasswordCondition: (token: string, fields: any[], loggedUser: any): boolean => {

        let phoneField = fields.find((fld: any) => (fld.id == "phone"));
        if(!phoneField) {
            return false;
        }

        return (phoneField.value && phoneField.value != "");

    },
};

export default actionCondition;