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
import MainAPI from "../../APIs/MainAPI";

const drawerWidth = 240;

function SideBarComponent(props: {iconic?: boolean}) {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie, cookies } = useContext(AuthContext);
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

    const loadData = async () => {
        let temp_navs: any[] = [];

        try {

            let result = await MainAPI.getAllv2(cookies.login_token, "system_nav", 0, 0, {}, { order: "asc" });

        } catch (error) {
            console.log("Error fetching navigation from backend, using default navigation. Error: ", error);
        }


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
        // <div className="sidebar-overlay" onClick={() => { setTimeout(() => { setMenu(false) }, 50) }}>
            <div className="sidebar-container pt-2 shadow-sm zpanel" style={{ display: "flex", flexDirection: "column", width: isMobile ? "70%" : "100%" }}>

                <div className="list-group-flush h-100" style={{overflow: "hidden auto"}}>
                    {
                        SideBarNavigation.filter((nav) => (Utils.roleCheck(loggedUser.Roles, nav.roles) && nav.ParentName == null)).map((nav) => {
                            return (
                                <div className={`px-2 mb-2 w-100`}key={nav.Name}>
                                    <button  className={`btn ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'} ${(openedContainer == nav.Name ? 'zbtn' : 'deactive_zbtn')}`}
                                        onClick={async () => {
                                            if(nav.type == NavigationTypes.CONTAINER) {
                                                setOpenedContainer(oc => (oc == nav.Name ? "" : nav.Name));
                                            } else {
                                                navigate(nav.link ?? "/");
                                                exitSideBar()
                                            }
                                        }}
                                        title={(!menu ? nav.Name : "")}
                                        style={{fontSize: "13px"}}
                                    >
                                        <nav.Icon sx={{fontSize: 15}} className={menu ? "me-1" : ""} /> {(menu) && (nav.Name)}
                                    </button>
                                    <div className="w-100 px-2" style={{height: (openedContainer == nav.Name ? "max-content" : 0), overflow: "hidden"}}>
                                        {
                                            SideBarNavigation.filter((navChild) => (Utils.roleCheck(loggedUser.Roles, navChild.roles) && navChild.ParentName == nav.Name)).map((navChild) => {
                                                const isActiveClass = isActive(navChild.link ?? '/') ? 'zbtn' : 'deactive_zbtn';

                                                if (navChild.type == NavigationTypes.LINK) {
                                                    return (
                                                        <button  className={`btn ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'} ${isActiveClass}`}
                                                            onClick={async () => {
                                                                navigate(navChild.link ?? "/");
                                                                exitSideBar()
                                                            }}
                                                            title={(!menu ? navChild.Name : "")}
                                                            style={{fontSize: "13px"}}
                                                        >
                                                            <navChild.Icon sx={{fontSize: 15}} className={menu ? "me-1" : ""} /> {(menu) && (navChild.Name)}
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <button className={`btn btn-primary ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'}`}
                                                            onClick={async () => {
                                                                if (navChild.action) {
                                                                    await navChild.action(loggedUser);
                                                                }
                                                                exitSideBar()
                                                            }}
                                                            title={(!menu ? navChild.Name : "")}
                                                            style={{fontSize: "13px"}}
                                                        >
                                                            <navChild.Icon sx={{fontSize: 15}} className={menu ? "me-2" : ""} /> {(menu) && (navChild.Name)}
                                                        </button>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }



                </div>
            </div>
        // </div>
    );
}

export default SideBarComponent;