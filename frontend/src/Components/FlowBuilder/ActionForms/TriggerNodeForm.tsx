import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../Contexts/AuthContext";
import EditNoteIcon from '@mui/icons-material/EditNote';
import BasicConditionBuilder from "../BasicConditionBuilder";
import ScriptEditor from "../../../Components/Reusables/ScriptEditor";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MainAPI from "../../../APIs/MainAPI";
import DynamicKeyValueForm from "../../../Components/Reusables/DynamicKeyValueForm";
import ObjectBuilderForm from "../../../Components/Reusables/ObjectBuilderForm";
import FieldTypes from "../../../Enums/FiedTypes";
import Operators from "../../../Enums/Operators";

const TriggerNodeForm = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {

    const {loggedUser, cookies, localData, forms} = useContext(AuthContext);
    // const [flowDefinations, setFlowDefinations] = useState<any[]>([]);

    // useEffect(() => {
    //     loadData();
    // }, [selectedNode.internalName]);

    // const loadData = async () => {
    //     let flows = await MainAPI.getAll(cookies.login_token, "flow_defination", 0, 0, {
    //         initiation_type: {
    //             type: FieldTypes.TEXT,
    //             operator: Operators.IS,
    //             value: "manual"
    //         }
    //     });

    //     setFlowDefinations(flows.Items);
    // }

    return (
        <div className="w-100 border-top mt-3 py-3">
            <h5 className="h5 mb-3"> Trigger Options </h5>

            <div className="mb-3">
                <label className="form-label">Trigger Type</label>
                <select 
                    className="form-control form-control-sm zinput" 
                    value={selectedNode.triggerType} 
                    onChange={(e) => updateInput("triggerType", e.target.value)}
                >
                    <option value="record_based">Record Based</option>
                    <option value="time_based">Time Based - Recursive</option>
                    <option value="one_time">Time Based - One Time</option>
                    <option value="manual">Manual</option>
                </select>
            </div>
            {
                (selectedNode.triggerType != "manual") && (

                    <div className="mb-3">
                        <label className="form-label">Action Type</label>
                        <select 
                            className="form-control form-control-sm zinput" 
                            value={selectedNode.actionType}
                            disabled={selectedNode.triggerType == "manual"}
                            onChange={(e) => {
                                updateInput("actionType", e.target.value);
                                if(e.target.value == "advanced" && selectedNode.triggerType == "record_based") {
                                    updateInput("script", `

// flow trigger defination
/**
 * this function will be called to check the flow meet the 
 * requirement to be trigger before the main flow script actually triggered.
 * @param {any} record trigger record object
 * @param {any} optionalData optional data passed to the script
 * @returns {boolean} true if the trigger record data meet the requirement
 */
module.exports = async function(record, optionalData) {

optionalData.dependencies.logger("trigger condition is being checked ");
return false;

};`
                                    );
                                } else if(e.target.value == "advanced" && ["time_based", "one_time"].includes(selectedNode.triggerType)) {
                                    updateInput("script", `

// flow trigger defination
/**
 * this function will be called when the flow is triggered.
 * @param {string} current_date_time current iso date time
 * @param {any} optionalData optional data passed to the script
 * @returns {string} next run date time
 */
module.exports = async function(current_date_time, optionalData) {

optionalData.dependencies.logger("next run date fetching ");
// next run date should be 1 hour from now
return new Date(new Date(current_date_time).getTime() + 60 * 60 * 1000).toISOString();

};

                                    `);
                                }
                            }}
                        >
                            <option value="advanced">Advanced</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>
                )
            }
            {
                (["time_based", "one_time"].includes(selectedNode.triggerType) && selectedNode.actionType == "normal") && (
                    <div className="row p-0 m-0 justify-content-center align-items-center mb-3">
                        <div className="col-12 p-0">
                            <label className="form-label">Recurrence</label>
                        </div>
                        <div className="col p-0 me-1">
                            <select 
                                className="form-control form-control-sm zinput" 
                                value={selectedNode.reccurrence} 
                                onChange={(e) => updateInput("reccurrence", e.target.value)}
                            >
                                <option value="">None Selected</option>
                                <option value="one_time">One Time</option>
                                <option value="every_day">Every Day</option>
                                <option value="every_week">Every Week</option>
                                <option value="every_weekday">Every Week Work Days</option>
                                <option value="every_month">Every Month</option>
                                <option value="every_month_last_day">Every Month Last Day</option>
                                <option value="every_year">Every Year</option>
                                <option value="every_hour">Every Hour</option>
                            </select>
                        </div>
                        <div className="col p-0 ms-1">
                            <input 
                                type="datetime-local" 
                                className="form-control form-control-sm zinput" 
                                value={selectedNode.given_datetime} 
                                onChange={(e) => updateInput("given_datetime", e.target.value)}
                            />
                        </div>
                    </div>
                )
            }

            {
                (selectedNode.triggerType == "record_based" && selectedNode.actionType == "normal") && (
                    <div className="row justify-content-between align-items-center mb-3">
                        <div className="col-12">
                            <label className="form-label">Table ID</label>
                        </div>
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
                )
            }

            {
                (selectedNode.triggerType == "record_based" && selectedNode.actionType == "normal") && (
                    <div className="row p-0 m-0 mb-3 justify-content-between align-items-center">
                        <div className="col-12">
                            {
                                (selectedNode.is_condition_open && selectedNode.table_id) && (
                                    <div className="waiting-container d-flex justify-content-center" style={{ zIndex: 1020 }} >
                                        <div className="col-7 my-auto" style={{ height: "max-content" }}>
                                            <div className="card rounded shadow-sm zpanel">
                                                <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                                                    <h5 className="card-title mb-0">Trigger Conditon</h5>
                                                </div>
                                                <div className="card-body">
                                                    <BasicConditionBuilder
                                                        onSubmit={value => {
                                                            updateInput("is_condition_open", false)
                                                            updateInput("condition", value)
                                                        }}
                                                        initialConditions={selectedNode.condition}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-auto px-0">
                            <button
                                className="btn btn-sm zbtn-outline"
                                onClick={(value) => updateInput("is_condition_open", !selectedNode.is_condition_open)}
                            >
                                <FilterAltIcon sx={{ fontSize: 19 }} />
                            </button>
                        </div>
                        <div className="form-label col">Tringger Condition</div>
                    </div>
                )
            }
            {
                (selectedNode.actionType == "advanced") && (
                    <div className="row p-0 m-0 mb-3 justify-content-between align-items-center">
                        <div className="col-12">
                            {
                                (selectedNode.is_script_editor_open) && (
                                    <ScriptEditor
                                        scriptValue={selectedNode.script || ""}
                                        language="javascript"
                                        onExit={(value: string) => {
                                            updateInput("is_script_editor_open", false)
                                            updateInput("script", value);
                                        }}
                                    />
                                )
                            }
                        </div>
                        <div className="col-auto px-0">
                            <button
                                className="btn btn-sm zbtn-outline"
                                onClick={(value) => updateInput("is_script_editor_open", !selectedNode.is_script_editor_open)}
                            >
                                <DataObjectIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                        <div className="form-label col">Script</div>
                    </div>
                )
            }

            <h5 className="h5 mb-3"> Next Action </h5>
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

export default TriggerNodeForm;