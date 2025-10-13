import { Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { isDesktop, isMobile, isTablet } from "react-device-detect";
import ZThemeContext from "../../Contexts/ZThemeContext";
import ContrastIcon from '@mui/icons-material/Contrast';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import UserRoles from "../../Enums/UserRoles";
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Utils from "../../Models/Utils";
import CachedIcon from '@mui/icons-material/Cached';
import MonitorIcon from '@mui/icons-material/Monitor';
import Pages from "../../Pages/Pages";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';


function TopNav() {

	const { setAlert, setWaiting, setMenu, menu, openPopup, setShowDateSettingPanel, showDateSettingPanel } = useContext(AlertContext);
	const { loggedUser, authWaiting, removeCookie } = useContext(AuthContext);
	const { theme, setTheme, setUiSettings, uiSettings } = useContext(ZThemeContext);

	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [coloring, setColoring] = useState({
		color1: "",
		color2: ""
	});
	const [screenshot, setScreenshot] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement('canvas'));

	const captureScreenshot = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            const video = videoRef.current;
            video.srcObject = stream;

            // Wait for video to be ready
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve);
                };
            });

            const track = stream.getVideoTracks()[0];

			await Utils.delay(600);
            // Set canvas size to match video
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Stop the screen share stream
            track.stop();

            // Get image as data URL
            const imageUrl = canvas.toDataURL('image/png');
            openPopup({}, (
				<Pages
					page="issue-form"
					parentType="main_ui"
					routeData={{
						is_popup: true,
						params: {
							id: "-1"
						}
					}}
					dataPassed={{
						immediate_image: imageUrl
					}}
				/>
			));

        } catch (error) {
            console.error('Screen capture failed:', error);
            alert('Screen capture was cancelled or failed.');
        }
    };

	function stringToColor(name: string) {
		let hash = 0;
		let i;
		/* eslint-disable no-bitwise */
		for (i = 0; i < name.length; i += 1) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name: string) {
		let slt = name.split(' ');
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(' ')[0][0]}${(slt.length > 1) ? (slt[slt.length - 1][0]) : ""}`,
		};
	}

	const open = Boolean(anchorEl);
	const handleMenuClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const deleteCookie = (name: string) => {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	return authWaiting ? (<></>) : (
		<div className="d-flex justify-content-between px-2 py-1 border-bottom top-nav zpanel align-items-center" style={{ flexWrap: "wrap" }}>
			<div className="align-items-center" style={{display: "flex"}}>
				{isMobile && (<IconButton onClick={() => { window.history.back(); }} onMouseOut={() => { setColoring({ ...coloring, color2: "var(--text_color)" }) }} onMouseOver={() => { setColoring({ ...coloring, color2: "var(--button_bg)" }) }} >
					<ArrowBackIcon sx={{ fontSize: 15, color: coloring.color2 }} />
				</IconButton>)}

				{(!isMobile && !loggedUser.Roles.includes(UserRoles.Sells)) && (
					<IconButton onClick={() => { setMenu(!menu) }} onMouseOut={() => { setColoring({ ...coloring, color1: "var(--text_color)" }) }} onMouseOver={() => { setColoring({ ...coloring, color1: "var(--button_bg)" }) }} >
						<MenuIcon sx={{ fontSize: 15, color: coloring.color1 }} />
					</IconButton>
				)}
				<img src="/images/byae_logo.png" className="me-2" style={{ width: "25px", height: "auto" }} alt="logo" />
				{/* <img src="/images/splash_screen.png" className="me-2" style={{ width: "25px", height: "auto" }} alt="logo" /> */}
				<span className="card-title text-center me-4" style={{color: "var(--button_bg)"}}>BYAE Business</span>
			</div>
			{
				(!isMobile) && (
					<div className="d-flex align-items-center">
						<div className="dropdown">
							<button className="btn deactive_zbtn dropdown-toggle py-1" style={{ fontSize: "13px" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
								<BackupTableIcon className="me-2" sx={{ fontSize: 20 }} />
								Workspaces
							</button>
							<ul className="dropdown-menu zpanel">
								<li><button onClick={() => { navigate("/workspace/operation_management") }} className="dropdown-item zoption">
									Operation Management Workspace
								</button></li>
							</ul>
						</div>
						<div className="dropdown">
							<button className="btn deactive_zbtn dropdown-toggle py-1" style={{ fontSize: "13px" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
								<DashboardIcon className="me-2" sx={{ fontSize: 20 }} />
								Dashboards
							</button>
							<ul className="dropdown-menu zpanel">
								<li><button onClick={() => { navigate("/") }} className="dropdown-item zoption">
									Main Dashboard
								</button></li>
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.Admin]) && (
										<li><button onClick={() => { navigate("/finance-dashboard") }} className="dropdown-item zoption">
											Accountant Dashboard
										</button></li>
									)
								}
								{
									Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Admin]) && (
										<li><button onClick={() => { navigate("/store-dashboard") }} className="dropdown-item zoption">
											Store Managers Dashboard
										</button></li>
									)
								}
							</ul>
						</div>
					</div>
				)
			}
			<div className="d-flex align-items-center">
				{isDesktop && (<IconButton className="me-2" onClick={captureScreenshot} >
					<MonitorIcon sx={{ fontSize: 15, color: `var(--text_color)` }} />
				</IconButton>)}
				{isDesktop && (<IconButton className="me-2" onClick={() => { setTheme({ ...theme, scheme: ((theme.scheme == "zdark") ? "zlight" : "zdark") }) }} >
					<ContrastIcon sx={{ fontSize: 15, color: `var(--text_color)` }} />
				</IconButton>)}

				{isMobile && (<IconButton className="me-2" onClick={() => { window.location.reload(); }} >
					<CachedIcon sx={{ fontSize: 18, color: `var(--text_color)` }} />
				</IconButton>)}

				<div className="dropdown">
					<button className="btn deactive_zbtn dropdown-toggle py-1" style={{ fontSize: "13px" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
						{isDesktop ? `${loggedUser.full_name}` : (<SettingsIcon sx={{ fontSize: 18, color: "var(--text_color)" }} />)}
					</button>
					<ul className="dropdown-menu zpanel">
						<li><button onClick={() => { navigate("/profile") }} className="dropdown-item zoption">
							<AccountBoxOutlinedIcon className="me-2" sx={{ fontSize: 20 }} />
							Profile
						</button></li>

						<li><button onClick={() => { setUiSettings(!uiSettings) }} className="dropdown-item zoption">
							<SettingsOutlinedIcon className="me-2" sx={{ fontSize: 18 }} />
							UI Settings
						</button></li>
						<li><button onClick={() => { setShowDateSettingPanel(!showDateSettingPanel) }} className="dropdown-item zoption">
							<EditCalendarIcon className="me-2" sx={{ fontSize: 18 }} />
							Date Settings
						</button></li>
						<li><button onClick={async () => {
							deleteCookie("login_token");
							setTimeout(() => {
								window.location.href = window.location.origin;
							}, 500);
						}} className="dropdown-item zoption">
							<LogoutOutlinedIcon className="me-2" sx={{ fontSize: 18 }} />
							Logout
						</button></li>
					</ul>
				</div>
			</div>

			<video ref={videoRef} style={{ display: 'none' }} />
		</div>
	);
}

export default TopNav;
