
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
// import MainAPI from "../APIs/MainAPI";
// import { useParams } from "react-router-dom";
// import FieldTypes from "../Enums/FiedTypes";
// import Utils from "../Models/Utils";
// import UserRoles from "../Enums/UserRoles";
// import Operators from "../Enums/Operators";
// import { isMobile } from "react-device-detect";


import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import TableDefination from "./TableDefination";
import FieldConfig from "./FieldConfig";
import ButtonConfigForm from "./ButtonConfigForm";
import RelatedListConfigForm from "./RelatedListConfigForm";
import MainAPI from "../APIs/MainAPI";
import { Authorized } from "../APIs/api";
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import ComponentLoader from "./ComponentLoader";

const EyukaPage = (props: any) => {

    const { loggedUser, cookies, localData } = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);



    const [tableDefination, setTableDefination] = useState<any>({
        name: '',
        backup_order: 0,
        title: '',
        id: '-1',
        activityRoles: [],
        canReadAttachment: [],
        canAddAttachment: [],
        idColumn: '',
        writeRoles: [
        ],
        updateRoles: [
        ],
        readRoles: [
        ],
        deleteRoles: [
        ],
        additionalFilter: [
        ],
        createAccessCondition: true,
        updateAccessCondition: [
        ],
        deleteAccessCondition: true,
        createScript: {},
        updateScript: {},
        deleteScript: {},
        onsubmit: "",
        listLoader: "",
        onload: "",
    });
    const [tableKeyDefinations, setTableKeyDefinations] = useState<any[]>([]);
    const [tableFieldDefinations, setTableFieldDefinations] = useState<any[]>([
        {
            "type": "text",
            "maxLength": 40,
            "minLength": 32,
            "required": false,
            "id": "sys_id",
            "label": "System Id",
            "description": "",
            "order": 1,
            "visible": false,
            "readonly": true,
            "notOnList": true,
            "onChange": "default",
            "writeRoles": [],
            "readRoles": [
                "admin"
            ],
            "updateRoles": []
        },
        {
            "type": "datetime-local",
            "defaultValue": {
                "name": "currentDate"
            },
            "id": "created_on",
            "label": "Created On",
            "description": "",
            "order": 1,
            "visible": true,
            "readonly": false,
            "notOnList": false,
            "onChange": "default",
            "writeRoles": [],
            "readRoles": [
                "admin"
            ],
            "updateRoles": []
        },
        {
            "type": "datetime-local",
            "defaultValue": {
                "name": "currentDate"
            },
            "id": "updated_on",
            "label": "Updated On",
            "description": "",
            "order": 1,
            "visible": true,
            "readonly": false,
            "notOnList": false,
            "onChange": "default",
            "writeRoles": [],
            "readRoles": [
                "admin"
            ],
            "updateRoles": []
        },
        {
            "type": "reference",
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },
            "id": "created_by",
            "label": "Created By",
            "description": "",
            "order": 1,
            "visible": true,
            "readonly": false,
            "notOnList": true,
            "ref_app": "global",
            "references": "user",
            "displayField": "full_name",
            "onChange": "default",
            "writeRoles": [],
            "readRoles": [
                "admin"
            ],
            "updateRoles": []
        },
        {
            "type": "reference",
            "minLength": 32,
            "maxLength": 38,
            "defaultValue": {
                "name": "currentUser",
                "property": "Id"
            },
            "id": "updated_by",
            "label": "Updated By",
            "description": "",
            "order": 1,
            "visible": true,
            "readonly": false,
            "notOnList": true,
            "ref_app": "global",
            "references": "user",
            "displayField": "full_name",
            "onChange": "default",
            "writeRoles": [],
            "readRoles": [
                "admin"
            ],
            "updateRoles": []
        }
    ]);
    const [tableChildrenDefinations, setTableChildrenDefinations] = useState<any[]>([]);
    const [tableRelatedListDefinations, setTableRelatedListDefinations] = useState<any[]>([]);
    const [tableButtonsDefinations, setTableButtonsDefinations] = useState<any[]>([]);
    const [clientScripts, setClientScripts] = useState<{ name: string, script: string }[]>([]);
    const [serverScript, setServerScripts] = useState<{ name: string, script: string }[]>([]);

    const [configForm, setConfigForm] = useState<{
        formType: ("table" | "field" | "button" | "relatedList"),
        saveType: ("add" | "update"),
        formData: any
    }>({
        // "table", "field", "button", "relatedList"
        formType: "table",
        // This will hold the data for the currently open form, whether it's for table, field, button, or related list configuration.
        formData: {},
        // or "update", this will help the form know whether it's creating a new config or updating an existing one.
        saveType: "add"
    });

    const [application, setApplication] = useState<string>("");
    const [tableId, setTableId] = useState<string>("");
    // const [applicationList, setApplicationList] = useState<any[]>([]);
    // const [roleList, setRoleList] = useState<any[]>([]);
    const [optionData, setOptionData] = useState<any>({
        tableList: [],
        applicationList: [],
        roleList: [],
    });



    // const params = useParams();
    useEffect(() => {
        loadOptionData();
    }, []);

    const loadOptionData = async () => {
        let od: any = {};
        od.applicationList = await loadApplicationData();
        od.roleList = await loadRoleList();
        od.tableList = await loadTableList();
        setOptionData(od);
    }

    const loadApplicationData = async () => {

        try {

            let applications = await MainAPI.getAll(cookies.login_token, "choice", 0, 0, {
                id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: "applications"
                }
            }, "reference");
            return applications.Items;

        } catch (err) {
            console.log("Error loading applications: ", err);
        }

    }
    const loadRoleList = async () => {

        try {

            let roles = await MainAPI.getAll(cookies.login_token, "choice", 0, 0, {
                id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: "userRole.role"
                }
            }, "reference");
            return roles.Items;

        } catch (err) {
            console.log("Error loading role list: ", err);
        }

    }

    const loadTableList = async () => {

        try {

            return await Authorized(cookies.login_token).bodyRequest("get", "builder/table_list", {});

        } catch (err) {
            console.log("Error loading table list: ", err);
        }

    }

    const getFormConfigType = () => {
        return (props.routeData.params.app_id == "-1" || props.routeData.params.table_id == "-1") ? "add" : "update";
    }


    const setAppAndTable = (app_id: string, table_id: string) => {

        // This function would ideally validate the application and table ID before setting them.
        // For now, it just sets them directly.
        // In a real implementation, you might want to check if the application exists and if the table ID is valid.

        setTableDefination((prev: any) => ({
            ...prev,
            application_id: app_id,
            id: table_id
        }));

    }

    const saveTableSetting = (tableData: any, action_type: string) => {
        // This function would handle saving the table configuration to the backend or local storage.
        // For now, it just logs the data to the console.

        // console.log("Saving Table Configuration: ", tableData);
        setTableDefination((prev: any) => ({
            ...tableData,
            application_id: prev.application_id,
            id: prev.id
        }));

    }

    const saveFieldSetting = (fieldData: any, action_type: string) => {

        // This function would handle saving the field configuration to the backend or local storage.
        // For now, it just logs the data to the console.

        // console.log("Saving Field Configuration: ", fieldData);
        if (action_type === "add") {

            setTableFieldDefinations((prev: any) => [...prev, fieldData]);
            setConfigForm((prev) => ({ ...prev, formData: fieldData, saveType: "update" }));

        } else if (action_type === "update") {

            setTableFieldDefinations((prev: any) => {
                const index = prev.findIndex((f: any) => f.id === configForm.formData.id);
                if (index !== -1) {
                    prev[index] = fieldData;
                }
                return [...prev];
            });

        } else if (action_type === "delete") {

            setTableFieldDefinations((prev: any) => {
                return prev.filter((f: any) => f.id !== fieldData.id);
            });

        }

    }

    const saveButtonSetting = (buttonData: any, action_type: string) => {
        // This function would handle saving the button configuration to the backend or local storage.
        // For now, it just logs the data to the console.

        // console.log("Saving Button Configuration: ", buttonData);
        if (action_type === "add") {
            setTableDefination((prev: any) => ({ ...prev, buttons: [...(prev.buttons || []), buttonData] }));
        } else if (action_type === "update") {
            setTableDefination((prev: any) => {
                const buttons = [...(prev.buttons || [])];
                const index = buttons.findIndex((b: any) => b.id === buttonData.id);
                if (index !== -1) {
                    buttons[index] = buttonData;
                }
                return { ...prev, buttons };
            });
        } else if (action_type === "delete") {
            setTableDefination((prev: any) => {
                const buttons = [...(prev.buttons || [])].filter((b: any) => b.id !== buttonData.id);
                return { ...prev, buttons };
            });
        }

    }

    const saveRelatedListSetting = (relatedListData: any, action_type: string) => {
        // This function would handle saving the related list configuration to the backend or local storage.
        // For now, it just logs the data to the console.

        // console.log("Saving Related List Configuration: ", relatedListData);
        if (action_type === "add") {
            setTableDefination((prev: any) => ({ ...prev, relatedLists: [...(prev.relatedLists || []), relatedListData] }));
        } else if (action_type === "update") {
            setTableDefination((prev: any) => {
                const relatedLists = [...(prev.relatedLists || [])];
                const index = relatedLists.findIndex((rl: any) => rl.id === relatedListData.id);
                if (index !== -1) {
                    relatedLists[index] = relatedListData;
                }
                return { ...prev, relatedLists };
            });
        } else if (action_type === "delete") {
            setTableDefination((prev: any) => {
                const relatedLists = [...(prev.relatedLists || [])].filter((rl: any) => rl.id !== relatedListData.id);
                return { ...prev, relatedLists };
            });
        }
    }

    return (
        <div className="d-flex justify-content-between align-items-start" style={{ background: "transparent", height: "100%", width: "100%", position: "relative" }}>

            <div className="zpanel w-75 h-100" style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--border_color)" }}>
                <div className="d-flex align-items-center justify-content-end px-3 py-2 border-bottom" style={{ height: "max-content" }}>
                    <button className="btn btn-sm zbtn-outline me-2" onClick={() => { setConfigForm({ formType: "table", formData: {}, saveType: getFormConfigType() }) }}>
                        Table Seting
                    </button>
                    <button className="btn btn-sm zbtn">
                        Save
                    </button>
                    <select title="Application container" className="form-control form-control-sm zinput text-end ms-2" style={{ width: "200px", cursor: "pointer" }}>
                        <option value="app_name">Application Name</option>
                    </select>
                </div>
                <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
                    <div className="d-flex justify-content-between align-items-center py-2 px-3 border-bottom">
                        <div className="card-title">{tableDefination.title}</div>
                        <div className="d-flex justify-content-end align-items-center">
                            <button title="Add New Button" type="button" className="btn btn-sm z-add-btn ms-2" onClick={() => { setConfigForm({ formType: "button", formData: {}, saveType: "add" }) }}>
                                <AddIcon style={{ fontSize: "20px", color: "var(--border_color)" }} />
                            </button>
                            <button className="btn btn-sm zbtn ms-2">
                                Approve
                            </button>
                            <button className="btn btn-sm zbtn ms-2">
                                Update
                            </button>
                        </div>
                    </div>
                    <div className="zpanel d-flex px-3 pt-3" style={{ flexWrap: "wrap" }}>

                        {
                            tableFieldDefinations.map((field: any) => (
                                <div className="col-4 p-2" style={{ cursor: "pointer" }}>
                                    <div
                                        className="d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded-3 shadow-sm"
                                        style={{ border: "3px solid var(--button_bg)", color: "var(--button_bg)" }}
                                        onClick={() => { setConfigForm({ formType: "field", formData: field, saveType: "update" }) }}
                                    >
                                        <div className="d-flex" style={{ width: "max-content" }}>
                                            <SettingsIcon className="z-scale-up-hover" style={{ fontSize: "20px" }} />
                                            <b className="ms-2">{field.label}</b>
                                        </div>
                                        <DeleteIcon className="z-scale-up-hover text-danger" style={{ fontSize: "20px" }} />
                                    </div>
                                </div>
                            ))
                        }

                        <div className="col-4 p-2" style={{ cursor: "pointer" }}>
                            <div
                                className="d-flex justify-content-center w-100 px-3 py-2 rounded-3 shadow-sm z-scale-up-hover"
                                style={{ border: "3px solid var(--border_color)", color: "var(--border_color)" }}
                                onClick={() => {
                                    setConfigForm({
                                        formType: "field", formData: {
                                            "type": "",
                                            "minLength": 32,
                                            "maxLength": 38,
                                            "id": "",
                                            "label": "",
                                            "description": "",
                                            "order": 1,
                                            "visible": true,
                                            "readonly": false,
                                            "notOnList": true,
                                            "references": "",
                                            "displayField": "",
                                            "onChange": "",
                                            "writeRoles": [],
                                            "readRoles": [],
                                            "updateRoles": []
                                        }, saveType: "add"
                                    })
                                }}
                            >
                                <AddIcon style={{ fontSize: "25px" }} /> <b className="ms-3">New Field</b>
                            </div>
                        </div>


                    </div>


                    <div className="d-flex justify-content-start align-items-center py-2 px-3 border-top border-bottom mt-5">

                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3 shadow-sm"
                            style={{
                                border: "3px solid var(--button_bg)",
                                color: "var(--button_bg)",
                                width: "150px"
                            }}
                        >
                            <div className="d-flex" style={{ width: "max-content" }}>
                                <SettingsIcon className="z-scale-up-hover" style={{ fontSize: "20px" }} />
                                <b className="ms-2">List 1</b>
                            </div>
                            <DeleteIcon className="z-scale-up-hover text-danger" style={{ fontSize: "20px" }} />
                        </div>

                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3 shadow-sm ms-2"
                            style={{
                                border: "3px solid var(--button_bg)",
                                color: "var(--button_bg)",
                                width: "150px"
                            }}
                        >
                            <div className="d-flex" style={{ width: "max-content" }}>
                                <SettingsIcon className="z-scale-up-hover" style={{ fontSize: "20px" }} />
                                <b className="ms-2">List 2</b>
                            </div>
                            <DeleteIcon className="z-scale-up-hover text-danger" style={{ fontSize: "20px" }} />
                        </div>

                        <div
                            className="d-flex justify-content-center px-3 py-1 rounded-3 shadow-sm z-scale-up-hover ms-2"
                            style={{
                                border: "3px solid var(--border_color)",
                                color: "var(--border_color)"
                            }}
                            onClick={() => { setConfigForm({ formType: "relatedList", formData: {}, saveType: "add" }) }}
                        >
                            <AddIcon style={{ fontSize: "33px" }} />
                        </div>

                    </div>

                </div>
            </div>
            <div className="col h-100" style={{ overflowY: "auto" }}>

                {/* {(configForm === "table") && (<TableDefination />)} */}
                {(configForm.formType === "table") && (
                    <ComponentLoader compId="builder-table-def" dataPassed={{
                        config: tableDefination,
                        serverScripts: serverScript,
                        roles: optionData.roleList,
                        fieldsConfig: tableFieldDefinations,
                        saveAction: (config: any, serverScripts: any[]) => {
                            saveTableSetting(config, getFormConfigType());
                            setServerScripts(serverScripts);
                        }
                    }} />
                )}
                {(configForm.formType === "field") && (<ComponentLoader compId="builder-field-config" dataPassed={{
                    config: configForm.formData,
                    roles: optionData.roleList,
                    appList: optionData.applicationList,
                    tableOptions: optionData.tableList,
                    tableConfig: tableDefination,
                    clientScripts,
                    saveAction: (config: any) => {
                        saveFieldSetting(config, configForm.saveType);
                    }
                }} />)}
                {(configForm.formType === "button") && (<ComponentLoader compId="builder-button-config" dataPassed={{}} />)}
                {(configForm.formType === "relatedList") && (<ComponentLoader compId="builder-related-list" dataPassed={{}} />)}

            </div>

            {
                (!tableDefination.id || tableDefination.id == "-1" || !tableDefination.application_id || tableDefination.application_id == "-1") && (

                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            borderLeft: "1px solid var(--border_color)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    >

                        <div className="w-100 h-100" style={{ background: "black", opacity: "0.5" }}></div>

                        <div
                            className="card zpanel position-absolute top-50 start-50 translate-middle"
                            style={{ width: "400px", zIndex: 10 }}
                        >
                            <div className="card-body">
                                <h5 className="card-title fw-bold fs-5">Fill This First</h5>
                                <p className="card-text mb-3">These values cannot be changed after creation.</p>

                                <label className="form-label fw-bold small text-uppercase">Application Name</label>
                                <select
                                    title="Application container"
                                    className="form-control form-control-sm zinput mb-3"
                                    style={{ width: "100%", cursor: "pointer" }}
                                    value={application}
                                    onChange={(e) => setApplication(e.target.value)}
                                >
                                    <option value="">Select Application</option>
                                    {
                                        optionData.applicationList.map(app => (
                                            <option key={app.value} value={app.value}>{app.label}</option>
                                        ))
                                    }

                                </select>


                                <label className="form-label fw-bold small text-uppercase">Table ID</label>
                                <input
                                    type="text"
                                    name="tableId"
                                    className="form-control form-control-sm zinput mb-3"
                                    value={tableId}
                                    onChange={(e) => setTableId(e.target.value)}
                                    placeholder="e.g., u_my_table"
                                />



                                <button className="btn btn-sm zbtn me-2" onClick={() => setAppAndTable(application, tableId)} >
                                    Save
                                </button>
                                {/* <button className="btn btn-sm zbtn-outline">
                                    Close
                                </button> */}
                            </div>
                        </div>

                    </div>

                )
            }

        </div>
    );

}

export default EyukaPage;