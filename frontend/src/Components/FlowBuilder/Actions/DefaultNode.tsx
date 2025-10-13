import React from "react";
import { Handle, Position } from "@xyflow/react";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TuneIcon from '@mui/icons-material/Tune';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

export const DefaultNode = ({ data }: any) => {
  return (
    <div className={`card shadow-sm ${data.is_selected ? "border-1 border-primary" : ""}`} style={{ width: "400px", height: "100px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-start align-items-start">
          {
            (data.type == "defaultNode") && (<WidgetsIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "callSubFlow") && (<AccountTreeIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (["setVariable", "setOutPut"].includes(data.type)) && (<SettingsEthernetIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "updateVariable") && (<SystemUpdateAltIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "getSingle") && (<LibraryAddCheckIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "advanced") && (<DataObjectIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "fetchMultiple") && (<PlaylistAddCheckIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "createRecord") && (<PlaylistAddIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "updateRecord") && (<TuneIcon sx={{fontSize: 30}} className="me-2" />)
          }
          {
            (data.type == "approvalNode") && (<RestartAltIcon sx={{fontSize: 30}} className="me-2" />)
          }
          <h5 className="card-title fs-4">{data.label}</h5>
        </div>
        <h6 className="card-subtitle mb-2 text-muted">{data.internalName}</h6>
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
        position={Position.Bottom}
        id={`${data.internalName}-${data.next}`}
        style={{ background: "blue", width: 20, height: 10, borderRadius: 2 }}
      />
    </div>
  );
};
