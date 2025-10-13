import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import FieldTypes from "../../Enums/FiedTypes";

interface DynamicKeyValueFormProps {
    objectData: any;
    emit: (result: { [key: string]: any }) => void;
}

const ObjectBuilderForm: React.FC<DynamicKeyValueFormProps> = ({ objectData, emit }) => {

    // const { forms, localData, cookies } = useContext(AuthContext);

    // const [fields, setFields] = useState<any[]>([]);
    // const [fieldDefs, setFieldDefs] = useState<any>({});
    const [pairs, setPairs] = useState<{ field: string; value: any }[]>([
        { field: "", value: "" }
    ]);

    useEffect(() => {

        if(objectData) {
            setPairs(prev =>
                (Object.keys(objectData) || []).map(fld => ({
                    field: fld,
                    value: objectData[fld] || ""
                }))
            );
        }

    }, [objectData]);

    const handleFieldChange = (idx: number, field: string) => {
        handleSubmit(pairs.map((pair, i) =>
            i === idx ? { ...pair, field, value: "" } : pair
        ));
    };

    const handleValueChange = (idx: number, value: any) => {
        handleSubmit(pairs.map((pair, i) => (i === idx ? { ...pair, value } : pair)));
    };

    const addPair = () => {
        setPairs(prev => [...prev, { field: "", value: "" }]);
    };

    const removePair = (idx: number) => {
        handleSubmit(pairs.filter((_, i) => i !== idx));
    };

    const handleSubmit = (givenPairs: any[]) => {
        const result: { [key: string]: any } = {};
        givenPairs.forEach(pair => {
            if (pair.field) result[pair.field] = pair.value;
        });
        emit(result);
    };

    return (
        <div className="w-100">
            {pairs.map((pair, idx) => (
                <div className="row mb-2 align-items-center" key={idx}>
                    <div className="col-4 px-1">
                        <input
                            type="text"
                            className="form-select form-select-sm zinput"
                            value={pair.field}
                            onChange={e => handleFieldChange(idx, e.target.value)}
                        />
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
            {/* <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                Submit
            </button> */}
        </div>
    );
};

export default ObjectBuilderForm;