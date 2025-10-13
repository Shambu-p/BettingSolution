import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useParams } from "react-router-dom";


const CustomerForm = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    const params = useParams();
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState<any[]>([]);
    const [localWaiting, setLocalWaiting] = useState(false);
    const [inputFields, setInputFields] = useState<{
        name: string,
        address: string,
        phone_number: string,
        credite_amount: number,
        debt_amount: number
    }>({
        name: "",
        address: "",
        phone_number: "",
        credite_amount: 0,
        debt_amount: 0
    });

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

            if(params.id && params.id != "-1") {
                let result = await MainAPI.getSingle(cookies.login_token, "customer", params.id);
                setInputFields(result);
                // setAlert(error.message, "error");
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const updateInput = (field_name: string, value: any) => {
        setInputFields((flds) =>({...flds, [field_name]: value}));
    }

    const clearForm = () => {
        setInputFields({
            name: "",
            address: "",
            phone_number: "",
            credite_amount: 0,
            debt_amount: 0
        });
    }


    const formSubmit = async () => {
        // Check required fields
        const requiredFields = [
            { key: 'name', label: 'Customer Name' },
            { key: 'phone_number', label: 'Phone Number' },
            { key: 'address', label: 'Customer Address' }
        ];
        for (let field of requiredFields) {
            if (!inputFields[field.key] || (typeof inputFields[field.key] === 'string' && inputFields[field.key].trim() === '')) {
                setAlert(`${field.label} is required.`, 'error');
                return;
            }
        }

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {
            if(params.id && params.id == "-1") {
                let result = await MainAPI.createNew(cookies.login_token, "customer", {
                    ...inputFields
                });
                navigate("/mobile/customers");
                // setAlert(error.message, "error");
            } else if(params.id) {
                let result = await MainAPI.update(cookies.login_token, "customer", {
                    ...inputFields
                });
            }
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    }

    return (
        <div className="h-100" style={{display: "flex", flexDirection: "column", overflow: "hidden auto"}}>
            <div className="container h-100 mt-3 pb-1">

                <h5 className="card-title mb-4">Customer Form</h5>
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bxs-purchase-tag" style={{fontSize: '20px'}}></i>
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" value={inputFields.name} onChange={(event: any) => {updateInput("name", event.target.value)}} placeholder="Customer Name" />
                    </div>
                </div>
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-current-location" style={{fontSize: '20px'}}></i>
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" value={inputFields.address} onChange={(event: any) => {updateInput("address", event.target.value)}} placeholder="Customer Address" />
                    </div>
                </div>
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-phone" style={{fontSize: '20px'}}></i>
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" value={inputFields.phone_number} onChange={(event: any) => {updateInput("phone_number", event.target.value)}} placeholder="Phone number" />
                    </div>
                </div>

            </div>
            <button className="btn zbtn mb-2 mx-3" onClick={formSubmit}>
                submit
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

export default CustomerForm;