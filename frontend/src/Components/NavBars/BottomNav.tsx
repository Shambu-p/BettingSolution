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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Menu, Inbox, Mail, Notifications, AccountCircle } from '@mui/icons-material';
import ZThemeContext from "../../Contexts/ZThemeContext";
import Utils from "../../Models/Utils";

const drawerWidth = 240;

function BottomNavComponent(props: {iconic?: boolean}) {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie } = useContext(AuthContext);
    const { setUiSettings, uiSettings } = useContext(ZThemeContext);

    const [navList, setNavList] = useState<INavigation[]>([]);
    const [openedContainer, setOpenedContainer] = useState<string>("");
  
    const location = useLocation();

    const navigate = useNavigate();
    useEffect(() => {
        loadData();
    }, [loggedUser]);

    const exitSideBar = () => {
        if(isMobile) {
            setMenu(false);
        }
    }

    const loadData = () => {
        let temp_navs: INavigation[] = [];
        SideBarNavigation.forEach(async nav => {
            // if(nav.active && nav.roles.includes(loggedUser.Roles[0]) && await nav.validator(loggedUser)) {
            //     temp_navs.push(nav);
            // }
            temp_navs.push(nav);
            
        });
        setNavList(temp_navs);
    }
    // const isActive = (navLink: string) => {
    //     return location.pathname == navLink; 
    //   };
    const isActive = (navLink: string) => {
        const currentPath = location.pathname;
        // window.location.pathname
    
        // const currentBase = currentPath.split("/");
        // const navBase = navLink.split("/")[2];
        return currentPath == navLink;
    };
    
    
    // const isActive = (navLink: string) => {
    //     const currentPath = location.pathname;
    //     const baseTable = navLink.split('/')[2]; 
    //     return location.pathname == navLink || currentPath.startsWith(`/list/${baseTable}`) || currentPath.startsWith(`/form/${baseTable}`);
    // };
    

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <div className="d-flex justify-content-around p-0"
            style={{
                boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)"
            }}
        >
            <button
                className="btn col justify-content-center align-items-center zbtn rounded-0"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    // color: "var(--text_color)"
                }}
                onClick={async () => {navigate("/mobile");}}
            >
                <i className="bx bx-home" style={{fontSize: "20px", display: "block"}}></i>
                <span style={{fontSize: "13px"}}>Home</span>
            </button>
            <button
                className="btn col justify-content-center align-items-center border-start border-end zbtn rounded-0"
                onClick={async () => {navigate("/mobile/store_items");}}
            >
                <i className="bx bx-category" style={{fontSize: "20px", display: "block"}}></i>
                <span style={{fontSize: "12px"}}>Product&Item</span>
            </button>
            <button
                className="btn col justify-content-center align-items-center border-end zbtn rounded-0"
                onClick={async () => {navigate("/mobile/sell_list");}}
            >
                <i className="bx bx-cart" style={{fontSize: "20px", display: "block"}}></i>
                <span style={{fontSize: "13px"}}>Sells</span>
            </button>
            <button
                className="btn col justify-content-center align-items-center zbtn rounded-0"
                onClick={async () => {navigate("/mobile/profile");}}
            >
                <i className="bx bx-user" style={{fontSize: "20px", display: "block"}}></i>
                <span style={{fontSize: "13px"}}>User</span>
            </button>
        </div>
    );
}

export default BottomNavComponent;