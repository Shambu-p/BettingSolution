import React, { useContext, useState } from "react";
import SideBarComponent from "../Components/NavBars/SideBar";
import { Outlet, useParams } from "react-router-dom";
import TopNav from "../Components/NavBars/TopNav";
import AlertContext from "../Contexts/AlertContext";
import { isMobile } from "react-device-detect";
import WorkspaceTopNav from "../Components/NavBars/WorkspaceTopNav";
import Dashboard from "../Views/Dashboard";
import WorkspaceTable from "./WorkspaceTable";
import WorkspaceForm from "./WorkspaceForm";
import Pages from "../Pages/Pages";
import RoutingRule from "./RoutingRule";

function OperationManagement() {

    const {menu} = useContext(AlertContext);

    const params = useParams();
    const [currentTab, setCurrentTab] = useState("dashboard")
    const [allTabs, setAllTabs] = useState<any[]>([
        {
            title: "Dashboard",
            id: "dashboard",
            is_selected: true,
            type: "",
            table: "",
            dashboard_id: "",
            rec_id: "",
            filter: "",
            link: ""
        },
        // {
        //     title: "Hello World",
        //     id: "user_list",
        //     is_selected: false,
        //     tab_id: "user_list",
        //     type: "list",
        //     table: "user",
        //     dashboard_id: "",
        //     rec_id: "",
        //     filter: "",
        //     pageNumber: "1",
        //     link: ""
        // },
        
    ]);

    const selectTab = (id: string) => {

        let found_tab = allTabs.find(tab => (tab.id == id));
        if(!found_tab) {
            console.log("tab not found");
            return;
        }

        setAllTabs(tabs => tabs.reduce((acc: any[], tab: any) => ([...acc, (tab.id == id ? {...found_tab, is_selected: true} : {...tab, is_selected: false})]), []));
        setCurrentTab(found_tab.id);

    }

    const updateTabData = (id: string, data: any) => {

        let found_tab = allTabs.find(tab => (tab.id == id));
        if(!found_tab) {
            console.log("tab not found for update");
            return;
        }

        // setAllTabs(tabs => ([...(tabs.filter(tb => (tb.id != id))), {...found_tab, ...data}]));
        setAllTabs(tabs => tabs.reduce((acc: any[], tab: any) => ([...acc, (tab.id == id ? {...found_tab, ...data} : tab)]), []));

    }

    const addTab = (data: any) => {
        let finalData = RoutingRule(params.workspace_id, data);
        let duplicate = allTabs.find(tab => (tab.id == finalData.id));
        if(duplicate) {
            console.log("same tab has already been opened!");
            selectTab(duplicate.id);
            return;
        }

        setAllTabs(tabs => ([...(tabs.map((tbs: any) => ({...tbs, is_selected: false}))), {...finalData, is_selected: true}]));
        setCurrentTab(finalData.id);
    }

    const removeTab = (id: string) => {
        if(allTabs.length > 1) {
            let first_tab = allTabs.filter(tab => (tab.id != id))[0];
            setAllTabs(tabs => ([{...first_tab, is_selected: true}, ...tabs.filter(tbs => (tbs.id != id && tbs.id != first_tab.id))]));
            setCurrentTab(first_tab.id);
        }
    }

    return !isMobile && (
        <div style={{display: "flex", flexDirection: "column", width: "100vw", height: "100vh", position: "relative"}}>
            <div className="w-100 border-bottom" style={{height: "max-content", overflow: "", zIndex: 10}}>
                <TopNav />
            </div>
            <div className="d-flex w-100" style={{height: "100%", overflow: "hidden auto", zIndex: 1}}>
                <div className="border-end" style={{width: (menu ? "17%" : "4.5%"), height: "100%", overflow: "hidden", position: "relative", transitionDuration: "0.4s"}}>
                    <SideBarComponent iconic={false} />
                </div>
                <div className="m-0" style={{background: "var(--main_bg)", display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden auto", position: "relative"}}>
                    <WorkspaceTopNav allTabs={allTabs} selectTab={selectTab} removeTab={removeTab} />
                    <div className="m-0" style={{width: "100%", height: "100%", overflow: "hidden auto", position: "relative"}}>
                        <div 
                            className="zpanel rounded-4 shadow-sm"
                            style={{
                                display: (currentTab == "dashboard" ? "block" : "none"),
                                width: "98.5%",
                                height: "100%",
                                overflow: "hidden auto",
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)"
                            }}
                        >
                            <div className="" style={{width: "100%", height: "100%", overflow: "hidden auto"}}>
                                <Dashboard
                                    isWorkspace={true}
                                    workspaceParams={{
                                        title: "Dashboard",
                                        id: "dashboard",
                                        is_selected: false,
                                        type: "",
                                        table: "",
                                        dashboard_id: "",
                                        rec_id: "",
                                        filter: "",
                                        pageNumber: "1",
                                        link: ""
                                    }}
                                    workspaceNavigation={addTab}
                                    updateWindowData={updateTabData}
                                />
                            </div>
                        </div>
                        {
                            allTabs.map(tab => {
                                if(tab.type == "list") {
                                    return (
                                        <div 
                                            key={tab.id}
                                            className="zpanel rounded-4 shadow-sm"
                                            style={{
                                                display: (currentTab == tab.id ? "block" : "none"),
                                                width: "98.5%",
                                                height: "100%",
                                                overflow: "hidden auto",
                                                position: "absolute",
                                                top: 0,
                                                left: "50%",
                                                transform: "translateX(-50%)"
                                            }}
                                        >
                                            <div className="" style={{width: "100%", height: "100%", overflow: "hidden auto"}}>
                                                <WorkspaceTable 
                                                    key={tab.id}
                                                    condition={{}}
                                                    formName={tab.table}
                                                    initialPageNumber={1}
                                                    updateWindowData={updateTabData}
                                                    workspaceNavigation={addTab}
                                                    isRelatedList={false}
                                                    workspaceParams={tab}
                                                />
                                            </div>
                                        </div>
                                    );
                                } else if(tab.type == "form") {
                                    return (
                                        <div 
                                            key={tab.id}
                                            className="zpanel rounded-4 shadow-sm"
                                            style={{
                                                display: (currentTab == tab.id ? "block" : "none"),
                                                width: "98.5%",
                                                height: "100%",
                                                overflow: "hidden auto",
                                                position: "absolute",
                                                top: 0,
                                                left: "50%",
                                                transform: "translateX(-50%)"
                                            }}
                                        >
                                            <div className="" style={{width: "100%", height: "100%", overflow: "hidden auto"}}>
                                                <WorkspaceForm 
                                                    updateWindowData={updateTabData}
                                                    workspaceNavigation={addTab}
                                                    workspaceParams={tab}
                                                />
                                            </div>
                                        </div>
                                    );
                                } else if(tab.type == "page") {
                                    return (
                                        <div 
                                            key={tab.id}
                                            className="zpanel rounded-4 shadow-sm"
                                            style={{
                                                display: (currentTab == tab.id ? "block" : "none"),
                                                width: "98.5%",
                                                height: "100%",
                                                overflow: "hidden auto",
                                                position: "absolute",
                                                top: 0,
                                                left: "50%",
                                                transform: "translateX(-50%)"
                                            }}
                                            >
                                            <div className="" style={{width: "100%", height: "100%", overflow: "hidden auto"}}>
                                                <Pages 
                                                    page={tab.dashboard_id}
                                                    parentType="workspace"
                                                    routeData={tab.data.routeData}
                                                    dataPassed={tab.data.dataPassed}
                                                    updateWindowData={updateTabData}
                                                    workspaceNavigation={addTab}
                                                    workspaceParams={tab}

                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationManagement;