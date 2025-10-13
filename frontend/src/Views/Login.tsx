import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { Login } from "../APIs/AuthAPI";
import AuthContext from "../Contexts/AuthContext";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

function LoginPage() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { setLoggedUser, setLoggedIn, setCookie, onLogin } = useContext(AuthContext);

    const [fields, setFields] = useState<{ Phone: string, Password: string }>({
        Phone: "",
        Password: ""
    });

    const [passwordVisiblity, setPasswordVisibility] = useState<Boolean>(false);

    const style = {
        mobile: {
            width: "100%",
            // height: "100%"
        },
        desktop: {
            width: "35%"
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const fieldSetter = (type: ("Phone" | "Password"), value: any) => {
        setFields({ ...fields, [type]: value });
    }

    const submitForm = async (event: any) => {
        event.preventDefault();

        setTimeout(() => { setWaiting(true) }, 1);
        try {

            let response = await Login(fields.Phone, fields.Password);
            setLoggedUser(response);
            await onLogin(response);
            setCookie("login_token", response.Token, { path: "/", maxAge: 86400 });

            navigate(isMobile ? "/mobile" : "/");
            setLoggedIn(true);
            setWaiting(false);

        } catch (error: any) {
            setWaiting(false);
            setAlert(error.message, "error");
        }

    }

    return (
        // <div className="w-100 h-100" style={{ overflowX: "hidden", overflowY: "auto", background: (isMobile ? "white" : "transparent") }}>
        <div className="w-100 h-100" style={{ overflowX: "hidden", overflowY: "auto", background: "var(--main_bg)" }}>
            <div className="row p-0 m-0 h-100">
                <div className="col"></div>
                <div className="col-sm-12 col-md-8 col-lg-4 h-100" style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <div className="w-100">
                        <div className="d-flex justify-content-center mb-1">
                            <img src="./images/byae_logo.png" style={{width: "200px"}} alt="logo" />
                            {/* <img src="./images/splash_screen.png" style={{width: "100px"}} alt="logo" /> */}
                        </div>
                        <p className="text-center lead fs-3" style={{color: "var(--text_color)"}}>
                            <strong>BYAE Business P.L.C.</strong>
                        </p>
                    </div>
                    <div className={isMobile ? "zpanle w-100" : "card zpanel w-100 border-0 shadow-sm"} style={isMobile ? style.mobile : style.desktop}>
                        <div className="card-body">

                            <form action="post" className="w-100 ps-4 pe-4" onSubmit={submitForm}>
                                <div className="mb-2">
                                    <label htmlFor="email_input" className="form-label small_text" style={{color: "var(--text_color)"}}>Phone Number Or Email</label>
                                    <input type="tel" className="form-control form-control-sm zinput" required value={fields.Phone} onChange={(event: any) => { fieldSetter("Phone", event.target.value) }} id="email_input" placeholder="enter phone number or email " />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password_input" className="form-label small_text" style={{color: "var(--text_color)"}}>Password</label>
                                    <div className="input-group">
                                        <input type={(passwordVisiblity ? "text" : "password")} className="form-control form-control-sm zinput" id="password_input" placeholder="Enter Your Password" required value={fields.Password} onChange={(event: any) => { fieldSetter("Password", event.target.value) }} />
                                        <button className="btn deactive-zbtn border btn-sm" type="button" onClick={() => {setPasswordVisibility(!passwordVisiblity)}}>
                                            {passwordVisiblity ? (<VisibilityOffOutlinedIcon sx={{fontSize: "18px"}} />) : (<VisibilityOutlinedIcon sx={{fontSize: "18px"}} />)}
                                        </button>
                                    </div>
                                </div>

                                {/* <button className="btn btn-link" onClick={() => { navigate("/reset") }}>Did you forget your password?</button> <br /> */}

                                <button className={isMobile ? "btn zbtn btn-lg w-100 btn-sm" : "btn zbtn w-100 btn-sm"}>
                                    <LockOpenIcon sx={{ fontSize: 18, marginRight: "10px" }} />
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
}

export default LoginPage;