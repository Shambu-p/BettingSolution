import React from "react";
import { Handle, Position } from "@xyflow/react";
import AltRouteIcon from '@mui/icons-material/AltRoute';

export const DecisionNode = ({ data }: any) => {
  return (
    <div className={`card shadow-sm ${data.is_selected ? "border-1 border-primary" : ""}`} style={{ width: "400px", height: "100px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-start align-items-start">
          <AltRouteIcon sx={{fontSize: 30}} className="me-2" />
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
      {data.options?.map((opt: any, idx: number) => (
        <Handle
          key={`${data.internalName}-${opt.next}`}
          type="source"
          position={Position.Bottom}
          id={`${data.internalName}-${opt.next}`}
          style={{
            background: "blue",
            width: 20,
            height: 10,
            borderRadius: 2,
            left: 20 + idx * 40,
          }}
        />
      ))}
      
      <Handle
        key={`${data.internalName}-${data.next || "else"}`}
        type="source"
        position={Position.Bottom}
        id={`${data.internalName}-${data.next || "else"}`}
        style={{
          background: "red",
          width: 20,
          height: 10,
          borderRadius: 2,
          left: 20 + data.options.length * 40,
        }}
      />
    </div>
  );
};
