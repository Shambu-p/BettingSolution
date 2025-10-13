import React, { useContext, useEffect, useState } from "react";
import FieldSelector from "./FieldSelector";
import AuthContext from "../../../Contexts/AuthContext";


const FieldSelectorInput = ({onChange, tableId, value}: {value: string, tableId: string, onChange: (fieldPath: string) => void}) => {

    const { localData, forms } = useContext(AuthContext);

    const [selector, setSelector] = useState<Boolean>(false);
    const [selectedField, setSelectedField] = useState<any>({
        path: "",
        label: "",
        id: ""
    });

    useEffect(() => {
        setSelectedField((fld: any) => ({
            path: `${tableId}|`,
            label: "",
            id: ""
        }));
    }, [tableId]);

    useEffect(() => {
        loadField();
    }, [value]);

    const loadField = () => {

        let selected_field = value.split(".");
        if(selected_field.length > 0) {

            let splits = selected_field[selected_field.length - 1].split("|");
            let converted = {
                table_id: splits[0] ?? "",
                column_id: splits[1] ?? ""
            };

            let found_table = forms.find((tbl: any) => (tbl.id == converted.table_id));
            if(found_table) {
                let found_field = found_table.fields[converted.column_id];
                if(found_field) {

                    setSelectedField((fld: any) => ({
                        path: value,
                        label: found_field.label,
                        id: found_field.id
                    }));
    
                }
            }

        };

    };

    const onConditionFieldChange = (paths: any[]) => {

        if(paths.length > 0) {
            onChange((paths.map((pz: any) => (`${pz.table_id}|${pz.column_id}`))).join("."));
        }

    };

    return (
        <div className="w-100 p-0 m-0">
            <button className="btn btn-sm py-1 px-2 zinput me-1 text-start w-100" style={{fontSize: "13px"}} onClick={() => {setSelector(!selector)}}>
                {(selectedField.label == "") ? "Select Field" : selectedField.label}
            </button>
            <div className="w-100" style={{display: (selector ? "block" : "none"), height: "125px"}}>
                <FieldSelector field_path={selectedField.path} onSelect={onConditionFieldChange} />
            </div>
        </div>
    );
}

export default FieldSelectorInput;