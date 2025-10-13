import { useContext, useEffect, useState } from "react";
import MainAPI from "../../../APIs/MainAPI";

import DynamicKeyValueForm from "../../../Components/Reusables/DynamicKeyValueForm";
import ObjectBuilderForm from "../../../Components/Reusables/ObjectBuilderForm";
import AuthContext from "../../../Contexts/AuthContext";
import FieldTypes from "../../../Enums/FiedTypes";
import Operators from "../../../Enums/Operators";
import EditNoteIcon from '@mui/icons-material/EditNote';
import BasicConditionBuilder from "../BasicConditionBuilder";
import ScriptEditor from "../../../Components/Reusables/ScriptEditor";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DataObjectIcon from '@mui/icons-material/DataObject';
import QueryBuilder from "../../../Components/Reusables/QueryBuilder";

const RecordActionFrom = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {

    const {loggedUser, cookies, localData, forms} = useContext(AuthContext);

    return (
        <div className="w-100 border-top mt-3 py-3">
            <h5 className="h5 mb-3"> Record Options </h5>

            <label className="form-label">Table ID</label>
            <div className="row justify-content-between align-items-center mb-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control form-control-sm zinput w-100"
                        value={selectedNode.table_id}
                        onChange={(e) => {
                            updateInput("filter_condition", []);
                            updateInput("table_id", e.target.value);
                        }}
                    />
                </div>
                <div className="col-auto">
                    <button
                        className="btn zbtn dropdown-toggle py-1"
                        style={{ fontSize: "13px" }}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <EditNoteIcon sx={{ fontSize: 19 }} />
                    </button>
                    <ul className="dropdown-menu zpanel">
                        {
                            forms.map((f: any) => (
                                <li key={f.id}>
                                    <button
                                        onClick={() => {
                                            updateInput("table_id", f.id);
                                            updateInput("filter_condition", []);
                                        }}
                                        className="dropdown-item zoption"
                                    >
                                        {f.title}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            {
                (["getSingle", "updateRecord", "deleteRecord"].includes(selectedNode.type)) && (
                    <div className="mb-3">
                        <label className="form-label">Record ID</label>
                        <input
                            type="text"
                            className="form-control form-control-sm zinput w-100"
                            value={selectedNode.record_id}
                            onChange={(e) => updateInput("record_id", e.target.value)}
                        />
                    </div>
                )
            }
            {
                (selectedNode.type == "fetchMultiple") && (
                    <div className="row p-0 m-0 mb-3 justify-content-between align-items-center">
                        <div className="col-12">
                            {
                                (selectedNode.is_filter_open && selectedNode.table_id) && (
                                    <div className="waiting-container d-flex justify-content-center" style={{ zIndex: 1020 }} >
                                        <div className="col-7 my-auto" style={{ height: "max-content" }}>
                                            <QueryBuilder
                                                tableName={selectedNode.table_id}
                                                initialCondition={selectedNode.filter_condition}
                                                onQueryChange={(value: any[]) => {
                                                    updateInput("is_filter_open", false)
                                                    updateInput("filter_condition", value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-auto px-0">
                            <button
                                className="btn btn-sm zbtn-outline"
                                onClick={(value) => updateInput("is_filter_open", !selectedNode.is_filter_open)}
                            >
                                <FilterAltIcon sx={{ fontSize: 19 }} />
                            </button>
                        </div>
                        <div className="form-label col">Filter Condition</div>
                    </div>
                )
            }
            {
                (["fetchMultiple", "getSingle"].includes(selectedNode.type)) && (
                    <div className="w-100 mb-3">

                        <div className="form-label">Relationship to Fetch</div>
                        <select
                            className="form-control form-control-sm zinput"
                            value={selectedNode.relation}
                            onChange={(e) => updateInput("relation", e.target.value)}
                        >
                            <option value="none">Select Relationship</option>
                            <option value="reference">References</option>
                            {selectedNode.type == "getSingle" && (<option value="children">Children</option>)}
                            {selectedNode.type == "getSingle" && (<option value="reference_children">Reference And Children</option>)}
                        </select>

                    </div>
                )
            }
            {
                (["createRecord", "updateRecord"].includes(selectedNode.type)) && (
                    <DynamicKeyValueForm
                        recordData={selectedNode.record_data}
                        tableId={selectedNode.table_id}
                        emit={(result) => {
                            updateInput("record_data", result);
                        }}
                    />
                )
            }

            <div className="form-label mt-3"> Next Action </div>
            <select
                className="form-control form-control-sm zinput"
                value={selectedNode.next}
                onChange={(e) => updateInput("next", e.target.value)}
                disabled={selectedNode.type == "loopEnd"}
            >
                <option value="">Select Next Action</option>
                {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                        {n.data.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default RecordActionFrom;