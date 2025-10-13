import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import IField from "../Intefaces/IField";
import FieldTypes from "../Enums/FiedTypes";
import { props } from "../APIs/api";
import SearchIcon from '@mui/icons-material/Search';
import Utils from "../Models/Utils";
import AuthContext from "../Contexts/AuthContext";
import { Form } from "react-router-dom";

function ListComponent({ tableId, selector, cols, rows, idColumn, realId, emitOnSelect, keys }: {
    tableId: string,
    selector: (id: number) => void, cols: IField[],
    rows: any[],
    idColumn?: string,
    realId?: string,
    emitOnSelect: (selected_records: any[]) => void,
    keys: any[]
}) {

    const { localData } = useContext(AuthContext);

    const [columns, setColumns] = useState<IField[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    useEffect(() => {
        setColumns(cols);
        setRecords(rows);
        console.log("columns passed ", cols);
    }, [cols, rows]);

    useEffect(() => {

        let temp_selected: any[] = [];
        if(selectAll) {
            temp_selected = records.map(rc => rc[(realId ?? "id")]);
        }

        setSelectedRecords(srec => temp_selected);
        emitOnSelect(temp_selected);

    }, [selectAll]);

    const selectRecord = (rec_id: any) => {

        let temp_selected: any[] = [];
        if(!selectedRecords.includes(rec_id)) {
            temp_selected = [...selectedRecords, rec_id];
            console.log("selected ", rec_id);
        } else {
            temp_selected = selectedRecords.filter(r => (r != rec_id));
            console.log("un selected ", rec_id);
        }
        
        emitOnSelect(temp_selected);
        setSelectedRecords(sr => temp_selected);

    }

    const getReferencValue = (column: any, single_record: any, parent_relations: any[]) => {

        let found_relation = parent_relations.find(pr => (pr.column == column.id));

        if(!found_relation) {
            return "(no relation)"
        }

        if(!column.displayField) {
            return "(no display field)"
        }

        if(!single_record[found_relation.property]) {
            return "(empty)"
        }

        return single_record[found_relation.property][column.displayField];

    }

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == `${tableId}.${column.id}`));
        if(!found_choice) {
            return {}
        }

        return found_choice;
    }

    // "".substring(0, 20)
    return (
        <div className="d-flex" style={{ flexWrap: "wrap" }}>
            <div className="col"></div>
            <div className={isMobile ? "w-100" : "col-xlg-10 col-lg-12"}>
                <div className="card-body px-1" style={{ width: "100%", overflowX: "auto" }}>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr className="align-items-center">
                                <td scope="col" className="py-1">
                                    <input className="form-check-input form-check-input-sm zcheck_box" type="checkbox" checked={selectAll} title="Select all records" onChange={() => {setSelectAll(!selectAll)}} />
                                    {/* <SearchIcon sx={{ fontSize: 18, cursor: "pointer" }} className="text-muted mt-0 ms-2 rounded" /> */}
                                </td>
                                {columns.map(col => (
                                    <th
                                        style={{fontWeight: "bold", color: "var(--border_color) !important", fontSize: "13px"}}
                                        className="py-1 align-center"
                                        key={col.id}
                                        id={col.id}
                                    >
                                        {col.label}
                                    </th>)
                                )}
                            </tr>
                        </thead>
                        <tbody style={{fontSize: "13px"}}>
                            {records.map(rec => (
                                <tr className="py-1" key={`row_${rec[(realId ?? "id")]}`}>
                                    <td className="py-1" scope="row" key={`select_col_${rec[(realId ?? "id")]}`} >
                                        <input className="form-check-input zcheck_box" type="checkbox" checked={selectedRecords.includes(rec[(realId ?? "id")])} title="select this record" onChange={(event: any) => {selectRecord(rec[(realId ?? "id")])}} />
                                    </td>
                                    {
                                    columns.map(col => {
                                        // if((col.id.toLowerCase()) == (idColumn ?? "id")) {
                                        //     return (
                                        //         <td className="py-0" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                        //             <button className="btn btn-link btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                        //                 {rec[col.id.toLowerCase()]}
                                        //             </button>
                                        //         </td>
                                        //     );
                                        // } else 
                                        if(col.type == FieldTypes.IMAGE) {
                                            return (<td className="py-1" scope="row" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                {
                                                    (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                        <button className="btn btn-link py-0 btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                            <img src={`${props.baseURL}file/${rec[col.id]}`} className="rounded" style={{ width: "100px", height: "auto" }} alt="attached image" />
                                                        </button>
                                                    ) : (
                                                        <img src={`${props.baseURL}file/${rec[col.id]}`} className="rounded" style={{ width: "100px", height: "auto" }} alt="attached image" />
                                                    )
                                                }
                                            </td>);
                                        }
                                        else if(col.type == FieldTypes.SELECT) {
                                            let found_choice = getDisplaySelect(col, rec[col.id]);
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link py-0 btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                <span className="badge rounded-pill py-1 px-3 mb-0" style={rec[col.id] ? {background: found_choice.bgColor, color: found_choice.color, paddingTop: "5px !important", lineHeight: 1} : {}}>
                                                                    {found_choice ? found_choice.label : "NULL"}
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <span className="badge rounded-pill py-1 px-3 mb-0" style={rec[col.id] ? {background: found_choice.bgColor, color: found_choice.color, paddingTop: "5px !important", lineHeight: 1} : {}}>
                                                                {found_choice ? found_choice.label : "NULL"}
                                                            </span>
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.TEXTAREA) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                {rec[col.id] ? rec[col.id].replace(/<\/?[^>]+(>|$)/g, "").substring(0, 20) : ""} {(rec[col.id] && rec[col.id].length > 20) ? "..." : ""}
                                                            </button>
                                                        ) : (
                                                            `${rec[col.id] ? rec[col.id].replace(/<\/?[^>]+(>|$)/g, "").substring(0, 20) : ""} ${(rec[col.id] && rec[col.id].length > 20) ? "..." : ""}`
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.BOOLEAN) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                {`${rec[col.id] ? "True" : "False"}`}
                                                            </button>
                                                        ) : (
                                                            `${rec[col.id] ? "True" : "False"}`
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else if([FieldTypes.DATETIME, FieldTypes.DATE].includes(col.type)) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                {`${Utils.convertISOToDate(rec[col.id], localData.dateConfig)}`}
                                                            </button>
                                                        ) : (
                                                            `${Utils.convertISOToDate(rec[col.id], localData.dateConfig)}`
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.REFERENCE) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                {getReferencValue(col, rec, keys)}
                                                            </button>
                                                        ) : (
                                                            getReferencValue(col, rec, keys)
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.SELECTCOLOR) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cssText: `background: ${rec[col.id]} !important`, cursor: "pointer"}}>
                                                    {
                                                        (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                                {rec[col.id]}
                                                            </button>
                                                        ) : (
                                                            rec[col.id]
                                                        )
                                                    }
                                                </td>
                                            );
                                        } else {
                                            return (<td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                {
                                                    (col.id.toLowerCase()) == (idColumn ?? "id") ? (
                                                        <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>
                                                            {rec[col.id]}
                                                        </button>
                                                    ) : (
                                                        rec[col.id]
                                                    )
                                                }
                                            </td>);
                                        }
                                    })
                                }</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default ListComponent;