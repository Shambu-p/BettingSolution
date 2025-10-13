import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";
import CloseIcon from '@mui/icons-material/Close';
import ZThemeContext from "../../Contexts/ZThemeContext";

import { Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { isDesktop, isMobile } from "react-device-detect";
import ContrastIcon from '@mui/icons-material/Contrast';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import UserRoles from "../../Enums/UserRoles";
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

function WorkspaceTopNav(props: {allTabs: any[], selectTab: (id: string) => void, removeTab: (id: string) => void}) {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, authWaiting, removeCookie } = useContext(AuthContext);
    const { theme, setTheme, setUiSettings, uiSettings } = useContext(ZThemeContext);

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <div className="d-flex justify-content-start px-2 pt-1 top-nav align-items-center w-100" style={{ background: "rgba(125, 125, 125, 0.074)", overflow: "auto hidden" }}>
            {
                props.allTabs.map((tab: any) => (
                    <div 
                        className={`px-2 rounded-top-3 ms-3 ${tab.is_selected ? "zpanel" : "border"} d-flex justify-content-between align-items-center`}
                        style={{width: "200px", overflow: "hidden", cursor: "pointer"}}
                    >
                        <div 
                            className="py-2"
                            style={{color: "var(--text_color)", fontSize: "14px", textWrap: "nowrap", textOverflow: "ellipsis", width: "100%", overflow: "hidden"}}
                            onClick={() => {props.selectTab(tab.id)}}
                        >
                            {tab.title}
                        </div>
                        <button className="btn zbtn-outline py-0" style={{paddingLeft: "5px", paddingRight: "5px"}} onClick={() => {props.removeTab(tab.id)}}>
                            <CloseIcon className="" sx={{ fontSize: 14, transform: "translateY(-15%)" }} />
                        </button>
                    </div>
                ))
            }
            
            {/* <button className="btn zbtn-outline py-0 ms-2" style={{paddingLeft: "5px", paddingRight: "5px"}} onClick={() => {props.removeTab(tab.id)}}>
                <AddIcon className="" sx={{ fontSize: 20, transform: "translateY(-15%)" }} />
            </button> */}
        </div>
    );
}

export default WorkspaceTopNav;
