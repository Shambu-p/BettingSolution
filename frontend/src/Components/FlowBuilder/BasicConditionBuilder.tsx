import React, { useState } from "react";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const OPERATORS = [
    { value: "equals", label: "Equals" },
    { value: "not_empty", label: "Not Empty" },
    { value: "empty", label: "Empty" },
    { value: "not", label: "Not" },
    { value: "ls", label: "Less" },
    { value: "gt", label: "Greater" },
    { value: "in", label: "In" },
    { value: "not_in", label: "Not In" },
    { value: "contains", label: "Contains" },
    { value: "has", label: "Has" },
];

const TYPES = [
    { value: "string", label: "Text" },
    { value: "array", label: "Array" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date" }
];

const CONNECTORS = [
    { value: "AND", label: "AND" },
    { value: "OR", label: "OR" }
];

interface Condition {
    left: string;
    type: string;
    right: string;
    is_dynamic: boolean;
    operator: string;
    connector: string;
}

const getOperatorOptions = (type: string) => {

    if(type == "string") {
        return [
            { value: "equals", label: "Equals" },
            { value: "not_empty", label: "Not Empty" },
            { value: "empty", label: "Empty" },
            { value: "not", label: "Not" },
            { value: "in", label: "In" },
            { value: "not_in", label: "Not In" },
            { value: "contains", label: "Contains" }
        ];
    } else if(type == "array") {
        return [
            { value: "has", label: "Has" },
            { value: "not_empty", label: "Not Empty" },
            { value: "empty", label: "Empty" }
        ];
    } else if(type == "number") {
        return [
            { value: "equals", label: "Equals" },
            { value: "not_empty", label: "Not Empty" },
            { value: "empty", label: "Empty" },
            { value: "not", label: "Not" },
            { value: "ls", label: "Less" },
            { value: "gt", label: "Greater" },
            { value: "in", label: "In" },
            { value: "not_in", label: "Not In" }
        ];
    } else if(type == "boolean") {
        return [
            { value: "equals", label: "Equals" }
        ];
    } else if(type == "date") {
        return [
            { value: "equals", label: "Equals" },
            { value: "not_empty", label: "Not Empty" },
            { value: "empty", label: "Empty" },
            { value: "not", label: "Not" },
            { value: "ls", label: "Less" },
            { value: "gt", label: "Greater" }
        ];
    } else {
        return [];
    }
}

interface ConditionBuilderProps {
    initialConditions?: Condition[];
    onSubmit: (conditions: Condition[]) => void;
}

const BasicConditionBuilder: React.FC<ConditionBuilderProps> = ({ initialConditions = [], onSubmit }) => {
    const [conditions, setConditions] = useState<Condition[]>(
        initialConditions.length > 0
            ? initialConditions
            : [{ left: "", type: "string", right: "", operator: "equals", is_dynamic: false, connector: "AND" }]
    );

    const handleChange = (idx: number, field: keyof Condition, value: any) => {
        console.log("chaning ", field, " to ", value);
        setConditions(prev =>
            prev.map((cond, i) =>
                i == idx ? { ...cond, [field]: value } : cond
            )
        );
    };

    const addCondition = () => {
        setConditions(prev => [
            ...prev,
            { left: "", type: "string", right: "", operator: "equals", is_dynamic: false, connector: "AND" }
        ]);
    };

    const removeCondition = (idx: number) => {
        setConditions(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        console.log("final condition ", conditions);
        onSubmit(conditions);
    };

    const renderValue = (indx: number, singleCondition: Condition) => {

        if(singleCondition.type == "date") {
            return (
                <input
                    className="form-control form-control-sm zinput w-75"
                    type="datetime-local"
                    placeholder="Right Operand"
                    value={singleCondition.right}
                    onChange={e => handleChange(indx, "right", e.target.value)}
                />
            );
        } else if(singleCondition.type == "boolean") {
            return (
                <div className="col w-75">
                    <input
                        className="form-check-input form-check-input-sm zcheck_box"
                        type="checkbox"
                        checked={singleCondition.right == "{{true}}"}
                        title="Select all records"
                        onChange={e => {handleChange(indx, "right", (e.target.checked ? "{{true}}" : "{{false}}"))}}
                    />
                </div>
            );
        } else {
            return (
                <input
                    className="form-control form-control-sm zinput w-75"
                    type="text"
                    placeholder="Right Operand"
                    value={singleCondition.right}
                    onChange={e => handleChange(indx, "right", e.target.value)}
                />
            );
        }
    };

    return (
        <div className="p-2 rounded-3">
            {conditions.map((cond, idx) => (
                <div key={idx} className="row mb-2 align-items-end">
                    <div className="col input-group px-1">
                        <input
                            className="form-control form-control-sm zinput w-75"
                            placeholder="Left"
                            value={cond.left}
                            onChange={e => handleChange(idx, "left", e.target.value)}
                        />
                        <select
                            className="form-control form-control-sm zinput w-25"
                            value={cond.type}
                            onChange={e => handleChange(idx, "type", e.target.value)}
                        >
                            {TYPES.map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>

                    </div>
                    <div className="col-2 px-1">
                        <select
                            className="form-control form-control-sm zinput"
                            value={cond.operator}
                            onChange={e => handleChange(idx, "operator", e.target.value)}
                        >
                            {getOperatorOptions(cond.type).map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>
                    </div>
                    {
                        !["empty", "not_empty"].includes(cond.operator) ? (
                            <div className="col input-group px-1">

                                {
                                    (cond.is_dynamic) ? (
                                        <input
                                            className="form-control form-control-sm zinput"
                                            placeholder="Right Operand"
                                            value={cond.right}
                                            onChange={e => handleChange(idx, "right", e.target.value)}
                                        />
                                    ) : (
                                        renderValue(idx, cond)
                                    )
                                }
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handleChange(idx, "is_dynamic", !cond.is_dynamic)}
                                >
                                    <AutoFixHighIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        ) : (
                            <div className="col input-group px-1">
                            </div>
                        )
                    }
                    <div className="col-1 px-1">
                        <select
                            className="form-control form-control-sm zinput"
                            value={cond.connector}
                            onChange={e => handleChange(idx, "connector", e.target.value)}
                        >
                            {CONNECTORS.map(conn => (
                                <option key={conn.value} value={conn.value}>{conn.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto px-0">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeCondition(idx)}
                            disabled={conditions.length === 1}
                        >
                            X
                        </button>
                    </div>
                </div>
            ))}
            <div className="mb-2">
                <button type="button" className="btn btn-secondary btn-sm me-2" onClick={addCondition}>
                    Add Condition
                </button>
                <button onClick={handleSubmit} className="btn btn-primary btn-sm">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default BasicConditionBuilder;