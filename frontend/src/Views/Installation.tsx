import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";

import { useNavigate } from "react-router-dom";
import EastIcon from '@mui/icons-material/East';
import CancelIcon from '@mui/icons-material/Cancel';
import { Authorized, normal, props } from "../APIs/api";
import axios from "axios";
import DoneAllIcon from '@mui/icons-material/DoneAll';

function Installation() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const [balance, setBalance] = useState<Map<number, { tickets: any[], pay_in: number, pay_out: number }>>(new Map());

    const [localWaiting, setLocalWaiting] = useState(false);
    const [alertTitle, setAlertTitle] = useState("hi");
    const [inputs, setInputs] = useState<any>({
        database_name: "",
        user_name: "",
        password: ""
    });
    const [defaultUser, setDefaultUser] = useState<any>({
        first_name: "",
        last_name: "",
        phone: ""
    });

    const [installationStep, setInstallationStep] = useState<any>({
        "current": "introduction",
        "stapesCompleted": [],
        "stapesWaiting": [ "setup_db", "register_user"]
    });
    

    const navigate = useNavigate();

    useEffect(() => {
        loadState();
    }, []);

    const setLocalAlert = (title: string) => {
        setTimeout(() => {setLocalWaiting(true);}, 10);
        setAlertTitle(title);
    };

    const loadState = async () => {
        try {

            let result = await normal().bodyRequest("get", `system/get_install_state`);
            console.log("steps found ", result);
            setInstallationStep({...result, current: "introduction"});
        } catch(error: any) {
            setInstallationStep({
                "current": "introduction",
                "stapesCompleted": [],
                "stapesWaiting": [ "setup_db", "register_user"]
            });
        }
    }

    function delaySync(seconds: number) {
        const start = Date.now();
        while (Date.now() - start < seconds * 1000) {}
    }

    function delay(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    const initDatabase = async () => {

        try {

            setLocalAlert("Updating Database configuration...");
            await normal().bodyRequest("post", `system/change_db_name`, inputs);

            setLocalAlert("Reboot System...");
            await (axios.create({
                baseURL: `${props.controlBaseURL}/api`,
                headers: {}
            }).get("/hard_restart"));

            await delay(5);

            setLocalAlert("Updating Schema...");
            await normal().bodyRequest("get", `system/update_schema`);

            setLocalAlert("Migrating Schema...");
            await normal().bodyRequest("get", `system/migrate_schema`);

            setLocalAlert("Reboot System...");
            await (axios.create({
                baseURL: `${props.controlBaseURL}/api`,
                headers: {}
            }).get("/hard_restart"));

            await delay(5);

            setLocalAlert("Seed the Database...");
            await normal().bodyRequest("get", `system/seed_data`);

            if(installationStep.stapesWaiting[1]) {
                await updateStep(installationStep.stapesWaiting[1]);
            } else {
                await updateStep("all_completed");
            }



        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const createDefaultUser = async () => {

        try {

            setLocalAlert("Creating default user ...");
            await normal().bodyRequest("post", `system/register_admin`, defaultUser);

            if(installationStep.stapesWaiting[1]) {
                await updateStep(installationStep.stapesWaiting[1]);
            } else {
                await updateStep("all_completed");
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const updateStep = async (new_step: string) => {

        let StepState = {...installationStep};
        
        try {

            if(new_step != StepState.current && (StepState.stapesWaiting.includes(new_step) || new_step == "all_complete")) {
                StepState.current = new_step;
                StepState.stapesCompleted.push(installationStep.current);
                StepState.stapesWaiting = StepState.stapesWaiting.filter((stp: string) => (stp != installationStep.current));
                // if(new_step != "all_completed" && installationStep.current != "introduction") {
                await normal().bodyRequest("post", `system/update_install_state`, StepState);
                // }
                setInstallationStep(StepState);
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }

    }

    return (
        <div className="w-100 pt-3 d-flex align-items-center" style={{height: "100vh", width: "100vw", position: "relative"}}>

            <div className="col"></div>
            <div className="col-sm-12 col-md-9 col-lg-8">

                {
                    (installationStep.current == "introduction") && (
                        <div className="card rounded-3 shadow-sm slideLeft" >
                            <div className="card-body py-5" >
                                <div className="d-flex justify-content-center">
                                    <img src="/images/installation/setup_vector.webp" style={{width: "300px"}} alt="setting_icon" />
                                </div>
                                <h1 className="card-title text-center">Hello Dear, <br/> You are about to initiate the system</h1>
                                <p className="lead fs-6 text-center">
                                    This is only for system administrators and if you continue you will initiate the system agian and any data that has been collected will be lost!
                                </p>
                                <div className="d-flex justify-content-center  mb-5">
                                    <div className="col-9">
                                        <div className="form-check">
                                            <input id="is_db_setup" className="form-check-input" disabled type="checkbox" value="" checked={installationStep.stapesCompleted.includes("setup_db")} />
                                            <label for="is_db_setup" className="form-check-label">
                                                Setup Database Schema
                                            </label>
                                        </div>
                                        {/* <div className="form-check">
                                            <input className="form-check-input" disabled type="checkbox" value="" checked={installationStep.stapesCompleted.includes("setup_basic_data")} />
                                            <label className="form-check-label">
                                                Seed Database with initial records
                                            </label>
                                        </div> */}
                                        <div className="form-check">
                                            <input id="is_user_registered" className="form-check-input" disabled type="checkbox" value="" checked={installationStep.stapesCompleted.includes("register_user")} />
                                            <label for="is_user_registered" className="form-check-label">
                                                Register Default User (Optional)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between w-100 px-4">
                                    <button className="btn btn-danger" onClick={() => {navigate("/")}}>
                                        Cancel
                                        <CancelIcon sx={{fontSize: "18px", color: "white"}} className="ms-3" />
                                    </button>

                                    {
                                        (installationStep.stapesWaiting.length > 0) && (
                                            <button className="btn zbtn" onClick={() => {updateStep(installationStep.stapesWaiting[0])}}>
                                                Continue
                                                <EastIcon sx={{fontSize: "18px"}} className="ms-3" />
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    (installationStep.current == "setup_db") && (
                        <div className="card rounded-3 shadow-sm slideLeft">
                            <div className="card-body py-5">
                                <div className="d-flex justify-content-center">
                                    <img src="/images/installation/seeding_dbavif.avif" style={{width: "180px"}} alt="setting_icon" />
                                </div>
                                <h1 className="card-title text-center">Initialize Database Schema</h1>
                                <p className="lead fs-6 text-center mb-3">
                                    The database schema will be updated to the currently setted schema on ./prisma/schema.prisma file.
                                </p>
                                <div className="d-flex justify-content-center px-5 mb-5">
                                    <div className="col"></div>
                                    <div className="col-sm-12 col-md-9 col-lg-6">
                                        <input type="text" className="form-control zinput mb-3" onChange={(event: any) => {setInputs((inp: any) => ({...inp, database_name: event.target.value}))}} placeholder="Database name" />
                                        <input type="text" className="form-control zinput mb-3" onChange={(event: any) => {setInputs((inp: any) => ({...inp, user_name: event.target.value}))}} placeholder="Username" />
                                        <input type="text" className="form-control zinput" onChange={(event: any) => {setInputs((inp: any) => ({...inp, password: event.target.value}))}} placeholder="Password" />
                                    </div>
                                    <div className="col"></div>
                                </div>
                                <div className="d-flex justify-content-between w-100 px-4">
                                    <button className="btn btn-danger" onClick={() => {navigate("/")}}>
                                        <b>Cancel</b>
                                        <CancelIcon sx={{fontSize: "18px", color: "white"}} className="ms-3" />
                                    </button>
                                    <button className="btn btn-primary" onClick={initDatabase}>
                                        <b>Start Setup</b>
                                        <EastIcon sx={{fontSize: "18px"}} className="ms-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    (installationStep.current == "register_user") && (
                        <div className="card rounded-3 shadow-sm slideLeft">
                            <div className="card-body py-5">
                                <div className="d-flex justify-content-center">
                                    <img src="/images/installation/security_icon.webp" style={{width: "180px"}} alt="setting_icon" />
                                </div>
                                <h1 className="card-title text-center">Create System User</h1>
                                <p className="lead fs-6 text-center mb-3">
                                    This step is necessary to start the system if no user is registered in the database you cannot log into the system. password will be sent using the address you just entered bellow.
                                </p>
                                <div className="d-flex justify-content-center px-5 mb-5">
                                    <div className="col"></div>
                                    <div className="col-sm-12 col-md-9 col-lg-6">
                                        <input type="text" className="form-control zinput mb-3" value={defaultUser.first_name} onChange={(event: any) => {setDefaultUser((inp: any) => ({...inp, first_name: event.target.value}))}} placeholder="First Name" />
                                        <input type="text" className="form-control zinput mb-3" value={defaultUser.last_name} onChange={(event: any) => {setDefaultUser((inp: any) => ({...inp, last_name: event.target.value}))}} placeholder="Last Name" />
                                        <input type="text" className="form-control zinput mb-3" value={defaultUser.phone} onChange={(event: any) => {setDefaultUser((inp: any) => ({...inp, phone: event.target.value}))}} placeholder="Phone Number" />
                                    </div>
                                    <div className="col"></div>
                                </div>
                                <div className="d-flex justify-content-between w-100 px-4">
                                    <button className="btn btn-danger" onClick={() => {navigate("/")}}>
                                        <b>Cancel</b>
                                        <CancelIcon sx={{fontSize: "18px", color: "white"}} className="ms-3" />
                                    </button>
                                    <button className="btn btn-primary"  onClick={createDefaultUser}>
                                        <b>Create</b>
                                        <EastIcon sx={{fontSize: "18px"}} className="ms-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    (installationStep.current == "all_completed") && (
                        <div className="card rounded-3 shadow-sm slideLeft">
                            <div className="card-body py-5">
                                <div className="d-flex justify-content-center">
                                    {/* <img src="/images/installation/security_icon.webp" style={{width: "180px"}} alt="setting_icon" /> */}
                                    <DoneAllIcon sx={{fontSize: 150, color: "green"}} />
                                </div>
                                <h1 className="card-title text-center">Setup Done</h1>
                                <p className="lead fs-6 text-center mb-5">
                                    Go back to the login page and start using the system.
                                </p>
                                <div className="d-flex justify-content-center w-100 px-4">
                                    <button className="btn btn-primary" onClick={() => {navigate("/")}}>
                                        <b>OK, Thanks</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
            <div className="col"></div>

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

export default Installation;