import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import Utils from "../Models/Utils";


const SellListScreen = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const [sells, setSells] = useState<any[]>([]);
    const [localWaiting, setLocalWaiting] = useState(false);
    const [listType, setListType] = useState("all");

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

            let result;
            // if(searchParams.has("type") && searchParams.get("type") == "unpaid") {
            if(listType == "unpaid") {
                result = await MainAPI.getAll(cookies.login_token, "sell", 0, 0, {
                    status: {
                        type: FieldTypes.TEXT,
                        operator: Operators.NOT,
                        value: "paid"
                    },
                    remaining_price: {
                        type: FieldTypes.FLOAT,
                        operator: Operators.GREATER,
                        value: 0.01
                    },
                }, "reference");
            } else if(listType == "today") {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                result = await MainAPI.getAll(cookies.login_token, "sell", 0, 0, {
                    sold_date: {
                        type: FieldTypes.DATETIME,
                        operator: Operators.GREATER,
                        value: today.toISOString()
                    }
                }, "reference");
            } else {
                result = await MainAPI.getAll(cookies.login_token, "sell", 0, 0, {}, "reference");
            }
            setSells(result.Items);
            // setAlert(error.message, "error");

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="h-100" style={{overflow: "hidden auto"}}>
            <div className="mt-3 pb-1 px-3">
                {/* <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-search" style={{fontSize: '20px'}}></i>
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" placeholder="Search" />
                        <i className="bx bx-filter" style={{fontSize: '20px'}}></i>
                    </div>
                </div> */}
                {
                    <div className="category-tabs d-flex my-2">
                        <button className={`btn ${listType === "all" ? "zbtn" : "zbtn-outline"} btn-sm mx-1`} onClick={() => {setListType("all")}}> All Sells </button>
                        <button className={`btn ${listType === "today" ? "zbtn" : "zbtn-outline"} btn-sm mx-1`} onClick={() => {setListType("today")}}> Today </button>
                        <button className={`btn ${listType === "unpaid" ? "zbtn" : "zbtn-outline"} btn-sm mx-1`} onClick={() => {setListType("unpaid")}}> Unpaid </button>
                    </div>
                }
                {
                    sells.map((sell: any) => {
                        let found_choice = getDisplaySelect("sell.status", sell.status);
                        return (
                            <div className="card shadow-sm mb-3 border-0 zpanel" onClick={(event: any) => {navigate(`/mobile/create-sell/${sell.sys_id}`)}}>
                                <div className="card-body ms-3 flex-grow-1">
                                    <h6 className="mb-1">{sell.sellCustomer.name}</h6>
                                    <small className="" style={{color: "var(text_color) !important"}}>#{sell.sell_number}</small><br/>
                                    <small className="" style={{color: "var(text_color) !important"}}>{Utils.isoToReadableDateTime(sell.sold_date, localData.dateConfig)}</small>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0"><b className="fs-5">{(sell.paid_price + sell.remaining_price) != 0 ? Utils.formatPrice((sell.paid_price + sell.remaining_price), "ETB") : Utils.formatPrice(sell.total_price, "ETB")}</b></p>
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
            <button
                className="btn zbtn rounded-circle px-3 py-3 me-4 mb-5 shadow"
                style={{position: "absolute", bottom: 80, right: 0}}
                onClick={() => {navigate("/mobile/create-sell/-1")}}
            >
                <AddIcon sx={{fontSize: 25}} />
            </button>
        </div>
    );
};

export default SellListScreen;