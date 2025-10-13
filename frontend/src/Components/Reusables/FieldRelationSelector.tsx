import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";

interface FieldRelationSelectorProps {
    tableName: string;
    emit: (relationPath: string) => void;
}

const FieldRelationSelector: React.FC<FieldRelationSelectorProps> = ({ tableName, emit }) => {
    const { forms } = useContext(AuthContext);

    const [selectedTable, setSelectedTable] = useState<string>(tableName);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [availableTables, setAvailableTables] = useState<any[]>([]);
    const [availableFields, setAvailableFields] = useState<any[]>([]);
    const [relationPath, setRelationPath] = useState<string>("");

    // Fetch table definitions
    useEffect(() => {
        setAvailableTables(forms || []);
        const tableDef = (forms || []).find((frm: any) => frm.id === selectedTable);
        setAvailableFields(tableDef?.fields ? Object.keys(tableDef.fields) : []);
    }, [selectedTable, forms]);

    // Build dot separated relation path
    useEffect(() => {
        if (selectedFields.length > 0) {
            setRelationPath(selectedFields.join("."));
        } else {
            setRelationPath("");
        }
    }, [selectedFields]);

    // Emit when relationPath changes
    useEffect(() => {
        if (relationPath) emit(relationPath);
    }, [relationPath, emit]);

    // Get parent tables (relations)
    const getParentTables = (tableId: string) => {
        const tableDef = (forms || []).find((frm: any) => frm.id === tableId);
        if (!tableDef || !tableDef.keys) return [];
        return tableDef.keys
            .filter((key: any) => key.table && key.column)
            .map((key: any) => ({
                table: key.table,
                column: key.column,
                property: key.property
            }));
    };

    // Handler for field selection
    const handleFieldSelect = (field: string, idx: number) => {
        const newFields = [...selectedFields];
        newFields[idx] = field;
        setSelectedFields(newFields.slice(0, idx + 1));
    };

    // Handler for parent table selection
    const handleParentTableSelect = (parent: any, idx: number) => {
        const newFields = [...selectedFields];
        newFields[idx] = parent.column;
        setSelectedFields(newFields.slice(0, idx + 1));
        setSelectedTable(parent.table);
    };

    return (
        <div className="card p-3 mb-3">
            <h6>Select Field Relation Path</h6>
            <div>
                <span className="fw-bold">Table:</span> {selectedTable}
            </div>
            {selectedFields.map((field, idx) => (
                <div key={idx} className="row mb-2">
                    <div className="col">
                        <select
                            className="form-select"
                            value={field}
                            onChange={e => handleFieldSelect(e.target.value, idx)}
                        >
                            <option value="">Select Field</option>
                            {availableFields.map((f: string) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        {getParentTables(selectedTable).length > 0 && (
                            <select
                                className="form-select"
                                onChange={e => {
                                    const parentIdx = e.target.selectedIndex - 1;
                                    if (parentIdx >= 0) {
                                        handleParentTableSelect(getParentTables(selectedTable)[parentIdx], idx + 1);
                                    }
                                }}
                            >
                                <option value="">Select Parent Table</option>
                                {getParentTables(selectedTable).map((parent: any, pIdx: number) => (
                                    <option key={pIdx} value={parent.table}>
                                        {parent.table}.{parent.column}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            ))}
            <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedFields([...selectedFields, ""])}
            >
                Add Field/Relation
            </button>
            <div className="mt-2">
                <span className="fw-bold">Result:</span> {relationPath}
            </div>
        </div>
    )