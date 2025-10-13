import React, { useContext, useState } from "react";
import DynamicReport from "../Components/Reusables/DaynamicReport";
import Utils from "../Models/Utils";
import AuthContext from "../Contexts/AuthContext";
import { useLocation } from "react-router-dom";

const StoreReports = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);

    const [reportKey, setReportKey] = useState(Date.now());
    const location = useLocation(); // Get current route location
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0);

    return (
        <div className="h-100 w-100 px-2 py-3 m-0">

            <div className="col-sm-12 col-md-6 p-3 shadow rounded-3 mb-3" style={{ overflow: "auto hidden", height: "max-content"}}>
                <DynamicReport key="materials_in_store_10" configName="materials_in_store_list" inputParams={{}} />
            </div>
            <div className="col-sm-12 col-md-6 p-3 shadow rounded-3 mb-3" style={{ overflow: "auto hidden", height: "max-content"}}>
                <DynamicReport key={location.key} configName="store_products_list" inputParams={{}}/>
            </div>
            <div className="col-sm-12 col-md-6 p-3 shadow rounded-3 mb-3" style={{ overflow: "auto hidden", height: "max-content"}}>
                <DynamicReport configName="payment_collected_from_previous_sell" inputParams={{
                    todayDate: todayDate.toISOString(),
                    creator: loggedUser.Id
                }}/>
            </div>

        </div>
    );
};

export default StoreReports;