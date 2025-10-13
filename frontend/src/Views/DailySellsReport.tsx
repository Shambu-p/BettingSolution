import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import AlertContext from "../Contexts/AlertContext";
import MainAPI from "../APIs/MainAPI";
import ExpenseReport from "../Reports/ExpenseReport";
// Add these imports for printing
import html2canvas from "html2canvas";
import SellReport from "../Reports/SellReport";
import DynamicReport from "../Components/Reusables/DaynamicReport";
import TransferStoreReport from "../Reports/TranferStoreReport";
import EthiopianDateTimePicker from "../Components/Reusables/EthiopianDatePicker";
import FieldTypes from "../Enums/FiedTypes";
import html2pdf from "html2pdf.js";
import {useReactToPrint} from "react-to-print";
import UncollectedSellsDeilyReport from "../Reports/UncollectedSellsDailyReport";
// import ReactToPrint, { PrintContextConsumer } from "react-to-print";

// @ts-ignore
// const jsPDF = window.jspdf.jsPDF;

function DailySellsReport(props: any) {

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
            fromDate: Utils.isoToDateTimeLocal(todayDate.toISOString()),
            toDate: Utils.isoToDateTimeLocal(tomorrowDate.toISOString())
        });
    }, []);

    const nextDayCalculator = (today: string) => {
        let tomorrowDate = (new Date(today));
        tomorrowDate.setHours(0, 0, 0);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        return tomorrowDate.toISOString();
    }

    // Print to PDF handler
    // const handlePrint = async () => {
    //     if (!reportRef.current) return;
    //     const canvas = await html2canvas(reportRef.current, { scale: 2 });
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF({
    //         orientation: "portrait",
    //         unit: "pt",
    //         format: [canvas.width, canvas.height]
    //     });
    //     pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    //     pdf.save("daily_sells_report.pdf");
    // };

    // const handlePrint = () => {

    //     if (!reportRef.current) return;

    //     const opt = {
    //         margin: 0.5,
    //         filename: "daily_sells_report.pdf",
    //         image: { type: "jpeg", quality: 0.98 },
    //         html2canvas: { scale: 1 },
    //         jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    //     };

    //     html2pdf().set(opt).from(reportRef.current).save();

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
    });

    return (
        <div className="w-100 pt-3 px-4" style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>

            <div className="card border mb-2 zpanel">
                <div className="card-body">
                    <h6 className="card-title mb-0" style={{fontWeight: "bolder"}}>Daily Sells Report</h6>
                </div>
            </div>

            <div className="d-flex h-100">
                <div className="col-2 me-1 h-100">
                    <div className="card zpanel h-100">
                        <div className="card-body">
                            {
                                stores.length == 0 && (
                                    <div className="w-100 py-2 mb-2" >
                                        <h6 className="card-title mb-0">No Store Found</h6>
                                    </div>
                                )
                            }
                            {
                                stores.map((store: any) => (
                                    <div 
                                        className="border-bottom w-100 py-2 mb-2"
                                        style={{cursor: "pointer", background: (selectedStore == store.sys_id ? "var(--button_bg)" : "transparent")}}
                                        onClick={() => {setSelectedStore(store.sys_id); setSelectedManager(store.manager);}}
                                    >
                                        <h6 className="card-title mb-0">{store.name}</h6>
                                        <span className="card-subtitle" style={{fontSize: "12px", fontWeight: 100}}>Manager: {store.managedBy.full_name}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="col-10 mx-1 h-100" style={{overflow: "hidden auto"}}>
                    <div className="d-flex w-100 py-1 px-2 mb-1">
                        <button className={`btn btn-sm ${selectedReport == "sells_count_history" ? "btn-dark" : "btn-light"} me-2 border shadow-sm`} onClick={() => {setSelectedReport("sells_count_history");}}>
                            Sells Report
                        </button>
                        <button className={`btn btn-sm ${selectedReport == "sells_transaction" ? "btn-dark" : "btn-light"} me-2 border shadow-sm`} onClick={() => {setSelectedReport("sells_transaction");}}>
                            Payment Collected
                        </button>
                        <button className={`btn btn-sm ${selectedReport == "sells_transaction_history" ? "btn-dark" : "btn-light"} me-2 border shadow-sm`} onClick={() => {setSelectedReport("sells_transaction_history");}}>
                            Sells History
                        </button>
                        <button className={`btn btn-sm ${selectedReport == "expense_report" ? "btn-dark" : "btn-light"} me-2 border shadow-sm`} onClick={() => {setSelectedReport("expense_report");}}>
                            Summary
                        </button>
                        <button className={`btn btn-sm btn-dark me-2 border shadow-sm`} onClick={handlePrint}>
                            Print
                        </button>
                    </div>
                    <div className="card border rounded-3 zpanel mb-3">
                        <div className="card-body">
                            <div className="d-flex mb-3">
                                <div className="col-6 me-1">
                                    <div className="label">Report Date</div>
                                    {
                                        (localData.dateConfig.type == "gregorian") ? (
                                            <input 
                                                type={FieldTypes.DATETIME}
                                                className="form-control form-control-sm zinput"
                                                value={inputs.fromDate}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: event.target.value, toDate: Utils.isoToDateTimeLocal(nextDayCalculator(new Date(`${event.target.value}Z`).toISOString()))}))}}
                                            />
                                        ) : (
                                            <EthiopianDateTimePicker value={inputs.fromDate} type={FieldTypes.DATETIME} onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: event, toDate: Utils.isoToDateTimeLocal(nextDayCalculator(new Date(`${event}Z`).toISOString()))}))}} />
                                        )
                                    }
                                    {/* <input 
                                        type="date"
                                        className="form-control form-control-sm zinput"
                                        value={inputs.fromDate}
                                        onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: event.target.value}))}}
                                    />
                                    <EthiopianDateTimePicker value={inputs.fromDate} type={FieldTypes.DATETIME} onChange={(event: any) => {setInputs((prev: any) => ({...prev, fromDate: event}))}} /> */}
                                </div>
                                <div className="col-6 ms-1">
                                    {/* <div className="label">To Date</div> */}
                                    {/*
                                        (localData.dateConfig.type == "gregorian") ? (
                                            <input 
                                                type={FieldTypes.DATETIME}
                                                className="form-control form-control-sm zinput"
                                                value={inputs.toDate}
                                                onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: event.target.value}))}}
                                            />
                                        ) : (
                                            <EthiopianDateTimePicker value={inputs.toDate} type={FieldTypes.DATETIME} onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: event}))}} />
                                        )
                                    */}
                                    {/* <input 
                                        type="date"
                                        className="form-control form-control-sm zinput"
                                        value={inputs.toDate}
                                        onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: event.target.value}))}}
                                    />
                                    <EthiopianDateTimePicker value={inputs.toDate} type={FieldTypes.DATETIME} onChange={(event: any) => {setInputs((prev: any) => ({...prev, toDate: event}))}} /> */}
                                </div>
                            </div>
                            <div className="w-100 px-2" id="report_container" ref={reportRef}>
                                <div className="d-flex justify-content-between w-100 mb-3">
                                    <div className="col-4 d-flex">
                                        <div className="label me-3">Store/Sells :</div>
                                        <span className="fw-bold">{selectedStore ? stores.find((store: any) => store.sys_id == selectedStore)?.name : "All Stores"}</span>
                                    </div>
                                    <div className="col-4">
                                        <div className="d-flex w-100 justify-content-end">
                                            <span className="fw-bold">{Utils.convertISOToDate(inputs.fromDate, localData.dateConfig)}</span>
                                            <div className="label ms-1"> : Date</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    (selectedReport == "sells_count_history") && (
                                        <div className="w-100" style={{ height: "400px", overflow: "auto hidden"}}>
                                            <DynamicReport configName="sells_count_history" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} />
                                        </div>
                                    )
                                }
                                {
                                    (selectedReport == "sells_transaction" && selecteManager) && (
                                        <div className="w-100" style={{ height: "max-content", overflow: "auto hidden"}}>
                                            <DynamicReport configName="today_sells_transaction" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} />
                                            <br />
                                            <DynamicReport configName="payment_collected_sell_report" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} />
                                            <br />
                                            <UncollectedSellsDeilyReport
                                                fromDate={Utils.dateToISO(inputs.fromDate)}
                                                toDate={Utils.dateToISO(inputs.toDate)}
                                                seller={selecteManager}
                                            />
                                            {/* <DynamicReport configName="uncollected_sells" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} /> */}
                                            <TransferStoreReport
                                                fromDate={Utils.dateToISO(inputs.fromDate)}
                                                toDate={Utils.dateToISO(inputs.toDate)}
                                                receiver={selecteManager}
                                            />
                                            {/* <DynamicReport configName="received_transfers" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} /> */}
                                        </div>
                                    )
                                }
                                {
                                    (selectedReport == "sells_transaction_history") && (
                                        <div className="w-100" style={{ height: "400px", overflow: "auto hidden"}}>
                                            <DynamicReport configName="sells_transaction_history" inputParams={{
                                                todayDate: Utils.dateToISO(inputs.fromDate),
                                                tomorrowDate: Utils.dateToISO(inputs.toDate),
                                                creator: selecteManager
                                            }} />
                                        </div>
                                    )
                                }
                                
                                {
                                    (selectedReport == "expense_report") && (
                                        <div className="w-100" style={{ height: "max-content", overflow: "auto hidden"}}>
                                            <SellReport fromDate={Utils.dateToISO(inputs.fromDate)} toDate={Utils.dateToISO(inputs.toDate)} />
                                        </div>
                                    )
                                }
                                {
                                    (selectedReport == "expense_report") && (
                                        <div className="w-100" style={{ height: "max-content", overflow: "auto hidden"}}>
                                            <ExpenseReport fronmDate={Utils.dateToISO(inputs.fromDate)} toDate={Utils.dateToISO(inputs.toDate)} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailySellsReport;