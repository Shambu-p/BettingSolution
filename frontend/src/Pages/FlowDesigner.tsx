import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FieldTypes from "../Enums/FiedTypes";
import Utils from "../Models/Utils";
import FormAttachment from "../Components/Reusables/FormAttachment";
import UserRoles from "../Enums/UserRoles";
import Operators from "../Enums/Operators";
import { isMobile } from "react-device-detect";
import { Authorized } from "../APIs/api";
import ScriptEditor from "../Components/Reusables/ScriptEditor";
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';


const FlowDesigner = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [selectData, setSelectData] = useState<any>({
        products: [],
        stores: [],
        customers: [],
        deliveries: []
    });
    const [inputFields, setInputFields] = useState<any>({
        trigger_script: "",
        flow_script: "",
        expanded_trigger_script_editor: false,
        expanded_flow_script_editor: false
    });
    const [localWaiting, setLocalWaiting] = useState(false);
    const [infoFields, setInfoFields] = useState<any>({
        name: "",
        internal_name: "",
        initiation_type: "manual",
        trigger_environment: "both",
        table_id: "",
        next_run_date: "",
        active: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == column));
        if(!found_choice) {
            return {};
        }

        return found_choice;
    }

    const loadData = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id) {
                let result = await MainAPI.getSingle(cookies.login_token, "flow_defination", props.routeData.params.id);

                let scripts = await Authorized(cookies.login_token).bodyRequest("get", `flow/get_scripts?id=${props.routeData.params.id}`);

                setInputFields({
                    trigger_script: scripts.trigger_script,
                    flow_script: scripts.action_script,
                    expanded_trigger_script_editor: false,
                    expanded_flow_script_editor: false
                });

                setInfoFields(result);
                props.updatePageTitle(result.name);
                // setAlert(error.message, "error");

            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const saveFlow = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);

        try {

            let result = await  Authorized(cookies.login_token).bodyRequest("post", "/flow/update_scripts", {
                id: props.routeData.params.id,
                trigger_script: inputFields.trigger_script,
                action_script: inputFields.flow_script
            });

            setAlert(result.message, "success");

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const activateFlow = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            let result = await MainAPI.update(cookies.login_token, "flow_defination", {
                ...infoFields,
                active: true
            });

            setAlert("Operation Successful", "success");
            loadData();

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const loadSelectData = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            // will be implemented

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const updateInfoFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setInfoFields((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setInfoFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const updateInput = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setInputFields((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setInputFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }


    return (
        <div className="w-100">

            <div className="d-flex justify-content-between align-items-start p-2 border-bottom text-white" style={{backgroundColor: "var(--border_color)"}}>
                <div className="ms-2 w-100">
                    <div className="d-flex align-items-start justify-content-between w-100">
                        <div>
                            <div className="fw-bold fs-3">{ infoFields.name }</div>
                            <div className="card-subtitle">{ infoFields.internal_name }</div>
                        </div>
                        <div className="d-flex">
                            {
                                (infoFields.initiation_type == "record_based" && infoFields.active) && (
                                    <button className="btn btn-primary btn-sm px-3 mx-2" type="button">
                                        Test
                                    </button>
                                )
                            }
                            {
                                (!infoFields.active) && (
                                    <button className="btn btn-primary btn-sm px-3 mx-2" type="button" onClick={activateFlow}>
                                        Publish
                                        <DoneAllOutlinedIcon className="ms-2" style={{fontSize: "18px"}} />
                                    </button>
                                )
                            }

                            <button 
                                type="button"
                                className="btn btn-sm btn-success mx-2"
                                disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}
                                onClick={saveFlow}
                            >
                                Save <i className="bx bx-save"></i>
                            </button>

                            <button 
                                className="btn btn-sm btn-dark mx-2"
                                disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}
                                onClick={async () => {
                                    await loadData();
                                }}
                            >
                                Refresh 
                                <i 
                                    className="bx bx-refresh"
                                    style={{fontSize: '20px', transform: `translateY(10%)`}}
                                />
                            </button>
                        </div>
                        {/* <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div> */}
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                        <div>Initiation Type: {getDisplaySelect("flow_defination.initiation_type", infoFields.initiation_type).label ?? "Unknown"}</div>
                        <div>Trigger Environment: {getDisplaySelect("flow_defination.trigger_environment", infoFields.trigger_environment).label ?? "Unknown"}</div>
                    </div>
                </div>
            </div>

            <div className="d-flex" >

                <div className="col"></div>
                <div className="col-sm-12 col-md-9 px-3">

                    <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                        <div className="search-bar py-3">
                            <div className="label">Trigger Script</div>
                            <div className="w-100 py-2">
                                <button 
                                    className="btn btn-sm btn-dark" 
                                    onClick={() => {setInputFields((prev: any) =>({...prev, expanded_trigger_script_editor: !prev.expanded_trigger_script_editor}))}}
                                >
                                    <i className="bx bx-expand" />
                                </button>
                            </div>
                            <textarea
                                className="form-control zinput border py-1"
                                style={{minHeight: "200px"}}
                                disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.System]))}
                                value={inputFields.trigger_script}
                                onChange={(event: any) => {updateInput("trigger_script", event.target.value)}}
                            >
                            </textarea>
                            {
                                (inputFields.expanded_trigger_script_editor) && (
                                    <ScriptEditor
                                        onExit={(new_value: string) => {
                                            updateInput("trigger_script", new_value);
                                            updateInput("expanded_trigger_script_editor", false);
                                        }}
                                        scriptValue={inputFields.trigger_script}
                                        language="javascript"
                                    />
                                )
                            }
                        </div>
                    </div>

                    <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                        <div className="search-bar py-3">
                            <div className="label mb-2">Flow Script</div>
                            <div className="w-100 py-2">
                                <button 
                                    className="btn btn-sm btn-dark" 
                                    onClick={() => {setInputFields((prev: any) =>({...prev, expanded_flow_script_editor: !prev.expanded_flow_script_editor}))}}
                                >
                                    <i className="bx bx-expand" />
                                </button>
                            </div>
                            <textarea
                                className="form-control zinput border p-2"
                                style={{minHeight: "400px"}}
                                disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.System]))}
                                value={inputFields.flow_script}
                                onChange={(event: any) => {updateInput("flow_script", event.target.value)}}
                            >
                            </textarea>
                            {
                                (inputFields.expanded_flow_script_editor) && (
                                    <ScriptEditor
                                        onExit={(new_value: string) => {
                                            updateInput("flow_script", new_value);
                                            updateInput("expanded_flow_script_editor", false);
                                        }}
                                        scriptValue={inputFields.flow_script}
                                        language="javascript"
                                    />
                                )
                            }
                        </div>
                    </div>

                </div>
                <div className="col"></div>

            </div>


            {
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded-5" style={{width: "max-content", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)"}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <div className="spinner-border" style={{color: "var(--text_color)"}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default FlowDesigner;