import React, { useContext, useEffect, useState } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AuthContext from "../../../Contexts/AuthContext";
import FieldTypes from "../../../Enums/FiedTypes";

const TableFieldSelector = ({
    table_id,
    column_id,
    onSelect,
    onNext
}: {
    table_id: string,
    column_id?: string,
    onNext: (selected_field: {table_id: string, column_id: string}) => void,
    onSelect: (selected_field: {table_id: string, column_id: string}) => void
}) => {

    const {localData, forms} = useContext(AuthContext);

    const [columnList, setColumnList] = useState<any>([]);
    const [selectedTable, setSelectedTable] = useState<any>();

    useEffect(() => {
        loadContent();
    }, [table_id]);

    const loadContent = () => {

        if(table_id) {

            let found_table = forms.find((tbl: any) => (tbl.id == table_id));
            if(found_table) {
                setSelectedTable(found_table);
                setColumnList(Object.values(found_table.fields));
            } else {
                setColumnList([]);
            }

            // setColumnList(localData.fields.filter((fld: any) => (fld.table_id == table_id)));

        }

    };

    return (
        <div className="shadow-sm rounded py-1" style={{ minWidth: "150px", height: "100%", overflow: "hidden auto"}}>
            {
                columnList.map((cl: any) => (
                    <div key={cl.sys_id} className={`d-flex justify-content-between align-items-center ps-2 ${column_id == cl.id ? "zbtn" : "zoption"}`}>
                        <div style={{fontSize: "13px", cursor: "pointer"}} className="form-label mb-0 col" onClick={() => {onSelect({table_id, column_id: cl.id})}}>{cl.label}</div>
                        {
                            (cl.type == FieldTypes.REFERENCE) && (
                                <button className="btn rounded-0 border-start py-0 px-1" style={{fontSize: 15}} onClick={() => {onNext({table_id, column_id: cl.id})}}>
                                    <KeyboardArrowRightIcon sx={{fontSize: 10, color: "var(--text_color)"}} />
                                </button>
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default TableFieldSelector;