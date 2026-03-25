import { jaJP } from "@mui/x-date-pickers/locales";
import IField from "../Intefaces/IField";
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import TransactionCategory from "../Enums/TransactionCategory";
import Utils from "../Models/Utils";

const fieldOnChange: any = {
    default: async (token: string, fields: IField[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {
        return value;
    },
    storeOnPurchaseItem: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        let purchaseFieldIndex = fields.findIndex(fld => (fld.id == "purchase_id"));

        if(purchaseFieldIndex > -1) {

            let purchaseField = fields[purchaseFieldIndex];

            purchaseField.referenceCondition = {
                store_id: value.value,
                status: "draft"
            };

            set_field(purchaseFieldIndex, purchaseField);

        }

        return value;

    },
    storeOnFinishedProduct: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        let productionFieldIndex = fields.findIndex(fld => (fld.id == "production_id"));

        if(productionFieldIndex > -1) {

            let productionField = fields[productionFieldIndex];

            productionField.referenceCondition = {
                store_id: value.value,
                status: "consumption_confirmed"
            };

            set_field(productionFieldIndex, productionField);

        }

        return value;

    },
    storeOnConsumption: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        let productionFieldIndex = fields.findIndex(fld => (fld.id == "production_id"));

        if(productionFieldIndex > -1) {

            let productionField = fields[productionFieldIndex];

            productionField.referenceCondition = {
                store_id: value.value,
                status: "draft"
            };

            set_field(productionFieldIndex, productionField);

        }

        return value;

    },
    storeOnSellProduct: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        let sellFieldIndex = fields.findIndex(fld => (fld.id == "sell_id"));

        if(sellFieldIndex > -1) {

            let sellField = fields[sellFieldIndex];

            sellField.referenceCondition = {
                store_id: value.value,
                status: "draft"
            };

            set_field(sellFieldIndex, sellField);

        }

        return value;

    },
    categoryOnTransaction: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        // let categoryFieldIndex = fields.findIndex(fld => (fld.id == "category"));
        let sellFieldIndex = fields.findIndex(fld => (fld.id == "sell_id"));
        let productionFieldIndex = fields.findIndex(fld => (fld.id == "production_id"));
        let purchaseFieldIndex = fields.findIndex(fld => (fld.id == "purchase_id"));
        let serviceFieldIndex = fields.findIndex(fld => (fld.id == "service_id"));

        console.log("category value ", value);

        if(purchaseFieldIndex > -1) {

            if(value == TransactionCategory.purchase) {
                set_field(purchaseFieldIndex, {
                    ...fields[purchaseFieldIndex],
                    visible: true
                });
            } else {
                set_field(purchaseFieldIndex, {
                    ...fields[purchaseFieldIndex],
                    visible: false
                });
            }
        }

        if(sellFieldIndex > -1) {
            if(value == TransactionCategory.sell) {
                set_field(sellFieldIndex, {
                    ...fields[sellFieldIndex],
                    visible: true
                });
            } else {
                set_field(sellFieldIndex, {
                    ...fields[sellFieldIndex],
                    visible: false
                });
            }
        }

        if(productionFieldIndex > -1) {
            if(value == TransactionCategory.production) {
                set_field(productionFieldIndex, {
                    ...fields[productionFieldIndex],
                    visible: true
                });
            } else {
                set_field(productionFieldIndex, {
                    ...fields[productionFieldIndex],
                    visible: false
                });
            }
        }

        if(serviceFieldIndex > -1) {
            if(value == TransactionCategory.serviceFee) {
                set_field(serviceFieldIndex, {
                    ...fields[serviceFieldIndex],
                    visible: true
                });
            } else {
                set_field(serviceFieldIndex, {
                    ...fields[serviceFieldIndex],
                    visible: false
                });
            }
        }

        return value;

    },
    typeOnRateRange: async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

        // let categoryFieldIndex = fields.findIndex(fld => (fld.id == "category"));
        // let sellFieldIndex = fields.findIndex(fld => (fld.id == "fixed_amount"));
        let fixedAmountFieldIndex = fields.findIndex(fld => (fld.id == "fixed_amount"));
        let productionFieldIndex = fields.findIndex(fld => (fld.id == "production_id"));
        let purchaseFieldIndex = fields.findIndex(fld => (fld.id == "purchase_id"));
        let serviceFieldIndex = fields.findIndex(fld => (fld.id == "service_id"));

        console.log("category value ", value);

        if(value == "fixed") {

            set_field(fixedAmountFieldIndex, {
                ...fields[fixedAmountFieldIndex],
                visible: true,
                required: true
            });

        } else {

            set_field(fixedAmountFieldIndex, {
                ...fields[fixedAmountFieldIndex],
                visible: false,
                required: false
            });

        }

        return value;

    }
};

export default fieldOnChange;