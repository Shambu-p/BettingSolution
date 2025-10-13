import React, { createContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Login, information } from "./APIs/AuthAPI";
import AuthContext from "./Contexts/AuthContext";
import AlertContext from "./Contexts/AlertContext";
import Alert from "./Components/Extra/Alert";
import Waiting from "./Components/Extra/Waiting";
import { useCookies } from "react-cookie";
import Error from "./Views/Error";
import LoginPage from "./Views/Login";
import SideBar from "./Components/NavBars/SideBar";
import Account from "./Views/Account";
import Dashboard from "./Views/Dashboard";
import CreateCompany from "./Views/CreateCompany";
import AuthResult from "./Intefaces/AuthResult";
import LocalData from "./Intefaces/LocalData";
import ResetAccount from "./Views/ResetAccount";
import TableComponent from "./Views/TableComponent";
import { isMobile } from "react-device-detect";
import MainScreen from "./Views/MainScreen";
import ZThemeContext from "./Contexts/ZThemeContext";
import UISettings from "./Components/Reusables/UISettings";
import SignupForm from "./Views/FirstAcount";
// import ChangeDefaultPasswordPage from "./Views/ChageDefaultPassword";
import MainAPI from "./APIs/MainAPI";
import { Authorized, normal } from "./APIs/api";
import SystemActions from "./Views/SystemActions";
import MobileHome from "./Mobile/MobileHome";
import MobileMainScreen from "./Mobile/MobileMainScreen";
import SplashScreen from "./Mobile/SpalshScreen";
import StoreItems from "./Mobile/StoreItems";
import SellListScreen from "./Mobile/SellListScreen";
import StoreReports from "./Mobile/StoreReports";
import TransactionList from "./Mobile/TransactionList";
import CustomersList from "./Mobile/CustomersList";
import CustomerForm from "./Mobile/CustomerForm";
import OperationManagement from "./Workspace/OperationManagement";
import Pages from "./Pages/Pages";
import TransferListScreen from "./Mobile/TransferListScreen";
import MainPopUp from "./Components/Extra/MainPopUp";
import DateSettings from "./Components/Reusables/DateSettings";
import Installation from "./Views/Installation";

// import FinanceDashboard from "./Views/FinanceDashboard";
// import StoreManagerDashboard from "./Views/StoreManagerDashboard";
// import SellForm from "./Mobile/SellForm";
// import CreateSell from "./Pages/CreateSell";
// import QueryBuilder from "./Components/Reusables/QueryBuilder";

function App(params: any) {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<null | AuthResult>(null);
    const [cookies, setCookie, removeCookie] = useCookies(["login_token"]);
    const [authWaiting, setAuthWaiting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showWaiting, setWaiting] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
    const [alertMessage, setMessage] = useState<string>("");
    const [menu, setMenu] = useState<boolean>(false);
    const [uiSettings, setUiSettings] = useState<boolean>(false);
    const [showDateSettingPanel, setShowDateSettingPanel] = useState<boolean>(false);
    const [popup, setPopUp] = useState<boolean>(false);
    const [popupParamData, setPopUpParamData] = useState<any>({});
    const [theme, setTheme] = useState<any>({
        scheme: "zlight",
        button_color: "white",
        button_bg: "blue",
        button_bg_hover: "darkblue",
        ring_color: "lightblue"
    });
    const [localData, setLocalData] = useState<LocalData>({
        Choices: [],
        Users: [],
        ReportConfig: {},
        dateConfig: {
            type: "ethiopian", // Default date configuration
            format: "dd/mm/yyyy", // Default date format
            separater: "-" // Default date separator
        }
    });

    const [forms, setForms] = useState<any[]>([]);

    // const location = useLocation();
    // const navigate = useNavigate();

    useEffect(() => {

        const checkAuth = async (token: string) => {

            setTimeout(() => { setAuthWaiting(true); }, 1);
            setTimeout(() => { setWaiting(true); }, 1);
            let response = await information(token);
            // let response = window.localStorage.getItem("loggedUser");
            setLoggedIn(response.status);
            setLoggedUser(response.data);
            await loadLocalData();
            setTimeout(() => { setAuthWaiting(false); }, 5);
            setTimeout(() => { setWaiting(false); }, 5);

        };

        let origin = window.location.origin;

        if (cookies.login_token && cookies.login_token != "") {
            checkAuth(cookies.login_token);
            // connectWithServer();
            if(isMobile && ["/", ""].includes(window.location.pathname)){
                window.location.assign(`${origin}/mobile_app`);
            }

        } else {
            if(!["/", "", "/install"].includes(window.location.pathname)) {
                window.location.assign(origin);
            }
        }

        let found_theme = window.localStorage.getItem("theme");
        if (found_theme) {
            changeTheme(JSON.parse(found_theme));
        }

    }, []);

    const setAlert = (
        message: string,
        type: "success" | "error" | "warning" | "info"
    ) => {

        setAlertType(type);
        setShowAlert(true);
        setMessage(message);

        setTimeout(() => {
            setShowAlert(false);
        }, 6000);

    }

    const openPopup = (
        data: any,
        component?: any
    ) => {

        setPopUpParamData({
            component: component,
            data
        });
        setPopUp(true);

    }

    const loadLocalData = async (token?: string) => {

        if(!token) {
            token = cookies.login_token;
        }

        let temp_data = localData;
        setForms(await normal().bodyRequest("get", "/system/base_data"));
        // temp_data.Choices = (await MainAPI.getAll(cookies.login_token, "choice", 1, 1000, {})).Items;
        temp_data.Users = (await MainAPI.getAll(token ?? cookies.login_token, "user", 1, 1000, {})).Items.map((usr: any) => ({ value: usr.sys_id, label: `${usr.first_name} ${usr.last_name}` }));
        temp_data.Choices = (await MainAPI.getAll(token ?? cookies.login_token, "choice", 1, 0, {})).Items;
        temp_data.ReportConfig = await MainAPI.getReportConfigs(token ?? cookies.login_token);

        let found_date_setting = window.localStorage.getItem("dateConfig");
        if (found_date_setting) {
            temp_data.dateConfig = JSON.parse(found_date_setting);
        }

        setLocalData(temp_data);

    }

    const changeTheme = (value: any) => {

        setTheme(value);
        let element: any = document.getElementById("root");
        if (element) {
            element.className = `accents ${value.scheme}`;
            element.style.setProperty("--button_bg", value.button_bg);
            element.style.setProperty("--button_color", value.button_color);
            element.style.setProperty("--button_bg_hover", value.button_bg_hover);
            element.style.setProperty("--input-ring-color", value.ring_color);
        }
        window.localStorage.setItem("theme", JSON.stringify(value));

    }

    const onLogin = async (signinUser: any) => {

        // window.localStorage.setItem("loggedUser", JSON.stringify(signinUser));
        await loadLocalData(signinUser.Token);

    }

    const changeDateConfig = (config: any) => {
        setLocalData((prev: LocalData) => ({
            ...prev,
            dateConfig: config
        }));
        window.localStorage.setItem("dateConfig", JSON.stringify(config));
    }


    return (
        <ZThemeContext.Provider value={{ theme, setTheme: changeTheme, setUiSettings, uiSettings }}>
            <AlertContext.Provider value={{ showAlert, alertMessage, alertType, setAlertType, setAlert, setWaiting, showWaiting, menu, setMenu, openPopup, popup, setPopUp, setShowDateSettingPanel, showDateSettingPanel }}>
                <AuthContext.Provider value={{
                    isLoggedIn, loggedUser, setLoggedUser, setLoggedIn, setCookie, cookies, removeCookie, authWaiting, localData, onLogin, forms, changeDateConfig
                }}>
                    <BrowserRouter>
                        {
                            !authWaiting && (
                                !isLoggedIn ? (
                                    <Routes>
                                        <Route path="/" element={<LoginPage />} />
                                        <Route path="/reset" element={<ResetAccount />} />
                                        <Route path="/install" element={<Installation />} />
                                        <Route path="*" element={<Error />} />
                                    </Routes>
                                ) : (
                                    <Routes>
                                        <Route path="/" element={<MainScreen />} >
                                            <Route path="list/:name/:pageNumber" element={<TableComponent />} />
                                            <Route path="form/:name/:r_id" element={<CreateCompany />} />
                                            <Route path="profile" element={<Account />} />
                                            <Route path="system/actions" element={<SystemActions />} />
                                            <Route path="" element={<Dashboard isWorkspace={false} />} />
                                            {/* <Route path="/finance" element={<FinanceDashboard />} /> */}
                                            {/* <Route path="/store_manager" element={<StoreManagerDashboard />} /> */}
                                            <Route path="/create-sell/:id" element={<Pages page={"create-sell"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/transfer-form/:id" element={<Pages page={"transfer-form"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/create-purchase/:id" element={<Pages page={"create-purchase"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/production-form/:id" element={<Pages page={"production-form"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/finance-dashboard" element={<Pages page={"finance-dashboard"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/store-dashboard" element={<Pages page={"store-dashboard"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/store-report" element={<Pages page={"store-report"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/receive-slip/:id" element={<Pages page={"receive-slip"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/issue-form/:id" element={<Pages page={"issue-form"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/new-expense" element={<Pages page={"new-expense"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/general-report" element={<Pages page={"general-report"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/api-designer/:id" element={<Pages page={"api-designer"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/flow-designer/:id" element={<Pages page={"flow-designer"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/flow-builder/:id" element={<Pages page={"flow-builder"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/test-flow/:id" element={<Pages page={"test-flow"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="/process-detail/:id" element={<Pages page={"process-detail"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="page-builder/:id" element={<Pages page={"page-builder"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            
                                            {/* Desktop Route Mapping */}
		<Route path="adc1aaa7-debf-4157-b454-8850412d5cad" element={<Pages page={"adc1aaa7-debf-4157-b454-8850412d5cad"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
		<Route path="b8b8ce04-4e2b-469b-92f9-57b270ff6744/:name" element={<Pages page={"b8b8ce04-4e2b-469b-92f9-57b270ff6744"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
		<Route path="c4cc9893-fd5a-4070-8960-bf37ccb34cd1" element={<Pages page={"c4cc9893-fd5a-4070-8960-bf37ccb34cd1"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
		<Route path="df172af0-2c69-4ccb-807d-591087b74d4b" element={<Pages page={"df172af0-2c69-4ccb-807d-591087b74d4b"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
		<Route path="a6c6c485-5688-45c8-9fc0-dbc804133494" element={<Pages page={"a6c6c485-5688-45c8-9fc0-dbc804133494"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
{/* Desktop Route Mapping */}
                                            <Route path="*" element={<Error />} />
                                        </Route>
                                        <Route path="/workspace/:workspace_id" element={<OperationManagement />} >
                                        </Route>


                                        <Route path="/mobile_app" element={<SplashScreen />} />
                                        <Route path="/mobile" element={<MobileMainScreen />} >

                                            <Route path="" element={<MobileHome />} />
                                            <Route path="store_items" element={<StoreItems />} />
                                            <Route path="sell_list" element={<SellListScreen />} />
                                            <Route path="transfer_list" element={<TransferListScreen />} />
                                            <Route path="profile" element={<Account />} />
                                            <Route path="reports" element={<StoreReports />} />
                                            <Route path="transactions" element={<TransactionList />} />
                                            <Route path="customers" element={<CustomersList />} />
                                            <Route path="customer_form/:id" element={<CustomerForm />} />
                                            {/* <Route path="sell_form/:id" element={<SellForm />} /> */}
                                            <Route path="transfer-form/:id" element={<Pages page={"transfer-form"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />
                                            <Route path="create-sell/:id" element={<Pages page={"create-sell"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />

                                            {/* Mobile Route Mapping */}

{/* Mobile Route Mapping */}

                                        </Route>

                                    </Routes>
                                )
                            )
                        }
                        {showAlert ? (<Alert message={alertMessage} color={alertType} />) : ""}
                        {/* <div className="waiting-container d-flex justify-content-center" style={{zIndex: 100}}>
                            <QueryBuilder initialCondition={[]} onQueryChange={() => {}} tableName={"transfer"} />
                        </div> */}
                        {showWaiting ? (<Waiting />) : ""}
                        {(menu && isMobile) ? (
                            <div className="sidebar-overlay" onClick={() => { setTimeout(() => { setMenu(false) }, 50) }}>
                                <SideBar />
                            </div>
                        ) : ""}
                        {(uiSettings) ? (<UISettings />) : ""}
                        {(showDateSettingPanel) ? (<DateSettings />) : ""}
                        {(popup) ? (<MainPopUp paramData={popupParamData.data} component={popupParamData.component} />) : ""}
                    </BrowserRouter>
                </AuthContext.Provider>
            </AlertContext.Provider>
        </ZThemeContext.Provider>
    );

}

export default App;