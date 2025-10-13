import React, { useContext, useEffect, useState } from "react";
import UserRoles from "../Enums/UserRoles"; 
import AuthContext from "../Contexts/AuthContext";
import AdminAPI from "../APIs/AdminAPI";
import AlertContext from "../Contexts/AlertContext";
import axios from "axios";
import { Authorized, props } from "../APIs/api";

function SystemActions() {
    const {cookies, localData} = useContext(AuthContext);
    const {setAlert} = useContext(AlertContext);

    const [localWaiting, setLocalWaiting] = useState(false);
    const [alertTitle, setAlertTitle] = useState("hi");
    const [actionName, setActionName] = useState("");
    const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const schemaReload = async () => {
        setLocalAlert("Generating Schema");
        try {
            let response = await Authorized(cookies.login_token).bodyRequest("get", "system/sync_db");
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };

    const updateSchema = async () => {
        setLocalAlert("Updating Schema");
        try {
            let response = await Authorized(cookies.login_token).bodyRequest("get", "system/update_schema");
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };

    const migrateSchema = async () => {
        setLocalAlert("Migrate Schema");
        try {
            let response = await Authorized(cookies.login_token).bodyRequest("get", "system/migrate_schema");
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };


    const reboot = async () => {
        setLocalAlert("restarting server...");
        try {
            let response = await (axios.create({
                // baseURL: "http://144.172.79.96:1515/api",
                baseURL: props.controlURL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.login_token}`
                }
            }).get("/restart"));
        } catch(error: any) {
            setAlert(error.response.data ? error.response.data.message : error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };

    const restoreBackup = async () => {
        setLocalAlert("Restoring Buckup Data...");
        try {
            try {
                let response = await Authorized(cookies.login_token).bodyRequest("get", "system/restore_backup");
            } catch(error: any) {
                setAlert(error.message, "error");
            }
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };

    const backupData = async () => {
        setLocalAlert("Buckup All Data...");
        try {
            try {
                let response = await Authorized(cookies.login_token).bodyRequest("get", "system/backup_data");
            } catch(error: any) {
                setAlert(error.message, "error");
            }
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    };

    // const stopServer = async () => {
    //     setLocalAlert("Stopping server");
    //     try {
    //         let response = await (axios.create({
    //             baseURL: "http://localhost:1515/api",
    //             headers: {}
    //         }).get("/restart"));
    //     } catch(error: any) {
    //         setAlert(error.message, "error");
    //     }
    //     setTimeout(() => {setLocalWaiting(false);}, 10);
    // };

    const setLocalAlert = (title: string) => {
        setTimeout(() => {setLocalWaiting(true);}, 10);
        setAlertTitle(title);
    };

    const handleAction = (action: () => void, name: string) => {
        setActionName("");
        setAlertTitle(name);
        setPendingAction(() => action);
        setShowConfirm(true);
        setShowModal(true);
    };

    const confirmAction = () => {
        if (pendingAction && actionName.trim().toLowerCase() === alertTitle.trim().toLowerCase()) {
            pendingAction();
            setShowConfirm(false);
            setShowModal(false);
        } else {
            setAlert("Action name does not match!", "error");
        }
    };

    // Card click handler
    const cardActions = [
        {
            name: "System Reboot",
            color: "#0d6efd",
            icon: "bi-arrow-repeat",
            bg: "bg-primary text-white",
            action: reboot,
            image: "/images/reboot.webp" // Place your icon image in public/images/
        },
        {
            name: "Schema Reload",
            color: "#0dcaf0",
            icon: "bi-diagram-3",
            bg: "bg-info text-white",
            action: schemaReload,
            image: "/images/database-sync.svg"
        },
        {
            name: "Update Schema",
            color: "#0dcaf0",
            icon: "bi-diagram-3",
            bg: "bg-info text-white",
            action: updateSchema,
            image: "/images/database-sync.svg"
        },
        {
            name: "Migrate Schema",
            color: "#0dcaf0",
            icon: "bi-diagram-3",
            bg: "bg-info text-white",
            action: migrateSchema,
            image: "/images/database-sync.svg"
        },
        {
            name: "Restore Backup",
            color: "#ffc107",
            icon: "bi-arrow-counterclockwise",
            bg: "bg-warning text-white",
            action: restoreBackup,
            image: "/images/restore.png"
        },
        {
            name: "Backup Data",
            color: "#198754",
            icon: "bi-cloud-arrow-down",
            bg: "bg-success text-white",
            action: backupData,
            image: "/images/backup.png"
        }
    ];

    return (
        <div className="container-fluid zpanel" style={{background: '#f4f6f9', minHeight: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{minHeight: '100vh'}}>
                <div className="col-lg-8 mx-auto">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-primary fs-3 mb-3">System Actions</h2>
                        <p className="fs-5" style={{color: "var(--text_color)"}}>Manage and maintain your system with the available actions below. Please confirm each action before proceeding.</p>
                    </div>
                    <div className="row w-100 justify-content-center">
                        {cardActions.map((item, idx) => (
                            <div key={item.name} className={`col-md-4 col-sm-6 d-flex align-items-center justify-content-center mb-3`}>
                                <div
                                    className={`card text-center shadow-sm border-0 rounded-4 py-4 w-100 h-100 d-flex flex-column justify-content-between ${item.bg} card-action-hover`}
                                    style={{cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.08)'}}
                                    onClick={() => handleAction(item.action, item.name)}
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <img src={item.image} alt={item.name + ' icon'} style={{width: '48px', height: '48px', marginBottom: '1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                                        <h6 className="mt-3 mb-2 fw-bold text-center">{item.name}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Modal for confirmation */}
                    {showModal && (
                        <div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.3)'}} tabIndex={-1}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content rounded-4  zpanel">
                                    <div className="modal-header border-0" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                                        <h5 className="modal-title text-primary">Confirm Action</h5>
                                        <button type="button" className="btn-close" onClick={() => {setShowModal(false); setShowConfirm(false);}}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p className="mb-2">Please type the action name (<b>{alertTitle}</b>) to confirm:</p>
                                        <input type="text" className="form-control mb-2 zinput" value={actionName} onChange={e => setActionName(e.target.value)} placeholder="Enter action name..." />
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button className="btn btn-danger me-2" onClick={confirmAction}>Confirm</button>
                                        <button className="btn btn-secondary" onClick={() => {setShowModal(false); setShowConfirm(false);}}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded" style={{width: "18rem", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)"}}>
                            <div className="card-header px-3 py-1" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                                {alertTitle}
                            </div>
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
}

export default SystemActions;
