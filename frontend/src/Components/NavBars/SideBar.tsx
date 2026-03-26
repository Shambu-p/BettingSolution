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

    // const [navList, setNavList] = useState<INavigation[]>([]);
    const [navList, setNavList] = useState<any[]>([]);
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
    
            let result = await MainAPI.getAllv2(cookies.login_token, "system_nav", 0, 0, {}, { order: "asc" }, "children");
            let navsFromApi = result.Items;

            for(let nav of navsFromApi) {

                temp_navs.push({
                    ...nav,
                    ChildNav: undefined,
                    childCount: nav.ChildNav.length,
                    roles: nav.Roles.map((child: any) => child.role)
                });

            };

        } catch (error) {
            console.log("Error fetching navigation from backend, using default navigation. Error: ", error);
        }

        console.log("Temp Navs: ", temp_navs);


        // SideBarNavigation.forEach(async nav => {
        //     // if(nav.active && nav.roles.includes(loggedUser.Roles[0]) && await nav.validator(loggedUser)) {
        //     //     temp_navs.push(nav);
        //     // }
        //     temp_navs.push(nav);
            
        // });
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

    // const handleDrawerToggle = () => {
    //     setMobileOpen(!mobileOpen);
    // };


    return (
        // <div className="sidebar-overlay" onClick={() => { setTimeout(() => { setMenu(false) }, 50) }}>
            <div className="sidebar-container pt-2 shadow-sm zpanel" style={{ display: "flex", flexDirection: "column", width: isMobile ? "70%" : "100%" }}>

                <div className="list-group-flush h-100" style={{overflow: "hidden auto"}}>
                    {
                        // SideBarNavigation.filter((nav) => (Utils.roleCheck(loggedUser.Roles, nav.roles) && nav.ParentName == null)).map((nav) => {
                        navList.filter((nav) => (Utils.roleCheck(loggedUser.Roles, nav.roles) && nav.parent_id == null)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((nav) => {
                            return (
                                <div className={`px-2 mb-2 w-100`}key={nav.sys_id}>
                                    <button  className={`btn ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'} ${(openedContainer == nav.name ? 'zbtn' : 'deactive_zbtn')}`}
                                        onClick={async () => {
                                            // if(nav.type == NavigationTypes.CONTAINER) {
                                            if(nav.childCount > 0) {
                                                setOpenedContainer(oc => (oc == nav.name ? "" : nav.name));
                                            } else {
                                                navigate(nav.link ?? "/");
                                                exitSideBar()
                                            }
                                        }}
                                        title={(!menu ? nav.name : "")}
                                        style={{fontSize: "13px"}}
                                    >
                                        <i style={{fontSize: 15}} className={menu ? `${nav.icon} me-1` : `${nav.icon}`} /> {(menu) && (nav.name)}
                                        {/* <nav.Icon sx={{fontSize: 15}} className={menu ? "me-1" : ""} /> {(menu) && (nav.Name)} */}
                                    </button>
                                    <div className="w-100 px-2" style={{height: (openedContainer == nav.name ? "max-content" : 0), overflow: "hidden"}}>
                                        {
                                            navList.filter((navChild) => (Utils.roleCheck(loggedUser.Roles, navChild.roles) && navChild.parent_id == nav.sys_id)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((navChild) => {
                                                const isActiveClass = isActive(navChild.link ?? '/') ? 'zbtn' : 'deactive_zbtn';

                                                return (
                                                    <button  className={`btn ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'} ${isActiveClass}`}
                                                        onClick={async () => {
                                                            navigate(navChild.link ?? "/");
                                                            exitSideBar()
                                                        }}
                                                        title={(!menu ? navChild.name : "")}
                                                        style={{fontSize: "13px"}}
                                                    >
                                                        <i style={{fontSize: 15}} className={menu ? `${navChild.icon} me-1` : `${navChild.icon}`} /> {(menu) && (navChild.name)}
                                                        {/* <navChild.Icon sx={{fontSize: 15}} className={menu ? "me-1" : ""} /> {(menu) && (navChild.Name)} */}
                                                    </button>
                                                );
                                                // if (navChild.type == NavigationTypes.LINK) {
                                                    
                                                // } else {
                                                //     return (
                                                //         <button className={`btn btn-primary ${menu ? 'text-start' : 'text-center'} w-100 py-1 ${menu ? 'px-3' : 'px-1'}`}
                                                //             onClick={async () => {
                                                //                 if (navChild.action) {
                                                //                     await navChild.action(loggedUser);
                                                //                 }
                                                //                 exitSideBar()
                                                //             }}
                                                //             title={(!menu ? navChild.Name : "")}
                                                //             style={{fontSize: "13px"}}
                                                //         >
                                                //             <navChild.Icon sx={{fontSize: 15}} className={menu ? "me-2" : ""} /> {(menu) && (navChild.Name)}
                                                //         </button>
                                                //     );
                                                // }
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