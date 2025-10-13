import MainAPI from '../../APIs/MainAPI';
import AlertContext from '../../Contexts/AlertContext';
import AuthContext from '../../Contexts/AuthContext';
import Utils from '../../Models/Utils';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useContext, useEffect, useState } from 'react';

const RecordActivity = (properties: {
    tableName: string,
    recordId: string,
}) => {

    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    const [recordActivities, setRecordActivities] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const loadActivities = async () => {
        let response = await MainAPI.loadActivities(cookies.login_token, properties.tableName, properties.recordId);
        console.log("activities loaded ", response.Items);
        setRecordActivities(rat => (response.Items));
    }

    useEffect(() => {
        loadActivities();
    }, [properties.recordId, properties.tableName]);

    return (
        <div className="accordion accordion-flush" id={`${properties.recordId}_accordionFlushExample`}>
            <div className="w-100 px-3 py-2 mb-4 shadow-sm zpanel accordion-item">
                <h5 className="card-subtitle mb-3" style={{fontSize: "15px"}}>
                    <button
                        className="btn w-100 d-flex justify-content-between align-items-center zbtn accordion-header"
                        type="button"
                        onClick={() => {setIsOpen(!isOpen)}}
                    >
                        <span>Activity History</span>
                        <KeyboardDoubleArrowDownIcon className="mb-0" sx={{fontSize: "15px"}}/>
                    </button>
                </h5>

                {
                    isOpen && (
                        <div className="w-100 accordion-collapse " data-bs-parent={`#${properties.recordId}_accordionFlushExample`}>
                            {
                                (recordActivities.length > 0) ? (
                                    recordActivities.map((act: any) => (
                                        <div className="w-100 mb-2 border-bottom">
                                            <h5 className="card-title mb-0" style={{fontSize: "15px"}}>{act.creater.full_name}</h5>
                                            <span className="card-subtitle" style={{fontSize: "13px"}}>{Utils.isoToReadableDateTime(act.created_on, localData.dateConfig)}</span>
                                            <div className="lead mt-2 mb-2" style={{fontSize: "12px"}} dangerouslySetInnerHTML={{ __html: act.description }} />
                                        </div>
                                    ))
                                ) : (
                                    <h5 className="card-title text-center my-3">No Activity</h5>
                                )
                            }
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default RecordActivity;