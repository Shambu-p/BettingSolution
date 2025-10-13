import React, { useState, useEffect, useContext } from "react";
import FieldTypes from "../../Enums/FiedTypes";
import CustomeSelectBox from "./CustomeSelectBox";
import AuthContext from "../../Contexts/AuthContext";
import FieldSelectorInput from "./FieldSelector/FieldSelectorInput";
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';


// Build middle query: group consecutive ORs
// export function middleToPrismaWhere(conds: any[]) {
//     if (!conds.length) return {};
//     let result: any[] = [];
//     let i = 0;
//     while (i < conds.length) {
//         if (conds[i].connector === "OR") {
//             let orGroup: any[] = [];
//             while (i < conds.length && conds[i].connector === "OR") {
//                 orGroup.push({ [conds[i].field]: { [conds[i].operator]: conds[i].value } });
//                 i++;
//             }
//             result.push({ OR: orGroup });
//         } else {
//             result.push({ [conds[i].field]: { [conds[i].operator]: conds[i].value } });
//             i++;
//         }
//     }
//     return { AND: result };
// };

const operatorOptions = [
    { value: "equals", label: "Equals" },
    { value: "not", label: "Not" },
    { value: "not_empty", label: "Not Empty" },
    { value: "empty", label: "Empty" },
    { value: "gt", label: "Greater Than" },
    { value: "lt", label: "Less Than" },
    { value: "in", label: "In" },
    { value: "contains", label: "Contains" }
];

const QueryBuilder = ({ tableName, initialCondition, onQueryChange }) => {

    const { forms, localData, cookies } = useContext(AuthContext);

    const [fields, setFields] = useState<any[]>([]);
    const [fieldDefs, setFieldDefs] = useState<any>({});
    const [referenceFields, setReferenceFields] = useState<any>({});
    const [conditions, setConditions] = useState<any[]>([]);

    useEffect(() => {
        let def: any = fetchTableDef(tableName);
        setFields(def.fields ? Object.keys(def.fields) : []);
        setFieldDefs(def.fields || {});
        let refs: any = {};
        if (def.keys) {
            def.keys.forEach((key: any) => {
                if (key.table && key.property) {
                    refs[key.property] = key.table;
                }
            });
        }
        setReferenceFields(refs);
    }, [tableName]);

    useEffect(() => {
        if (initialCondition) {
            setConditions(initialCondition);
        }
    }, [initialCondition]);

    // Helper to fetch table definition from backend/configuration/Forms
    const fetchTableDef = (tableName: string): any => {
        // This should be replaced with an API call in production
        let definations = JSON.parse(JSON.stringify(forms));
        const formDef = definations.find((frm: any) => (frm.id = tableName));
        return formDef || {};
    }

    const addCondition = () => {
        setConditions([...conditions, { 
            connector: "AND",
            field: "",
            operator: "equals",
            value: ""
        }]);
    };
    const addORCondition = () => {
        setConditions([...conditions, { 
            connector: "OR",
            field: "",
            operator: "equals",
            value: ""
        }]);
    };

    const updateCondition = (idx: number, key: string, value: any) => {
        const updated = conditions.map((cond: any, i: number) =>
            i === idx ? { ...cond, [key]: value } : cond
        );
        setConditions(updated);
    };

    const removeCondition = (idx: number) => {
        setConditions(conditions.filter((_: any, i: number) => i !== idx));
    };

    const handleSubmit = () => {
        if (onQueryChange) {
            onQueryChange(conditions);
        }
    };

    const getFieldType = (path: string) => {

        let selected_field = path.split(".");
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
                    let found_options = localData.Choices.filter((ch: any) => (ch.id == `${converted.table_id}.${converted.column_id}`));
                    return { ...found_field, options: found_options };
                }
            }

        };

        return null;

    };
    // Render value input based on field type
    const renderValueInput = (cond: any, idx: number) => {
        const field = getFieldType(cond.field);
        const fieldType = field?.type;
        const value = cond.value;
        
        if (!field || !fieldType) {
            return <input className="form-control form-control-sm zinput" type="text" value={value} onChange={e => updateCondition(idx, "value", e.target.value)} placeholder="Value" />;
        }

        switch (fieldType) {
            case FieldTypes.BOOLEAN:
                return (
                    <select className="form-select form-select-sm zinput" value={value} onChange={e => updateCondition(idx, "value", e.target.value === "true") }>
                        <option value="">Select</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                );
            case FieldTypes.DATE:
                return (
                    <input className="form-control form-control-sm zinput" type={fieldType === FieldTypes.DATE ? "date" : "datetime-local"} value={value} onChange={e => updateCondition(idx, "value", e.target.value)} />
                );
            case FieldTypes.DATETIME:
                return (
                    <input className="form-control form-control-sm zinput" type={fieldType === FieldTypes.DATE ? "date" : "datetime-local"} value={value} onChange={e => updateCondition(idx, "value", e.target.value)} />
                );
            case FieldTypes.NUMBER:
                return (
                    <input className="form-control form-control-sm zinput" type="number" value={value} onChange={e => updateCondition(idx, "value", e.target.value)} />
                );
            case FieldTypes.FLOAT:
                return (
                    <input className="form-control form-control-sm zinput" type="number" value={value} onChange={e => updateCondition(idx, "value", e.target.value)} />
                );
            case FieldTypes.DOUBLE:
                return (
                    <input className="form-control form-control-sm zinput" type="number" value={value} onChange={e => updateCondition(idx, "value", e.target.value)} />
                );
            case FieldTypes.SELECT:
                return (
                    <select className="form-select form-select-sm zinput" value={value} onChange={e => updateCondition(idx, "value", e.target.value)}>
                        <option value="">Select</option>
                        {(field?.options || []).map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case FieldTypes.REFERENCE:
                return (
                    <CustomeSelectBox
                        key={`${cond.field}_${cond.operator}_${idx}`}
                        givenValue={value}
                        onChange={async (val: any) => { if (val) updateCondition(idx, "value", val.value); }}
                        title={""}
                        readonly={false}
                        disabled={false}
                        id={"sys_id"}
                        displayField={field?.displayField || "name"}
                        options={{}}
                        token={cookies.login_token}
                        references={field?.references}
                    />
                );
            default:
                return (
                    <input className="form-control form-control-sm zinput" type="text" value={value} onChange={e => updateCondition(idx, "value", e.target.value)} placeholder="Value" />
                );
        }
    };

    const renderFieldSelect = (cond: any, idx: number) => {
        const selectedField = cond.field;
        return (
            <FieldSelectorInput
                value={selectedField}
                tableId={tableName}
                onChange={fieldPath => updateCondition(idx, "field", fieldPath)}
            />
        );
    };

    return (
        <div className="card w-100 zinput">
            <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                <h5 className="card-title fs-6 mb-0">Query Builder for <b>{tableName}</b></h5>
            </div>
            <div className="card-body">
                {conditions.map((cond: any, idx: number) => (
                    <div className="d-flex justify-content-between align-items-start mb-2" key={idx}>
                        <div className="col-auto">
                            <select
                                className="form-select form-select-sm zinput"
                                value={cond.connector}
                                onChange={e => updateCondition(idx, "connector", e.target.value)}
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select>
                        </div>
                        <div className="col-4">
                            {renderFieldSelect(cond, idx)}
                        </div>
                        <div className="col-2">
                            <select
                                className="form-select form-select-sm zinput"
                                value={cond.operator}
                                onChange={e => {
                                    updateCondition(idx, "operator", e.target.value);
                                }}
                            >
                                {operatorOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        {
                            ["empty", "not_empty"].includes(cond.operator) ? (
                                <div className="col-4 d-flex justify-content-between" />
                            ) : (
                                <div className="col-4 d-flex justify-content-between">
                                    {
                                        (!cond.isDynamic) ? (
                                            renderValueInput(cond, idx)
                                        ) : (
                                            <input 
                                                className="form-control form-control-sm zinput" 
                                                type="text" 
                                                value={cond.value} 
                                                onChange={e => updateCondition(idx, "value", e.target.value)} 
                                                placeholder="Value" 
                                            />
                                        )
                                    }
                                    <button
                                        className="btn btn-sm btn-secondary ms-2"
                                        onClick={() => updateCondition(idx, "isDynamic", !cond.isDynamic)}
                                    >
                                        <AutoFixHighIcon sx={{ fontSize: 19 }} />
                                    </button>
                                </div>
                            )
                        }
                        <div className="col-auto">
                            <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => removeCondition(idx)}
                            >
                                <CloseIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
            <div className="card-footer d-flex justify-content-between align-items-center" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                <div className="btn-group">
                    <button className="btn btn-primary btn-sm" onClick={addCondition}>AND</button>
                    <button className="btn btn-primary btn-sm" onClick={addORCondition}>OR</button>
                </div>
                <button className="btn btn-success btn-sm" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default QueryBuilder;
