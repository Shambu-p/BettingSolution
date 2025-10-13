import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const SplashScreen = (props: any) => {

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {navigate("/mobile")}, 1000)
    }, [])

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="card rounded-5 border-0 shadow bg-success">
                <div className="card-body">
                    <img src="/images/splash_screen.png" alt="org_icon" style={{width: "90px"}}/>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;