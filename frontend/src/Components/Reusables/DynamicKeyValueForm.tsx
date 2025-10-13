import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import FieldTypes from "../../Enums/FiedTypes";

interface DynamicKeyValueFormProps {
    tableId: string;
    recordData: any;
    emit: (result: { [key: string]: any }) => void;
}

const DynamicKeyValueForm: React.FC<DynamicKeyValueFormProps> = ({ recordData, tableId, emit }) => {
    const { forms, localData, cookies } = useContext(AuthContext);

    const [fields, setFields] = useState<any[]>([]);
    // const [fieldDefs, setFieldDefs] = useState<any>({});
    const [pairs, setPairs] = useState<{ field: string; value: any }[]>([
        { field: "", value: "" }
    ]);

    useEffect(() => {
        const def = forms.find((frm: any) => frm.id === tableId);
        setFields(def?.fields ? Object.keys(def.fields) : []);
        // setFieldDefs(def?.fields || {});

        if(recordData) {
            setPairs(prev =>
                (Object.keys(recordData) || []).map(fld => ({
                    field: fld,
                    value: recordData[fld] || ""
                }))
            );
        }
    }, [tableId, forms, recordData]);

    const handleFieldChange = (idx: number, field: string) => {
        setPairs(prev =>
            prev.map((pair, i) =>
                i === idx ? { ...pair, field, value: "" } : pair
            )
        );
    };

    const handleValueChange = (idx: number, value: any) => {
        setPairs(prev =>
            prev.map((pair, i) =>
                i === idx ? { ...pair, value } : pair
            )
        );
    };

    const addPair = () => {
        setPairs(prev => [...prev, { field: "", value: "" }]);
    };

    const removePair = (idx: number) => {
        setPairs(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        const result: { [key: string]: any } = {};
        pairs.forEach(pair => {
            if (pair.field) result[pair.field] = pair.value;
        });
        emit(result);
    };

    // const renderValueInput = (fieldId: string, value: any, idx: number) => {
    //     const field = fieldDefs[fieldId];
    //     if (!field || !field.type) {
    //         return (
    //             <input
    //                 className="form-control form-control-sm"
    //                 type="text"
    //                 value={value}
    //                 onChange={e => handleValueChange(idx, e.target.value)}
    //                 placeholder="Value"
    //             />
    //         );
    //     }
    //     switch (field.type) {
    //         case FieldTypes.BOOLEAN:
    //             return (
    //                 <select
    //                     className="form-select form-select-sm"
    //                     value={value}
    //                     onChange={e => handleValueChange(idx, e.target.value === "true")}
    //                 >
    //                     <option value="">Select</option>
    //                     <option value="true">True</option>
    //                     <option value="false">False</option>
    //                 </select>
    //             );
    //         case FieldTypes.DATE:
    //         case FieldTypes.DATETIME:
    //             return (
    //                 <input
    //                     className="form-control form-control-sm"
    //                     type={field.type === FieldTypes.DATE ? "date" : "datetime-local"}
    //                     value={value}
    //                     onChange={e => handleValueChange(idx, e.target.value)}
    //                 />
    //             );
    //         case FieldTypes.NUMBER:
    //         case FieldTypes.FLOAT:
    //         case FieldTypes.DOUBLE:
    //             return (
    //                 <input
    //                     className="form-control form-control-sm"
    //                     type="number"
    //                     value={value}
    //                     onChange={e => handleValueChange(idx, e.target.value)}
    //                 />
    //             );
    //         case FieldTypes.SELECT:
    //             return (
    //                 <select
    //                     className="form-select form-select-sm"
    //                     value={value}
    //                     onChange={e => handleValueChange(idx, e.target.value)}
    //                 >
    //                     <option value="">Select</option>
    //                     {(field.options || []).map((opt: any) => (
    //                         <option key={opt.value} value={opt.value}>{opt.label}</option>
    //                     ))}
    //                 </select>
    //             );
    //         default:
    //             return (
    //                 <input
    //                     className="form-control form-control-sm"
    //                     type="text"
    //                     value={value}
    //                     onChange={e => handleValueChange(idx, e.target.value)}
    //                     placeholder="Value"
    //                 />
    //             );
    //     }
    // };

    return (
        <div className="card w-100 zpanel">
            <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                <h6>Dynamic Key-Value Form for <b>{tableId}</b></h6>
            </div>
            <div className="card-body">
                {pairs.map((pair, idx) => (
                    <div className="row mb-2 align-items-center" key={idx}>
                        <div className="col-4 px-1">
                            <select
                                className="form-select form-select-sm zinput"
                                value={pair.field}
                                onChange={e => handleFieldChange(idx, e.target.value)}
                            >
                                <option value="">Select Field</option>
                                {fields.map(fld => (
                                    <option key={fld} value={fld}>{fld}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col px-1">
                            <input
                                className="form-control form-control-sm zinput"
                                type="text"
                                value={pair.value}
                                onChange={e => handleValueChange(idx, e.target.value)}
                                placeholder="Value"
                            />
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removePair(idx)}
                                disabled={pairs.length === 1}
                            >
                                X
                            </button>
                        </div>
                    </div>
                ))}
                <button className="btn btn-secondary btn-sm me-2" onClick={addPair}>
                    Add Field
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default DynamicKeyValueForm;