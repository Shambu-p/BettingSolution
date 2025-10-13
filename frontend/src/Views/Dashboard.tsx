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
import UserRoles from "../Enums/UserRoles";

function Dashboard(props: {
	isWorkspace: boolean,
	workspaceParams?: {
        title: string,
        id: string,
        is_selected: boolean,
        type: string,
        table: string,
        dashboard_id: string,
        rec_id: string,
        filter: string,
        pageNumber: string,
        link: string
    },
    workspaceNavigation?: (data: any) => void,
    updateWindowData?: (id: string, data: any) => void
}) {

	const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
	const {loggedUser, cookies, localData} = useContext(AuthContext);
	const [balance, setBalance] = useState<Map<number, { tickets: any[], pay_in: number, pay_out: number }>>(new Map());
	const [isAdmin, setIsAdmin] = useState<boolean>(true);
	const [orders, setOrders] = useState<any[]>([]);
	const [chartData, setChartData] = useState<any>({});
	const [contacts, setContacts] = useState<any[]>([]);
	const [inputs, setInputs] = useState<any>({
		startDate: "",
		endDate: ""
	});

	const navigate = useNavigate();

	return (
		<div className={`w-100 pt-3 ${props.isWorkspace ? "" : "px-4"}`} style={{width: "100%", height: "max-content"}}>
			{/* <h3 className="card-title mb-3" style={{color: "var(--text_color)"}}>Dashboard</h3> */}

			<div className="card border-0 rounded-3 zpanel">
				<div className="card-body">

					{/* <div className="w-100 rounded-3" style={{background: "#EDEDED", height: "300px", overflow: "hidden", position: "relative"}}>
						<div className="h-100 w-100 d-flex justify-content-between align-items-center px-3" style={{background: "transparent", position: "absolute", top: 0}}>
							<img src="/images/production_dashboard_vector.png" alt="dahsboard_background" style={{width: "400px"}} />
							<span>
								<h5 className="card-title text-center" style={{color: "black", fontSize: "50px", fontWeight: "bolder", width: "500px"}}>Welcome to <br/> BYAE Business PLC</h5>
								<span></span>
							</span>
							<div className="h-100">
							</div>
						</div>
					</div> */}

					<div className="card border-0 mb-2 zpanel shadow-sm">
						<div className="card-body">
							<h6 className="card-title mb-0" style={{fontWeight: "bolder"}}>Main Dashboard</h6>
						</div>
					</div>

					<div className="d-flex w-100">

						<div className="col"></div>
						<div className="col-9">

							<div className="row p-0 m-0 mt-4">
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Sells, UserRoles.Admin, UserRoles.BranchManager]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => { 
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "sell_orders_list",
															type: "list",
															table: "transfer",
															pageNumber: "1"
														})
													} else {
														navigate("/list/transfer/1")
													}
												}}
											>
												<img src="/images/web-transfer.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Sell Orders</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Sells, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => { 
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "sell_list",
															type: "list",
															table: "sell",
															pageNumber: "1"
														})
													} else {
														navigate("/list/sell/1")
													}
												}}
											>
												<img src="/images/sell_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Sells</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => { 
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Sell Report",
															id: "store_report_page",
															type: "page",
															table: "",
															dashboard_id: "store-report",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														})
													} else {
														navigate("/store-report")
													}
												}}
											>
												<img src="/images/daily_sell_report.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Sell Report</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => { 
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "General Report",
															id: "general_report_page",
															type: "page",
															table: "",
															dashboard_id: "general-report",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														})
													} else {
														navigate("/general-report")
													}
												}}
											>
												<img src="/images/general_report.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>General Report</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Sells, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "customer_list",
															type: "list",
															table: "customer",
															pageNumber: "1"
														})
													} else {
														navigate("/list/customer/1")
													}
												}}
											>
												<img src="/images/CRM.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>CRM</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.ProductionManager, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "production_list",
															type: "list",
															table: "production",
															pageNumber: "1"
														})
													} else {
														navigate("/list/production/1")
													}
												}}
											>
												<img src="/images/production_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Production</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.ProductionManager, UserRoles.BranchManager, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "receive_product_list",
															type: "list",
															table: "receive_product",
															pageNumber: "1"
														})
													} else {
														navigate("/list/receive_product/1")
													}
												}}
											>
												<img src="/images/production_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>From Production to Store</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin]) && (
										<div 
											className="col-2 p-2 align-items-center mb-3"
											style={{display: "flex", flexDirection: "column"}}
										>
											<button
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "purchase_list",
															type: "list",
															table: "purchase",
															pageNumber: "1"
														})
													} else {
														navigate("/list/purchase/1")
													}
												}}
											>
												<img src="/images/purchase_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Purchase</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Sells, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "store_list",
															type: "list",
															table: "store",
															dashboard_id: "",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														});
													} else {
														navigate("/list/store/1")
													}
												}}
											>
												<img src="/images/store_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Store</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Store Manager Dashboard",
															id: "store_management_dashboard",
															type: "page",
															table: "",
															dashboard_id: "store-dashboard",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														});
													} else {
														navigate("/store-dashboard")
													}
												}}
											>
												<img src="/images/store_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Store Dashboard</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "service_list",
															type: "list",
															table: "service",
															pageNumber: "1"
														})
													} else {
														navigate("/list/services/1")
													}
												}}
											>
												<img src="/images/service_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Services</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager, UserRoles.Sells]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "issue_list",
															type: "list",
															table: "issue_ticket",
															pageNumber: "1"
														})
													} else {
														navigate("/list/issue_ticket/1")
													}
												}}
											>
												<img src="/images/service_desk_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Service Desk</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "product_list",
															type: "list",
															table: "product",
															pageNumber: "1"
														})
													} else {
														navigate("/list/product/1")
													}
												}}
											>
												<img src="/images/products_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Products</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "inventory_item_list",
															type: "list",
															table: "inventory_item",
															pageNumber: "1"
														})
													} else {
														navigate("/list/inventory_item/1")
													}
												}}
											>
												<img src="/images/raw_materials.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Row Materials</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "",
															id: "delivery",
															type: "list",
															table: "delivery",
															pageNumber: "1"
														})
													} else {
														navigate("/list/delivery/1")
													}
												}}
											>
												<img src="/images/delivery_icon.webp" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Delivery</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Finance Manager Dashboard",
															id: "finance_dashboard",
															type: "page",
															table: "",
															dashboard_id: "finance-dashboard",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														});
													} else {
														navigate("/finance-dashboard")
													}

												}}
											>
												<img src="/images/accounting_icon.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Accounting & Finance</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "user_list",
															type: "list",
															table: "user",
															pageNumber: "1"
														})
													} else {
														navigate("/list/user/1")
													}
												}}
											>
												<img src="/images/user_management.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>User & Roles</b></h6>
										</div>
									)
								}

								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button 
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "purchases_to_be_approved",
															type: "list",
															table: "purchase",
															filter: "",
															pageNumber: "1"
														})
													} else {
														navigate("/list/purchase/1")
													}
												}}
											>
												<img src="/images/purchase_approval.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Purchase Approval</b></h6>
										</div>
									)
								}

								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "production_approval_list",
															type: "list",
															table: "production",
															filter: "%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_production_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
															pageNumber: "1"
														})
													} else {
														navigate("/list/production/1?filter=%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_production_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D")
													}
												}}
											>
												<img src="/images/production_approval.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Production Approval</b></h6>
										</div>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Register Expense",
															id: "new_expense_form",
															type: "page",
															table: "",
															dashboard_id: "new-expense",
															filter: "",
															pageNumber: "1",
															data: {
																routeData: {},
																dataPassed: {}
															}
														});
													} else {
														navigate("/new-expense");
													}
												}}
											>
												<img src="/images/expense.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Add Expense</b></h6>
										</div>
									)
								}

								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && (
										<div className="col-2 p-2 align-items-center mb-3" style={{display: "flex", flexDirection: "column"}}>
											<button
												className="btn btn-sm zpanel align-items-center shadow p-3 mb-2 rounded-3 border-0"
												style={{width: "70%"}}
												onClick={() => {
													if(props.isWorkspace) {
														props.workspaceNavigation({
															title: "Loading...",
															id: "expense_transactions_list",
															type: "list",
															table: "transaction",
															filter: "",
															// filter: "%257B%2522category%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522other_expences%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
															pageNumber: "1"
														})
													} else {
														navigate("/list/transaction/1?filter=%257B%2522category%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522other_expences%2522%252C%2522type%2522%253A%2522select%2522%257D%257D")
													}
												}}
											>
												<img src="/images/expense.png" alt="link_icon" style={{width: "100%"}} />
											</button>
											<h6 className="card-title text-center" style={{color: "var(--text_color)"}}><b>Expenses</b></h6>
										</div>
									)
								}

							</div>
						</div>
						<div className="col">
							{/* <div className="card w-100 h-100">

							</div> */}
						</div>

					</div>

				</div>
			</div>

		</div>
	);
}

export default Dashboard;