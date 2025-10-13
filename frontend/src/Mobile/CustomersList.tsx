import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";


const CustomersList = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    const navigate = useNavigate();
    const [customers, setCustomers] = useState<any[]>([]);
    const [localWaiting, setLocalWaiting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == column));
        if(!found_choice) {
            return {};
        }

        return found_choice;
    }

    const loadData = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            let result = await MainAPI.getAll(cookies.login_token, "customer", 0, 0, {}, "reference");
            setCustomers(result.Items);
            // setAlert(error.message, "error");

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="h-100" style={{overflow: "hidden auto"}}>
            <div className=" px-3 mt-3 pb-1">
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-search" style={{fontSize: '20px'}}></i>
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" placeholder="Search" />
                        <i className="bx bx-filter" style={{fontSize: '20px'}}></i>
                    </div>
                </div>

                {
                    customers.map((customer: any) => {
                        // let found_choice = getDisplaySelect("sell.status", customer.status);
                        return (
                            <div className="card shadow-sm mb-3 border-0 zpanel" onClick={() => {navigate(`/mobile/customer_form/${customer.sys_id}`)}}>
                                <div className="card-body ms-3 flex-grow-1">
                                    <h6 className="mb-1">{customer.name}</h6>
                                    <small className="" style={{color: "var(text_color) !important"}}>{customer.phone_number}</small>
                                </div>
                            </div>
                        );
                    })
                }

            </div>
            <button 
                className="btn zbtn rounded-circle px-3 py-3 me-4 mb-5 shadow"
                style={{position: "absolute", bottom: 80, right: 0}}
                onClick={() => {navigate("/mobile/customer_form/-1")}}
            >
                <AddIcon sx={{fontSize: 25}} />
            </button>
            {
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded-5" style={{width: "max-content", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)"}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <div className="spinner-border" style={{color: "var(--text_color)"}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default CustomersList;