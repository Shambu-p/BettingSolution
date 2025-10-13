import React from "react";
import { Handle, Position } from "@xyflow/react";

const LoopEnd = ({ data }: any) => {

    return (
        <div className={`card shadow-sm ${data.is_selected ? "border-1 border-primary" : ""}`} style={{ width: "200px", height: "70px"}}>

            <div className="card-body">
                <div className="d-flex justify-content-start align-items-start w-100" style={{ overflow: "hidden" }}>
                    <h5 className="card-title fs-6 w-100" style={{textOverflow: "ellipsis"}}>{data.label}</h5>
                </div>
                {/* <h6 className="card-subtitle mb-2 text-muted">{data.internalName}</h6> */}
                {/* <p className="card-text">{data.description}</p> */}
            </div>

            {/* Target (Top, Green, Rectangular) */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: "green", width: 20, height: 10, borderRadius: 2 }}
            />

            {/* Source (Bottom, Blue, Rectangular) */}
            <Handle
                type="source"
                position={Position.Right}
                id={`${data.internalName}-${data.next}`}
                style={{ background: "blue", width: 10, height: 20, borderRadius: 2 }}
            />
        </div>
    );
};

export default LoopEnd;