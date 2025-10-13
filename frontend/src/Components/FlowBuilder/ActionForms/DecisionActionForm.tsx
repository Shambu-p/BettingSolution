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

const DecisionActionForm = ({selectedNode, updateInput, nodes}: { selectedNode: any, nodes: any[], updateInput: (name: string, value: any) => void }) => {

    const {loggedUser, cookies, localData, forms} = useContext(AuthContext);

    return (
        <div className="w-100 border-top mt-3 py-3">
            <h5 className="h5 mb-3"> Options (for Decision Nodes) </h5>
            <OptionConditionBuilder
                initialOptions={selectedNode.options}
                onSubmit={newOptions => updateInput("options", newOptions)}
                choices={nodes.map(n => n.id)}
            />
            <hr className="my-3" />
            <h5 className="h5"> Else </h5>
            <select
                className="form-control form-control-sm zinput"
                value={selectedNode.next}
                onChange={(e) => updateInput("next", e.target.value)}
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

export default DecisionActionForm;