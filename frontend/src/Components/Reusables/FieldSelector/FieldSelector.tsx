import React, { useContext, useEffect, useState } from "react";
import TableFieldSelector from "./TableFieldSelector";
import AuthContext from "../../../Contexts/AuthContext";
import FieldTypes from "../../../Enums/FiedTypes";

const FieldSelector = ({field_path, onSelect}: {field_path: string, onSelect: (path: any[]) => void}) => {

    const {localData, forms} = useContext(AuthContext);

    const [allPath, setAllPath] = useState<any>([]);

    useEffect(() => {

        setAllPath((field_path.split(".").map((fp: string) => {
            let splits = fp.split("|");
            return {
                table_id: splits[0] ?? "",
                column_id: splits[1] ?? ""
            };
        })));

    }, [field_path]);

    const columnChange = (index: number, table_id: string, column_id: string, add_if_reference = false) => {

        let temp_paths = [];
        if(allPath.length >= 0) {
            temp_paths = allPath.slice(0, index);
        }

        
        temp_paths.push({table_id, column_id});
        let found_table = forms.find((tbl: any) => (tbl.id == table_id));
        if(found_table) {
            let found_column = found_table.fields[column_id];
            if(found_column) {
                if(add_if_reference && found_column.type == FieldTypes.REFERENCE) {
                    temp_paths.push({table_id: found_column.references, column_id: ""});
                } else {
                    onSelect([...temp_paths]);
                }
            }
        }

        setAllPath([...temp_paths]);

    };

    return (
        <div className="w-100 p-1 d-flex justify-content-start" style={{height: "125px", overflow: "auto hidden"}}>
            {
                allPath.map((ap: any, indx: number) => (<TableFieldSelector
                    table_id={ap.table_id}
                    column_id={ap.column_id}
                    onNext={(event) => {columnChange(indx, event.table_id, event.column_id, true);}}
                    onSelect={(event) => {columnChange(indx, event.table_id, event.column_id);}}
                />))
            }
        </div>
    );
};

export default FieldSelector;