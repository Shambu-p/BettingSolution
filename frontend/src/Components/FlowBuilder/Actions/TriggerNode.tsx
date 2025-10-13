import React from "react";
import { Handle, Position } from "@xyflow/react";
import FlagIcon from '@mui/icons-material/Flag';

export const TriggerNode = ({ data }: any) => {
  return (
    <div 
        className={`card zbtn shadow-sm ${data.is_selected ? "border-1 border-primary" : ""}`}
        style={{ width: "400px", height: "100px" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-start align-items-start">
            <FlagIcon sx={{fontSize: 30}} className="me-2" />
            <h5 className="card-title fs-4">{data.label}</h5>
        </div>
        <h6 className="card-subtitle mb-2">{data.internalName}</h6>
        {/* <p className="card-text">{data.description}</p> */}
      </div>

      {/* Source (Bottom, Orange, Rectangular) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`trigger-${data.next || ""}`}
        style={{ background: "orange", width: 20, height: 10, borderRadius: 2 }}
      />
    </div>
  );
};
