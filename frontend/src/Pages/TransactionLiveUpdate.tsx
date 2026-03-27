
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

const TransactionLiveUpdate = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();

    useEffect(() => {
    }, []);

    return (
        <div className="w-100 h-100 pt-4">
            <h1 className="text-center fs-2">Live Update</h1>

            <div className="d-flex justify-content-center">
                <span className="fs-1">18<sub>Kw</sub></span>
                <span className="fs-1">18<sub>Kw</sub></span>
            </div>


        </div>
    );

}

export default TransactionLiveUpdate;
