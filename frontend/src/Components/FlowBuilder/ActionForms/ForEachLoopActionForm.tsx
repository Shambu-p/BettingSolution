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

const ForEachLoopActionForm = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {



    return (
        <div className="w-100 border-top mt-3 py-3">
            <h5 className="h5 mb-3">Loops Options</h5>

            {
                (selectedNode.type == "forEachLoop") ? (
                    <div className="w-100">
                        <label className="form-label">Data to Iterate</label>
                        <input
                            className="form-control form-control-sm zinput mb-3"
                            value={selectedNode.loopData}
                            onChange={(e) => updateInput("loopData", e.target.value)}
                        />
                    </div>
                ) : (
                    <BasicConditionBuilder
                        initialConditions={selectedNode.condition}
                        onSubmit={newOptions => updateInput("condition", newOptions)}
                    />
                )
            }

            <hr className="my-3" />

            <label className="form-label">Loop Starting Action</label>
            <select
                className="form-control form-control-sm zinput mb-3"
                value={selectedNode.loopStart}
                onChange={(e) => updateInput("loopStart", e.target.value)}
            >
                <option value="">Select Action</option>
                {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                        {n.data.label}
                    </option>
                ))}
            </select>

            <label className="form-label">Next Action</label>
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

export default ForEachLoopActionForm;