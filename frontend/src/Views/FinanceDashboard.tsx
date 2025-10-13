import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import { IconButton } from "@mui/material";
import { Menu, PlayArrow } from "@mui/icons-material";
import Chart from 'chart.js/auto';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AlertContext from "../Contexts/AlertContext";
import MainAPI from "../APIs/MainAPI";
import Operators from "../Enums/Operators";
import FieldTypes from "../Enums/FiedTypes";

import { useNavigate } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ListComponent from "./ListComponent";
import TablePage from "./TablePage";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminAPI from "../APIs/AdminAPI";
import IPagination from "../Intefaces/IPagination";
import DynamicReport from "../Components/Reusables/DaynamicReport";
import TradingViewChart from "../Components/Reusables/TradingViewChart";

function FinanceDashboard(props: any) {

    let todayDate = (new Date());
    let tomorrowDate = (new Date());
    todayDate.setHours(0, 0, 0);
    tomorrowDate.setHours(0, 0, 0);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return (
        <div className="w-100 pt-3 px-4" style={{width: "100%", height: "max-content"}}>
            {/* <h3 className="card-title mb-3" style={{color: "var(--text_color)"}}>Dashboard</h3> */}

            <div className="card border-0 mb-2 zpanel">
                <div className="card-body">
                    <h6 className="card-title mb-0" style={{fontWeight: "bolder"}}>Accountant Dashboard</h6>
                </div>
            </div>


            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body d-flex justify-content-center">
                    <div className="col-sm-12 col-md-9 col-lg-7" style={{ height: "400px", overflow: "auto hidden"}}>
                        <DynamicReport configName="accounts_status" inputParams={{}} />
                    </div>
                </div>
            </div>

            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body d-flex">
                    <div className="col-sm-12 col-md-6 me-1" style={{ height: "300px", overflow: "auto"}}>
                        <DynamicReport configName="overdue_services" inputParams={{todayDate: todayDate.toISOString()}} />
                    </div>
                    <div className="col-sm-12 col-md-6 ms-1" style={{ height: "300px", overflow: "auto"}}>
                        <DynamicReport configName="unpaid_purchases" inputParams={{}} />
                    </div>

                </div>
            </div>

            <div className="d-flex w-100 py-4 mb-4" style={{background: "#D4EAFF"}}>

                <div className="col"></div>
                <div className="col-9">

                    <div className="row p-0 m-0">
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        title: "",
                                        id: "account_list",
                                        type: "list",
                                        table: "account",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/accounting_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Accounts</b></h6>
                        </div>
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        title: "",
                                        id: "transaction_list",
                                        type: "list",
                                        table: "transaction",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/accounting_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Transactions</b></h6>
                        </div>

                    </div>
                </div>
                <div className="col">
                </div>

            </div>

            <div className="d-flex justify-content-between mb-3" style={{flexWrap: "wrap"}}>

                <div className="col-sm-12 col-md-6 col-lg-6 px-2 mb-2">
                    <div className='zpanel rounded-2 shadow-sm p-1 d-flex justify-content-center w-100' style={{ height: "400px" }}>
                        <DynamicReport configName="products_by_store" inputParams={{}} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 px-2 mb-2">
                    <div className='zpanel rounded-2 shadow-sm p-1 d-flex justify-content-center w-100' style={{ height: "400px" }}>
                        <DynamicReport configName="report1" inputParams={{}} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 px-2 mb-2">
                    <div className='zpanel rounded-2 shadow-sm p-1 d-flex justify-content-center w-100' style={{ height: "400px" }}>
                        <DynamicReport configName="report5" inputParams={{}} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 px-2 mb-2">
                    <div className='zpanel rounded-2 shadow-sm p-1 d-flex justify-content-center w-100' style={{ height: "400px" }}>
                        <DynamicReport configName="report2" inputParams={{}} />
                    </div>
                </div>

            </div>

            {/* <div className="d-flex justify-content-between mb-3" style={{flexWrap: "wrap"}}>
                <div className="col-sm-12 col-md-2 col-lg-3 px-2">
                    <div className="card rounded-3 zpanel" style={{width: "100%"}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div className="">
                                    <h6 className="text-muted" style={{color: "var(--border_color) !important"}}>Net Income</h6>
                                    <h4 className="card-title">15,065ETB</h4>
                                </div>
                                <span>
                                    <div className="rounded-4 p-2" style={{background: "#FF8F6654", color: "#FF9066", overflow: "hidden"}}>
                                        <HistoryIcon sx={{fontSize: 30}} />
                                    </div>
                                </span>
                            </div>
                            <span className="text-muted" style={{fontSize: "13px", color: "var(--border_color) !important"}}>Up from yesterday</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body">
                    <div className="w-100" style={{ minHeight: "200px", overflow: "auto hidden"}}>
                        <DynamicReport configName="today_transaction" inputParams={{
                            todayDate: todayDate.toISOString(),
                            tomorrowDate: tomorrowDate.toISOString()
                        }} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FinanceDashboard;