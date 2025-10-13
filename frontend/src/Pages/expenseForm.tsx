import React, { useContext, useEffect, useState } from "react";
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import FieldTypes from "../Enums/FiedTypes";
import TransactionCategory from "../Enums/TransactionCategory";
import TransactionType from "../Enums/TransactionType";


const ExpenseForm = (props: any) => {

    const { loggedUser, cookies, localData } = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu, setPopUp } = useContext(AlertContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [localWaiting, setLocalWaiting] = useState(false);
    const [infoFields, setInfoFields] = useState<any>({
        category: "",
        type: "",
        description: "",
        year: "",
        month: "",
        amount: ""
    });

    useEffect(() => {

        let currentDate = new Date();
        setInfoFields((prev: any) => ({...prev, year: currentDate.getFullYear(), month: currentDate.getMonth() }));

    }, []);

    useEffect(() => {
        // setInfoFields((prev: any) => ({...prev, immediate_image: props.dataPassed.immediate_image}));
    }, [props.dataPassed]);

    const updateInfoFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if ([FieldTypes.DATETIME, FieldTypes.DATE].includes(type)) {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: (new Date(value)).toISOString() }));
        } else if (type == FieldTypes.NUMBER) {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: parseInt(value) ?? 0 }));
        } else if (type == FieldTypes.FLOAT) {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: parseFloat(value) ?? 0 }));
        } else {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: value }));
        }
    }

    const formSubmit = async () => {
        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {
            let parent_result = await MainAPI.createNew(cookies.login_token, "transaction", {
                type: TransactionType.Debit,
                category: infoFields.type == "paid_tax" ? TransactionCategory.paidTax : TransactionCategory.otherExpence,
                remark: infoFields.type == "salary" ? `Salary for the month ${infoFields.month}-${infoFields.year}` : infoFields.description,
                amount: infoFields.amount,
                status: true
            });
            setInfoFields({
                category: "",
                type: "",
                description: "",
                year: "",
                month: "",
                amount: ""
            });
            setAlert("Expense Created Successfully", "success");
            if(props.routeData.is_popup) {
                setPopUp(false)
            }
        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);
    }


    return (
        <div className="row m-0 h-100 py-3" >
            <div className="col mx-1 rounded-top-3 h-100" style={{ overflow: "hidden auto" }}>
            </div>
            <div className={props.routeData.is_popup ? "col-12 h-100" : "col-6 h-100"} style={{ overflow: "hidden auto" }}>

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="fw-bold fs-3">Register New Expense</div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="mb-2">Type</div>
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-user-pin" style={{ fontSize: '20px' }}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={infoFields.type} onChange={(event: any) => { updateInfoFields("type", event.target.value) }} >
                            <option value="">Type</option>
                            <option value="salary">Salary Expence</option>
                            <option value="paid_tax">Prepaid Tax Expence</option>
                            <option value="other">Other Expence</option>
                        </select>
                    </div>
                </div>

                {/* Description field only for non-salary */}
                {infoFields.type == "other" && (
                    <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                        <div className="mb-2">Description</div>
                        <div className="search-bar d-flex justify-content-between align-items-start">
                            <i className="bx bx-user-pin me-2" style={{ fontSize: '20px' }} />
                            <textarea
                                className="form-control zinput border-0 py-1"
                                value={infoFields.description}
                                onChange={(event: any) => { updateInfoFields("description", event.target.value) }}
                                placeholder="Description"
                            />
                        </div>
                    </div>
                )}

                {/* Salary month fields only for salary */}
                {infoFields.type === "salary" && (
                    <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                        <div className="mb-2">Salary Month</div>
                        <div className="d-flex justify-content-between">
                            <div className="col">
                                <input className="form-control zinput mx-2 border-0 py-1" disabled={true} type="text" placeholder="Year" value={infoFields.year} onChange={(event: any) => { updateInfoFields("year", event.target.value) }} />
                            </div>
                            <div className="col">
                                <select className="form-control zinput mx-2 border-0 py-1" value={infoFields.month} onChange={(event: any) => { updateInfoFields("month", event.target.value) }} >
                                    <option value="">Month</option>
                                    <option value="8" selected={infoFields.month == 8}>September</option>
                                    <option value="9" selected={infoFields.month == 9}>October</option>
                                    <option value="10" selected={infoFields.month == 10}>November</option>
                                    <option value="11" selected={infoFields.month == 11}>December</option>
                                    <option value="0" selected={infoFields.month == 0}>January</option>
                                    <option value="1" selected={infoFields.month == 1}>February</option>
                                    <option value="2" selected={infoFields.month == 2}>March</option>
                                    <option value="3" selected={infoFields.month == 3}>April</option>
                                    <option value="4" selected={infoFields.month == 4}>May</option>
                                    <option value="5" selected={infoFields.month == 5}>Jun</option>
                                    <option value="6" selected={infoFields.month == 6}>July</option>
                                    <option value="7" selected={infoFields.month == 7}>Augest</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="mb-2">Amount</div>
                    <input className="form-control zinput mx-2 border-0 py-1" type="number" placeholder="Amount" value={infoFields.amount} onChange={(event: any) => { updateInfoFields("amount", event.target.value, FieldTypes.FLOAT) }} />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn zbtn my-2" onClick={formSubmit}>
                        Submit
                    </button>
                </div>

            </div>

            <div className="col mx-1 p-0 rounded-top-3" style={{ overflow: "hidden auto" }}>
            </div>

            {
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded-5" style={{ width: "max-content", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <div className="spinner-border" style={{ color: "var(--text_color)" }} role="status">
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

export default ExpenseForm;