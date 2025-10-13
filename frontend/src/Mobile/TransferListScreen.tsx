import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import FieldTypes from "../Enums/FiedTypes";
import Utils from "../Models/Utils";


const TransferListScreen = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const [transfers, setTransfers] = useState<any[]>([]);
    const [localWaiting, setLocalWaiting] = useState(false);
    const [listType, setListType] = useState("all_order");
    

    useEffect(() => {
        loadData();
    }, [listType]);

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

            let result: any, condition: any = {};
            if(listType == "all_order") {
                let fromDate = (new Date());
                let toDate = (new Date());
                
                fromDate.setHours(0, 0, 0);
                
                toDate.setDate(toDate.getDate() + 1);
                toDate.setHours(0, 0, 0);

                condition = {
                    type: "order"
                };
            } else if(listType == "today_order") {
                let fromDate = (new Date());
                let toDate = (new Date());
                
                fromDate.setHours(0, 0, 0);
                toDate.setHours(23, 59, 59);

                condition = {
                    type: "order",
                    started_on: {
                        gte: fromDate.toISOString(),
                        lt: toDate.toISOString()
                    }
                };
            }
            else if(listType == "all_return") {
                let fromDate = (new Date());
                let toDate = (new Date());
                
                fromDate.setHours(0, 0, 0);
                
                toDate.setDate(toDate.getDate() + 1);
                toDate.setHours(0, 0, 0);

                condition = {
                    type: "return"
                };

            } else if(listType == "today_return") {

                let fromDate = (new Date());
                let toDate = (new Date());
                
                fromDate.setHours(0, 0, 0);
                toDate.setHours(23, 59, 59);

                condition = {
                    type: "return",
                    started_on: {
                        gte: fromDate.toISOString(),
                        lt: toDate.toISOString()
                    }
                };

            } else if(listType == "week_order") {

                let fromDate = (new Date());
                fromDate.setDate(fromDate.getDate() - ((fromDate.getDay() + 6) % 7));
                fromDate.setHours(0, 0, 0, 0);
                
                let toDate = (new Date());
                toDate.setDate(toDate.getDate() + (7 - toDate.getDay()) % 7);
                toDate.setHours(23, 59, 59, 999);

                condition = {
                    type: "order",
                    started_on: {
                        gte: fromDate.toISOString(),
                        lt: toDate.toISOString()
                    }
                };

            } else if(listType == "week_return") {

                let fromDate = (new Date());
                fromDate.setDate(fromDate.getDate() - ((fromDate.getDay() + 6) % 7));
                fromDate.setHours(0, 0, 0, 0);

                let toDate = (new Date());
                toDate.setDate(toDate.getDate() + (7 - toDate.getDay()) % 7);
                toDate.setHours(23, 59, 59, 999);

                condition = {
                    type: "return",
                    started_on: {
                        gte: fromDate.toISOString(),
                        lt: toDate.toISOString()
                    }
                };

            } else if(listType == "week_order") {

                let fromDate = (new Date());
                fromDate.setDate(fromDate.getDate() - ((fromDate.getDay() + 6) % 7));
                fromDate.setHours(0, 0, 0, 0);
                
                let toDate = (new Date());
                toDate.setDate(toDate.getDate() + (7 - toDate.getDay()) % 7);
                toDate.setHours(23, 59, 59, 999);

                condition = {
                    type: "order",
                    started_on: {
                        gte: fromDate.toISOString(),
                        lt: toDate.toISOString()
                    }
                };

            }

            result = await MainAPI.getReportData(cookies.login_token, "transfer", 0, 0, condition, {created_on: "desc"});

            setTransfers(result.Items);
            // setAlert(error.message, "error");

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="h-100" style={{overflow: "hidden auto"}}>
            <div className="mt-3 pb-1 px-3">
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        {/* <i className="bx bx-search" style={{fontSize: '20px'}}></i> */}
                        <i className="bx bx-filter" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" title="Filter" onChange={(event: any) => {setListType(event.target.value)}} value={listType} >
                            <option value="all_order">All Orders</option>
                            <option value="today_order">Today Orders</option>
                            <option value="week_order">This Week Orders</option>
                            <option value="all_return">All Returns</option>
                            <option value="today_return">Today Returns</option>
                            <option value="week_return">This Week Returns</option>
                        </select>
                    </div>
                </div>

                {
                    transfers.map((transfer: any) => {
                        let found_choice = getDisplaySelect("transfer.status", transfer.status);
                        return (
                            <div key={`transfer_request_${transfer.sys_id}`} className="card shadow-sm mb-3 border-0 zpanel" onClick={(event: any) => {navigate(`/mobile/transfer-form/${transfer.sys_id}`)}}>
                                <div className="card-body ms-3 flex-grow-1">
                                    <h6 className="mb-1">{transfer.fromStore.name} - {transfer.toStore.name} </h6>
                                    <b className="fs-5">#{transfer.transfer_number}</b>
                                    
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0"><small className="" style={{color: "var(text_color) !important"}}>{Utils.isoToReadableDateTime(transfer.finished_on ?? transfer.created_on, localData.dateConfig)}</small></p>
                                        <span 
                                            className="badge rounded-pill py-1 px-3"
                                            style={{background: found_choice.bgColor, color: found_choice.color, paddingTop: "5px !important", lineHeight: 1}}
                                        >
                                            {found_choice ? found_choice.label : "NULL"}
                                            
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }

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
            {/* <button
                className="btn zbtn rounded-circle px-3 py-3 me-4 mb-5 shadow"
                style={{position: "absolute", bottom: 80, right: 0}}
                onClick={() => {navigate("/mobile/transfer-form/-1")}}
            >
                <AddIcon sx={{fontSize: 25}} />
            </button> */}
        </div>
    );
};

export default TransferListScreen;