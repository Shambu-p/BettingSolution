import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";
import { props } from "../../APIs/api";
import Utils from "../../Models/Utils";
import FieldTypes from "../../Enums/FiedTypes";
import { useNavigate } from "react-router-dom";

const SimpleList = function ({
    tableName,
    records,
    visibleFields,
    title
}: {
    title: string,
    tableName: string,
    records: any[],
    visibleFields: string[]
}) {

    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);
	const { setAlert } = useContext(AlertContext);

    const navigate = useNavigate();
    const [form, setForm] = useState<any>();
    const [columns, setColumns] = useState<any[]>([]);

    useEffect(() => {

        let found_form = forms.find((frm: any) => (frm.id == tableName && Utils.roleCheck(loggedUser.Roles, frm.readRoles)));
        if(found_form) {
            found_form.fields = Object.values(found_form.fields);
            setForm(found_form);

            setColumns(found_form.fields.filter((fld: any) => (visibleFields.includes(fld.id))))
        }

    }, [tableName]);

    const getReferencValue = (column: any, single_record: any, parent_relations: any[]) => {

        let found_relation = parent_relations.find(pr => (pr.column == column.id));

        if(!found_relation) {
            return "no relation"
        }

        if(!column.displayField) {
            return "no display field"
        }

        if(!single_record[found_relation.property]) {
            return "no parent"
        }

        return single_record[found_relation.property][column.displayField];

    }

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == `${tableName}.${column.id}`));
        if(!found_choice) {
            return {}
        }

        return found_choice;
    }

    const selector = (id: number) => {
        navigate(`/form/${tableName}/${id}`);
    }

    let table_data: any[] = [];

    records.forEach((recSet: any, indx: number) => {
        table_data.push(
            <div  className="py-1" key={`group_name_col_${indx}`}>{recSet.id}</div>
            // <tr className="py-1" key={`group_${indx}`}>
            // </tr>
        )

        table_data = [
            ...table_data,
            ...(recSet.records.map((rec: any) => (
                <tr className="py-1" key={`row_${rec[(form.realId ?? "id")]}`}>
                    {
                    columns.map(col => {
                        if(col.type == FieldTypes.SELECT) {
                            let found_choice = getDisplaySelect(col, rec[col.id]);
                            return (
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link py-0 btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
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
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
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
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
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
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
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
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
                                                {getReferencValue(col, rec, form.keys)}
                                            </button>
                                        ) : (
                                            getReferencValue(col, rec, form.keys)
                                        )
                                    }
                                </td>
                            );
                        } else if(col.type == FieldTypes.SELECTCOLOR) {
                            return (
                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`} title={rec[col.id]} style={{cssText: `background: ${rec[col.id]} !important`, cursor: "pointer"}}>
                                    {
                                        (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                            <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
                                                {rec[col.id]}
                                            </button>
                                        ) : (
                                            rec[col.id]
                                        )
                                    }
                                </td>
                            );
                        } else {
                            return (<td scope="row" className="py-1" key={`${col.id}_col_${rec[(form.realId ?? "id")]}`}>
                                {
                                    (col.id.toLowerCase()) == (form.idColumn ?? "id") ? (
                                        <button className="btn btn-link btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { selector(rec[(form.realId ?? "id")]) }}>
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
            ))),
            ...(
                Object.keys({...recSet, id: undefined, records: undefined}).filter((setKey: any) => (!["id", "records"].includes(setKey))).map((setKey: string, innerIndex: number) => (
                    <tr className="py-1" key={`group_${indx}_${setKey}`}>
                        <td scope="row" className="py-1" key={`group_name_col_${setKey}`}>{setKey}: {recSet[setKey]}</td>
                    </tr>
                ))
            )
        ];

    });


    return (
        <table className='table table-striped w-100'>
            <thead>{title}</thead>
            <thead>
                <tr>
                    {columns.map((col: any) => (
                        <th
                            style={{fontWeight: "bold", color: "var(--border_color) !important", fontSize: "13px"}}
                            className="py-1 align-center"
                            key={col.id}
                            id={col.id}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                    
                {table_data}
                
            </tbody>
        </table>
    );
}

export default SimpleList;