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
import OptionConditionBuilder from "../OptionConditionBuilder";

const AdvancedActionForm = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {

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
        <div className="w-100">
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

export default AdvancedActionForm;