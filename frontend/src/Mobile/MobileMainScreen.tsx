import React, { useContext } from "react";
import SideBarComponent from "../Components/NavBars/SideBar";
import { Outlet } from "react-router-dom";
import TopNav from "../Components/NavBars/TopNav";
import AlertContext from "../Contexts/AlertContext";
import { isMobile } from "react-device-detect";
import BottomNavComponent from "../Components/NavBars/BottomNav";

function MobileMainScreen() {

    const {menu} = useContext(AlertContext);

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0}}>
            <div className="w-100 border-bottom" style={{height: "max-content", overflow: "", zIndex: 10}}>
                <TopNav />
            </div>
            <div className="w-100 m-0" style={{height: "100%", overflow: "hidden auto", zIndex: 1, background: "var(--main_bg)"}}>
                <Outlet />
            </div>
            <div className="border-top w-100" style={{ minHeight: "60px", height: "max-content", overflow: "hidden", position: "relative"}}>
                <BottomNavComponent />
            </div>
        </div>
    );
}

export default MobileMainScreen;