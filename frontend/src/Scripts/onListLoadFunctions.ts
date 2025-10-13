import MainAPI from "../APIs/MainAPI";
import IPagination from "../Intefaces/IPagination";
import LocalData from "../Intefaces/LocalData";

const onListLoadFunction: any = {

    defaultListLoader: async (token: string, pageNumber: number, pageSize: number, localData: LocalData | any, condition?: any, table_id?: string): Promise<IPagination<any>> => {
        console.log("list condition: ", condition);
        return await MainAPI.getAll(token, table_id ?? "", pageNumber, pageSize, condition, "reference");
    }

};

export default onListLoadFunction;