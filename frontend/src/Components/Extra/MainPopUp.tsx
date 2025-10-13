import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colors, IconButton } from "@mui/material";
import { isMobile } from "react-device-detect";
import AlertContext from "../../Contexts/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import INavigation from "../../Intefaces/INavigation";
import SideBarNavigation from "../../Views/SideBarNavigation";
import AuthContext from "../../Contexts/AuthContext";
import NavigationTypes from "../../Enums/NavigationTypes";
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation,  } from 'react-router-dom';
import ContrastIcon from '@mui/icons-material/Contrast';



import { Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Menu, Inbox, Mail, Notifications, AccountCircle } from '@mui/icons-material';
import ZThemeContext from "../../Contexts/ZThemeContext";

function MainPopUp({paramData, component}: {paramData: any, component?: any}) {

    const { popup, setPopUp } = useContext(AlertContext);

    useEffect(() => {
    }, []);


    return (
        <div className="sidebar-overlay">
            <div className="d-flex w-100 h-100">
                <div className="py-2 px-3 shadow-sm zpanel rounded-3 mx-auto my-5" style={{ display: "flex", flexDirection: "column", width: isMobile ? "70%" : "60%",  zIndex: 1 }}>

                    <div className="d-flex w-100 py-1 justify-content-end border-bottom">
                        <button className="btn btn-sm btn-danger" onClick={() => { setPopUp(false) }} > Close </button>
                    </div>
                    {/* <img src={paramData.src} alt="issue desc" style={{width: "100%"}} />*/}
                    <div className="w-100 h-100" style={{overflow: 'hidden auto'}}>
                        {
                            component ?? JSON.stringify(paramData)
                        }
                    </div>

                </div>

            </div>
            {/* <div className="w-100 h-100" style={{zIndex: -1, position: "absolute", top: 0, left: 0}} onClick={() => { setTimeout(() => { setUiSettings(false) }, 50) }}></div> */}
        </div>
    );
}

export default MainPopUp;