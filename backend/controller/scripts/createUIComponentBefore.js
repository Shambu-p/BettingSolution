const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const ComponentManager = require('../../infrastructure/UIManagement/ComponentManager');

async function createUIComponentBefore(reqUser, data, dependencies, smsService) {

    data.name = Utils.toPascalCase(data.name);

    let component_script = `
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

const ${data.name} = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();

    useEffect(() => {
    }, []);

    return (
        <div>
            <h1>${data.name} Component</h1>
        </div>
    );

}

export default ${data.name};
`;

    data.component_script = component_script;

    let uiManager = new ComponentManager("../frontend");

    uiManager.createComponent(data.name, component_script);

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createUIComponentBefore;