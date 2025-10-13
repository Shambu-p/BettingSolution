import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import AlertContext from "../Contexts/AlertContext";
import MainAPI from "../APIs/MainAPI";
// Add these imports for printing
import html2canvas from "html2canvas";
import CustomersFrequencyReport from "../Reports/CustomersFrequencyReport";
import ProductBuyingFrequencyReport from "../Reports/ProductBuyingFrequencyReport";
import EthiopianDatePicker from "../Components/Reusables/EthiopianDatePicker";
import FieldTypes from "../Enums/FiedTypes";
import { useReactToPrint } from "react-to-print";
import GeneralSellReport from "../Reports/GeneralSellReport";
import ExpenseReport from "../Reports/ExpenseReport";
import SellReport from "../Reports/SellReport";
import DynamicReport from "../Components/Reusables/DaynamicReport";

// @ts-ignore
// const jsPDF = window.jspdf.jsPDF;

function GeneralReport(props: any) {

    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);

    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selecteManager, setSelectedManager] = useState(null);
    const [selectedReport, setSelectedReport] = useState("today_transaction");
    const [inputs, setInputs] = useState({
        fromDate: "",
        toDate: ""
    });

    // Ref for the report container
    const reportRef = useRef<HTMLDivElement>(null);

    const loadStores = async () => {
        try {
            let stores_result = await MainAPI.getAll(cookies.login_token, "store", 0, 0, {}, "reference");
            setStores(stores_result.Items);
        } catch(error: any) { }
    }

    useEffect(() => {
        loadStores();
        let todayDate = (new Date());
        let tomorrowDate = (new Date());
        todayDate.setHours(0, 0, 0);
        tomorrowDate.setHours(0, 0, 0);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        setInputs({
            fromDate: Utils.dateInputFormat(todayDate.toISOString()),
            toDate: Utils.dateInputFormat(tomorrowDate.toISOString())
        });
    }, [])

    // Print to PDF handler
    // const handlePrint = async () => {
    //     if (!reportRef.current) return;
    //     const canvas = await html2canvas(reportRef.current, { scale: 2 });
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF({
    //         orientation: "landscape",
    //         unit: "pt",
    //         format: [canvas.width, canvas.height]
    //     });
    //     pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    //     pdf.save("daily_sells_report.pdf");
    // };

    const handlePrint =  useReactToPrint({
        contentRef: reportRef,
        documentTitle: "daily_sells_report",
        pageStyle: `
            @page { size: A4; margin: 20mm; }
            body { -webkit-print-color-adjust: exact; }
        `,
        onPrintError: (errorLocation: 'onBeforePrint' | 'print', error: Error) => {
            console.error("Print error:", error, errorLocation);
            setAlert("Failed to print report", "error");
        }
    })

    return (
        <div className="w-100 py-2 px-2" style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>

            <div className="card border rounded-bottom-0 mb-2 zpanel">
                <div className="card-body">
                    <h6 className="card-title mb-0" style={{fontWeight: "bolder"}}>General Report</h6>
                </div>
            </div>

            <div className="d-flex pe-2 h-100">
                <div className="col-2 me-1 h-100">
                    <div className="card zpanel rounded-top-0 h-100">
                        <div className="card-body px-2">
                            <div 
                                className="border-bottom w-100 py-2 px-1 mb-2"
                                style={{cursor: "pointer", background: (selectedReport == "customer_frequency" ? "var(--button_bg)" : "transparent")}}
                                onClick={() => {setSelectedReport("customer_frequency");}}
                            >
                                <h6 className="card-title mb-0">Customer Frequency Report</h6>
                            </div>
                            <div 
                                className="border-bottom w-100 py-2 px-1 mb-2"
                                style={{cursor: "pointer", background: (selectedReport == "product_buying_frequency" ? "var(--button_bg)" : "transparent")}}
                                onClick={() => {setSelectedReport("product_buying_frequency");}}
                            >
                                <h6 className="card-title mb-0">Product Selling Frequency Report</h6>
                            </div>
                            <div 
                                className="border-bottom w-100 py-2 px-1 mb-2"
                                style={{cursor: "pointer", background: (selectedReport == "sells_summary" ? "var(--button_bg)" : "transparent")}}
                                onClick={() => {setSelectedReport("sells_summary");}}
                            >
                                <h6 className="card-title mb-0">Sells Summary Report</h6>
                            </div>
                            <div 
                                className="border-bottom w-100 py-2 px-1 mb-2"
                                style={{cursor: "pointer", background: (selectedReport == "expense_and_tax" ? "var(--button_bg)" : "transparent")}}
                                onClick={() => {setSelectedReport("expense_and_tax");}}
                            >
                                <h6 className="card-title mb-0">Expense and Tax Report</h6>
                            </div>
                            <div 
                                className="border-bottom w-100 py-2 px-1 mb-2"
                                style={{cursor: "pointer", background: (selectedReport == "sells_history_by_date" ? "var(--button_bg)" : "transparent")}}
                                onClick={() => {setSelectedReport("sells_history_by_date");}}
                            >
                                <h6 className="card-title mb-0">Sell History</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-10 ms-1 h-100" style={{overflow: "hidden auto"}}>
                    <div className="card border rounded-0 zpanel mb-3">
                        <div className="card-body">
                            <div className="d-flex mb-3">
                                <div className="col-4 px-2">
                                    <div className="label">From Date</div>
                                    {
                                        (localData.dateConfig.type == "ethiopian") ? (
                                            <EthiopianDatePicker 
                                                value={inputs.fromDate}
                                                type={FieldTypes.DATE}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: Utils.dateInputFormat(new Date(event).toISOString())}))}}
                                            />
                                        ) : (
                                            <input 
                                                type="date"
                                                className="form-control form-control-sm zinput"
                                                value={inputs.fromDate}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: event.target.value}))}}
                                            />
                                        )
                                    }
                                </div>
                                <div className="col-4 px-2">
                                    <div className="label">To Date</div>
                                    {
                                        (localData.dateConfig.type == "ethiopian") ? (
                                            <EthiopianDatePicker 
                                                value={inputs.toDate}
                                                type={FieldTypes.DATE}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: Utils.dateInputFormat(new Date(event).toISOString())}))}}
                                            />
                                        ) : (
                                            <input 
                                                type="date"
                                                className="form-control form-control-sm zinput"
                                                value={inputs.toDate}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: event.target.value}))}}
                                            />
                                        )
                                    }
                                </div>
                                <div className="col-4 px-2 d-flex align-items-end justify-content-end">
                                    <button className={`btn btn-sm btn-dark me-2 border shadow-sm`} onClick={handlePrint}>
                                        Print
                                    </button>
                                </div>
                            </div>
                            <div className="w-100 px-2" id="report_container" ref={reportRef} >
                                <div className="d-flex justify-content-between w-100 mb-3">
                                    <div className="col-4 d-flex">
                                        <div className="label me-3">Store/Sells :</div>
                                        <span className="fw-bold">{selectedStore ? stores.find((store: any) => store.sys_id == selectedStore)?.name : "All Stores"}</span>
                                    </div>
                                    <div className="col-4">
                                        <div className="d-flex w-100 justify-content-end">
                                            <span className="fw-bold">{Utils.convertISOToDate(inputs.fromDate, localData.dateConfig)}</span>
                                            <div className="label ms-1"> : Date From</div>
                                        </div>
                                        <div className="d-flex w-100 justify-content-end">
                                            <span className="fw-bold">{Utils.convertISOToDate(inputs.toDate, localData.dateConfig)}</span>
                                            <div className="label ms-1"> : Date To</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100" >
                                    {
                                        (selectedReport == "customer_frequency") && (
                                            <div className="w-100">
                                                {/* <DynamicReport configName="customer_buying_frequency" inputParams={{
                                                    fromDate: Utils.dateToISO(inputs.fromDate),
                                                    toDate: Utils.dateToISO(inputs.toDate)
                                                }} /> */}
                                                <CustomersFrequencyReport fromDate={Utils.dateToISO(inputs.fromDate)} toDate={Utils.dateToISO(inputs.toDate)} />
                                            </div>
                                        )
                                    }
                                    {
                                        (selectedReport == "product_buying_frequency") && (
                                            <div className="w-100">
                                                {/* <DynamicReport configName="product_buying_frequency" inputParams={{
                                                    fromDate: Utils.dateToISO(inputs.fromDate),
                                                    toDate: Utils.dateToISO(inputs.toDate)
                                                }} /> */}
                                                <ProductBuyingFrequencyReport
                                                    fromDate={Utils.dateToISO(inputs.fromDate)}
                                                    toDate={Utils.dateToISO(inputs.toDate)}
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        (selectedReport == "sells_summary") && (
                                            <div className="w-100">
                                                {/* <SellReport
                                                    fromDate={Utils.dateToISO(inputs.fromDate)}
                                                    toDate={Utils.dateToISO(inputs.toDate)}
                                                /> */}
                                                <GeneralSellReport
                                                    fromDate={Utils.dateToISO(inputs.fromDate)}
                                                    toDate={Utils.dateToISO(inputs.toDate)}
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        (selectedReport == "expense_and_tax") && (
                                            <div className="w-100">
                                                <ExpenseReport
                                                    fronmDate={Utils.dateToISO(inputs.fromDate)}
                                                    toDate={Utils.dateToISO(inputs.toDate)}
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        (selectedReport == "sells_history_by_date") && (
                                            <div className="w-100">
                                                {/* <ExpenseReport
                                                    fronmDate={Utils.dateToISO(inputs.fromDate)}
                                                    toDate={Utils.dateToISO(inputs.toDate)}
                                                /> */}
                                                <DynamicReport configName="sells_transaction_history" inputParams={{
                                                    todayDate: Utils.dateToISO(inputs.fromDate),
                                                    tomorrowDate: Utils.dateToISO(inputs.toDate)
                                                }} />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;