import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";

function DateSettings(props: {iconic?: boolean}) {

    const { localData, changeDateConfig } = useContext(AuthContext);
    const { setShowDateSettingPanel } = useContext(AlertContext);

    const [config, setConfig] = useState<any>({
        type: "ethiopian", // Default date configuration
        format: "dd/mm/yyyy", // Default date format
        separater: "-" // Default date separator
    });

    useEffect(() => {
        setConfig(localData.dateConfig);
    }, [localData.dateConfig]);


    return (
        <div className="sidebar-overlay">
            <div className="w-100 h-100" style={{zIndex: -1, position: "absolute", top: 0, left: 0}} onClick={() => { setTimeout(() => { setShowDateSettingPanel(false) }, 50) }}></div>
            <div className="settingbar-container py-2 px-3 shadow-sm zpanel" style={{ width: isMobile ? "70%" : "30%",  zIndex: 1 }}>

                <div className="d-flex justify-content-between align-items-center w-100 py-3 mb-3">
                    <h5 className="text-center card-title">Date Configuration</h5>
                    <div className="form-check form-switch">
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Calendar Type</label>
                    <select
                        title="Date Type"
                        value={config.type}
                        className="form-control form-control-sm zinput"
                        onChange={(event: any) => {setConfig((prev: any) => ({...prev, type: event.target.value}))}}
                    >
                        <option value="ethiopian">Ethiopian Calendar</option>
                        <option value="gregorian">Gregorian Calendar</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Date Format</label>
                    <select
                        title="Date Type"
                        className="form-control form-control-sm zinput"
                        value={config.format}
                        onChange={(event: any) => {setConfig((prev: any) => ({...prev, format: event.target.value}))}}
                    >
                        <option value="dd/mm/yy">dd/mm/yy</option>
                        <option value="mm/dd/yy">mm/dd/yy</option>
                        <option value="yy/mm/dd">yy/mm/dd</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Date Separetor</label>
                    <select
                        title="Date Type"
                        className="form-control form-control-sm zinput"
                        value={config.separater}
                        onChange={(event: any) => {setConfig((prev: any) => ({...prev, separater: event.target.value}))}}
                    >
                        <option value="/">dd/mm/yy</option>
                        <option value="-">dd-mm-yy</option>
                        <option value=" ">dd mm yy</option>
                    </select>
                </div>

                <button className="btn zbtn" onClick={() => {changeDateConfig(config)}}>Save Changes</button>

            </div>
        </div>
    );
}

export default DateSettings;