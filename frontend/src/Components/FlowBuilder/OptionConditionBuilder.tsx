import React, { useState, useEffect } from "react";
import BasicConditionBuilder from "./BasicConditionBuilder";
import EditNoteIcon from '@mui/icons-material/EditNote';

interface OptionCondition {
    condition: any[];
    next: string;
    isOpen?: boolean;
}

interface OptionConditionBuilderProps {
    initialOptions?: OptionCondition[];
    onSubmit: (options: OptionCondition[]) => void;
    choices?: string[];
}

const OptionConditionBuilder: React.FC<OptionConditionBuilderProps> = ({
    initialOptions = [],
    onSubmit,
    choices = []
}) => {
    const [options, setOptions] = useState<OptionCondition[]>(
        initialOptions.length > 0
            ? initialOptions
            : [{ condition: [], next: "" }]
    );

    // Re-render when initialOptions change
    useEffect(() => {
        setOptions(initialOptions.length > 0 ? initialOptions : [{ condition: [], next: "" }]);
    }, [initialOptions]);

    const handleChange = (idx: number, field: keyof OptionCondition, value: any) => {
        setOptions(prev =>
            prev.map((opt, i) =>
                i === idx ? { ...opt, [field]: value } : opt
            )
        );
    };

    const addOption = () => {
        setOptions(prev => [...prev, { condition: [], next: "", isOpen: true }]);
    };

    const removeOption = (idx: number) => {
        setOptions(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        onSubmit(options);
    };

    return (
        <div>
            {options.map((opt, idx) => (
                <div key={idx} className="row mb-2 align-items-center">
                    <div className="col-12 mb-2">
                        {
                            opt.isOpen && (
                                <div className="p-2 rounded zpanel border-1">
                                    <BasicConditionBuilder 
                                        onSubmit={newConditions => handleChange(idx, "condition", newConditions)}
                                        initialConditions={opt.condition} key={idx}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className="col-auto px-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                // const newCondition = prompt("Set condition:", opt.condition) ?? opt.condition;
                                handleChange(idx, "isOpen", !opt.isOpen)
                            }}
                        >
                            <EditNoteIcon style={{ fontSize: 19 }} />
                        </button>
                    </div>
                    <div className="col">
                        <select
                            className="form-control form-control-sm zinput"
                            value={opt.next}
                            onChange={e => handleChange(idx, "next", e.target.value)}
                        >
                            <option value="">Select Next</option>
                            {choices.map(choice => (
                                <option key={choice} value={choice}>{choice}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeOption(idx)}
                            disabled={options.length === 1}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="mb-2">
                <button type="button" className="btn btn-secondary btn-sm me-2" onClick={addOption}>
                    Add Option
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OptionConditionBuilder;