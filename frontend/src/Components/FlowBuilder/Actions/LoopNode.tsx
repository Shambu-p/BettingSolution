import React from "react";
import { Handle, Position } from "@xyflow/react";
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LoopIcon from '@mui/icons-material/Loop';

const LoopNode = ({ data }: any) => {
    return (
        <div className={`card shadow-sm ${data.is_selected ? "border-1 border-primary" : ""}`} style={{ width: "400px", height: "100px" }}>
            <div className="card-body">
                <div className="d-flex justify-content-start align-items-start">
                    <LoopIcon sx={{fontSize: 30}} className="me-2" />
                    <h5 className="card-title fs-4">{data.label}</h5>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">{data.internalName}</h6>
                {/* <p className="card-text">{data.description}</p> */}
            </div>

            {/* Target (Top, Green) */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: "green", width: 20, height: 10, borderRadius: 2 }}
            />

            {/* Multiple Source Handlers (Bottom, Blue) */}
            <Handle
                type="target"
                position={Position.Right}
                id={`next_repeat_${data.internalName}`}
                style={{
                    background: "green",
                    width: 10,
                    height: 20,
                    borderRadius: 2
                }}
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id={`${data.internalName}-${data.next}`}
                style={{
                    background: "red",
                    width: 20,
                    height: 10,
                    borderRadius: 2,
                    left: 20
                }}
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id={`loop_start_${data.internalName}`}
                style={{
                    background: "blue",
                    width: 20,
                    height: 10,
                    borderRadius: 2
                }}
            />
            {
                // (data.loopStart != undefined && data.loopStart != null) && (
                // )
            }

        </div>
    );
};

export default LoopNode;
