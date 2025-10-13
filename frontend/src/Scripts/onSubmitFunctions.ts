import MainAPI from "../APIs/MainAPI";
import { mapValue } from "../Forms/FormUtils";
import IField from "../Intefaces/IField";

const onSubmitFunction: any = {

    defaultOnsubmit: async (token: string, fields: IField[], table_id?: string): Promise<any> => {

        let result = await mapValue(fields, token, (table_id ?? ""));
        let admin_result = await MainAPI.createNew(token, (table_id ?? ""), result);

        return {
            message: `${table_id} Created Successfully`,
            sys_id: admin_result.sys_id
        };

    },

};

export default onSubmitFunction