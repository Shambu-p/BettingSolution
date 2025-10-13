
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

const AbComponent = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();

    useEffect(() => {
    }, []);

    return (
        <div>
            <h1>Ab Component Component</h1>
        </div>
    );

}

export default AbComponent;
