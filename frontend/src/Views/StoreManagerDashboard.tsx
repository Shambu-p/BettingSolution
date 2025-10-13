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

function StoreManagerDashboard(props: any) {

    return (
        <div className="w-100 pt-3 px-4" style={{width: "100%", height: "max-content"}}>
            {/* <h3 className="card-title mb-3" style={{color: "var(--text_color)"}}>Dashboard</h3> */}

            {/* <div className="w-100 rounded-3 mb-3 shadow-sm" style={{background: "#EDEDED", height: "300px", overflow: "hidden", position: "relative"}}>
                <div className="h-100 w-100 d-flex justify-content-between align-items-center px-3" style={{background: "transparent", position: "absolute", top: 0}}>
                    <img src="/images/finance_dashboard_hero.png" alt="dahsboard_background" style={{width: "400px"}} />
                    <span>
                        <h5 className="card-title text-center" style={{color: "black", fontSize: "50px", fontWeight: "bolder", width: "500px"}}>
                            Store Managers Dashboard
                        </h5>
                        <span></span>
                    </span>
                    <div className="h-100">
                    </div>
                </div>
            </div> */}

            <div className="card border-0 mb-2 zpanel shadow-sm">
                <div className="card-body">
                    <h6 className="card-title mb-0" style={{fontWeight: "bolder"}}>Store Managers Dashboard</h6>
                </div>
            </div>

            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body d-flex justify-content-center">
                    <div className="col-sm-12 col-md-6" style={{ height: "400px", overflow: "auto hidden"}}>
                        <DynamicReport configName="store_products" inputParams={{}} />
                    </div>
                    <div className="col-sm-12 col-md-6" style={{ height: "400px", overflow: "auto hidden"}}>
                        <DynamicReport configName="materials_in_store" inputParams={{}} />
                    </div>
                </div>
            </div>

            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body d-flex">
                    <div className="col-sm-12 col-md-6" style={{ height: "300px", overflow: "auto"}}>
                        <DynamicReport configName="waiting_purchases" inputParams={{}} />
                    </div>
                    <div className="col-sm-12 col-md-6" style={{ height: "300px", overflow: "auto"}}>
                        <DynamicReport configName="waiting_production" inputParams={{}} />
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
                                        routeAddress: "/list/store/1",
                                        title: "...Loading",
                                        id: "stores_list",
                                        type: "list",
                                        table: "store",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/store_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Go to Store</b></h6>
                        </div>
                        {/* <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/purchase/1",
                                        title: "...Loading",
                                        id: "purchase_list",
                                        type: "list",
                                        table: "purchase",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/purchase_approval.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Purchase Approval</b></h6>
                        </div>
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/production/1?filter=%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_production_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
                                        title: "...Loading",
                                        id: "production_list",
                                        type: "list",
                                        table: "production",
                                        pageNumber: "1",
                                        filter: "%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_production_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
                                    });
                                }}
                            >
                                <img src="/images/production_approval.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Production Approval</b></h6>
                        </div>
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/product/1",
                                        title: "...Loading",
                                        id: "product_list",
                                        type: "list",
                                        table: "product",
                                        pageNumber: "1",
                                    });
                                }}
                            >
                                <img src="/images/products_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Products</b></h6>
                        </div>
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/inventory_item/1",
                                        title: "...Loading",
                                        id: "inventory_item_list",
                                        type: "list",
                                        table: "inventory_item",
                                        pageNumber: "1",
                                    });
                                }}
                            >
                                <img src="/images/raw_materials.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Row Materials</b></h6>
                        </div>
                        <div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <button 
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/production/1",
                                        title: "...Loading",
                                        id: "production_list",
                                        type: "list",
                                        table: "production",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/production_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Production</b></h6>
                        </div>
                        <div 
                            className="col-2 p-2 align-items-center mb-3"
                            style={{display: "flex", flexDirection: "column"}}
                        >
                            <button
                                className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
                                style={{width: "70%"}}
                                onClick={() => {
                                    props.mainNavigation({
                                        routeAddress: "/list/purchase/1",
                                        title: "...Loading",
                                        id: "purchase_list",
                                        type: "list",
                                        table: "purchase",
                                        pageNumber: "1"
                                    });
                                }}
                            >
                                <img src="/images/purchase_icon.png" alt="link_icon" style={{width: "100%"}} />
                            </button>
                            <h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Purchase</b></h6>
                        </div> */}

                    </div>
                </div>
                <div className="col">
                </div>

            </div>

            <div className="card border-0 rounded-3 zpanel mb-3">
                <div className="card-body">
                    <div className="w-100" style={{ minHeight: "200px", overflow: "auto hidden"}}>
                        <DynamicReport configName="items_below_level" inputParams={{}} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default StoreManagerDashboard;