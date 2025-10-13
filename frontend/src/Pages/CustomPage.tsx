
import React, { useContext, useEffect, useState } from "react";
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useParams } from "react-router-dom";
import FieldTypes from "../Enums/FiedTypes";
import Utils from "../Models/Utils";
import UserRoles from "../Enums/UserRoles";
import Operators from "../Enums/Operators";
import { isMobile } from "react-device-detect";

const CustomPage = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();

    useEffect(() => {

        console.log("error happened!");

    }, []);

    return (
        <div className="h-100 p-2 zpanel">
            <h1 className="h1 text-center">eyuka CustomPage Component</h1>
            <h1 className="h1 text-center">new tag added</h1>
            <button className="btn btn-sm btn-primary" >Eyuka</button>
        </div>
    );

}

export default CustomPage;
