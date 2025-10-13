import { useContext, useEffect, useState } from "react";
import MainAPI from "../../../APIs/MainAPI";
import DynamicKeyValueForm from "../../../Components/Reusables/DynamicKeyValueForm";
import ObjectBuilderForm from "../../../Components/Reusables/ObjectBuilderForm";
import AuthContext from "../../../Contexts/AuthContext";
import FieldTypes from "../../../Enums/FiedTypes";
import Operators from "../../../Enums/Operators";

const SubFlowForm = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {

    const {cookies} = useContext(AuthContext)
    const [flowDefinations, setFlowDefinations] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, [selectedNode.internalName]);

    const loadData = async () => {

        let flows = await MainAPI.getAll(cookies.login_token, "flow_defination", 0, 0, {
            initiation_type: {
                type: FieldTypes.TEXT,
                operator: Operators.IS,
                value: "manual"
            }
        });

        setFlowDefinations(flows.Items);

    }

    return (
        <div className="w-100 border-top mt-3 py-3">
            <h5 className="h5 mb-3"> Sub Flow Options </h5>

            <div className="mb-3">
                <label className="form-label">Sub-Flow to Run</label>
                <select 
                    className="form-control form-control-sm zinput" 
                    value={selectedNode.fw_id} 
                    onChange={(e) => updateInput("fw_id", e.target.value)}
                >
                    <option value="">Select Sub-Flow</option>
                    {
                        flowDefinations.map(fw => (
                            <option value={fw.sys_id}>{fw.name}</option>
                        ))
                    }
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Input Data</label>
                <select 
                    className="form-control form-control-sm zinput mb-3" 
                    value={selectedNode.value_type} 
                    onChange={(e) => updateInput("value_type", e.target.value)}
                >
                    <option value="">Select Value Type</option>
                    <option value="object">Object</option>
                    <option value="dynamic">Get Variable</option>
                </select>

                {
                    (selectedNode.value_type == "dynamic") && (
                        <input
                            type="text"
                            className="form-control form-control-sm zinput mb-3" 
                            value={selectedNode.input_data}
                            onChange={(e) => updateInput("input_data", e.target.value)}
                        />
                    )
                }

                {
                    (selectedNode.value_type == "object") && (
                        <div className="card w-100 zpanel">
                            <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                                <h6> Dynamic Object Builder </h6>
                            </div>
                            <div className="card-body">
                            <ObjectBuilderForm
                                objectData={selectedNode.input_data || {}}
                                emit={(result) => {
                                    updateInput("input_data", result);
                                }}
                            />
                            </div>
                        </div>
                    )
                }
            </div>

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

export default SubFlowForm;