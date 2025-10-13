import React, { useContext, useEffect, useState } from "react";
import TopNav from "../Components/NavBars/TopNav";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListComponent from "./ListComponent";
import AuthContext from "../Contexts/AuthContext";
import IPagination from "../Intefaces/IPagination";
import AlertContext from "../Contexts/AlertContext";
import Empty from "../Components/Extra/Empty";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterWindow from "../Components/FilterWindow";
import Utils from "../Models/Utils";
import Waiting from "../Components/Extra/Waiting";
import MainAPI from "../APIs/MainAPI";
import UserRoles from "../Enums/UserRoles";
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PrintIcon from '@mui/icons-material/Print';
import AdminAPI from "../APIs/AdminAPI";
import { Refresh } from "@mui/icons-material";
import onListLoadFunction from "../Scripts/onListLoadFunctions";
import DeleteIcon from '@mui/icons-material/Delete';
import { useReactToPrint } from "react-to-print";

function TablePage(props: {
    formName: string;
    isRelatedList: boolean;
    condition: any;
    initialPageNumber: number;
}) {

    const { setAlert, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useParams();
    const navigate = useNavigate();
    const printRef = React.useRef<HTMLDivElement>(null);
    const [showWaiting, setShowWaiting] = useState<boolean>(false);
    const [form, setForm] = useState<any>();
    const [records, setRecords] = useState<IPagination<any>>({
        Items: [],
        PageNumber: 1,
        PageSize: 25,
        TotalCount: 0
    });
    const [pageSetting, setPageSetting] = useState<{ pageSize: number, pageNumber: number }>({
        pageSize: 25,
        pageNumber: props.initialPageNumber
    });
    const [visibleWindow, setVisibleWindow] = useState<string>("");
    const [filterConditions, setFilterConditions] = useState<any>(
        searchParams.has("filter") ? 
        JSON.parse(decodeURIComponent(searchParams.get("filter") ?? "%257B%257D")) :
        {}
    );
    // const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    useEffect(() => {

        setFilterConditions(searchParams.has("filter") ? 
        JSON.parse(decodeURIComponent(searchParams.get("filter") ?? "%257B%257D")) :
        []);

        // return () => { setFilterConditions([]); };
    }, [searchParams]);

    useEffect(() => {
        let found_form = forms.find((frm: any) => (frm.id == props.formName && Utils.roleCheck(loggedUser.Roles, frm.readRoles)));
        // console.log("found form", found_form);
        if (found_form) {
            found_form.fields = Object.values(found_form.fields);
            // if (found_form && found_form.roles.includes(loggedUser.Roles[0])) {
            setForm(found_form);
            // setFilterConditions({ ...filterConditions, ...props.condition });
            // setSearchParams({filter: encodeURIComponent(JSON.stringify({ ...filterConditions, ...props.condition }))})
            // setPageSetting({
            //     pageSize: 10,
            //     pageNumber: 1
            // });
            // getData(found_form);
        } else {
            setRecords({
                Items: [],
                PageNumber: 1,
                PageSize: 25,
                TotalCount: 0
            });
            setForm(null);
        }
    }, [props]);

    useEffect(() => {
        getData();
    }, [form, pageSetting]);

    useEffect(() => {
        // if(!props.isRelatedList) {

        //     console.log(filterConditions, encodeURIComponent(JSON.stringify(filterConditions)), "set data");
        //     // setSearchParams({flt: encodeURIComponent(JSON.stringify(filterConditions))});
        //     setSearchParams({filter: encodeURIComponent(JSON.stringify(filterConditions))});
        // }
        getData();
    }, [filterConditions]);

    const getData = async (form_given?: any) => {

        setTimeout(() => {setShowWaiting(true)}, 100);

        let cond = { ...filterConditions, ...props.condition };

        if (form_given && form_given?.listLoader) {
            setRecords(await onListLoadFunction[form_given.listLoader](cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, cond, form?.id));
        } else if (form?.listLoader) {
            setRecords(await onListLoadFunction[form.listLoader](cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, cond, form?.id));
        } else {
            setRecords({ Items: [], PageNumber: pageSetting.pageNumber, PageSize: pageSetting.pageSize, TotalCount: 0 });
        }

        setTimeout(() => {setShowWaiting(false)}, 100);

    }

    const goToForm = (id: number) => {
        navigate(`/form/${props.formName}/${id}`);
    }

    const openWindow = (winId = "") => {
        setVisibleWindow(winId);
    }

    const nextPage = () => {
        if (records.TotalCount / pageSetting.pageSize > pageSetting.pageNumber) {
            setPageSetting({ ...pageSetting, pageNumber: pageSetting.pageNumber + 1 });
            if(!props.isRelatedList) {
                navigate(`/list/${props.formName}/${pageSetting.pageNumber + 1}?filter=${encodeURIComponent(JSON.stringify(filterConditions))}`)
            }
        }
    }

    const previousPage = () => {
        if (pageSetting.pageNumber != 1) {
            setPageSetting({ ...pageSetting, pageNumber: pageSetting.pageNumber - 1 });
            if(!props.isRelatedList) {
                navigate(`/list/${props.formName}/${pageSetting.pageNumber - 1}?filter=${encodeURIComponent(JSON.stringify(filterConditions))}`)
            }
        }
    }

    const deleteSelected = async () => {
        if (window.confirm("Are you sure? all selected records will be deleted.")) {
            console.log('selectedIds', selectedIds);
           await MainAPI.deleteList(cookies.login_token, (form?.id ?? ""), selectedIds)
          
            setSelectedIds([]);
            setRecords(recs => ({ ...recs, Items: records.Items.filter(rc => selectedIds.includes(rc.id)) }));
            // console.log("deletion confirmed ", selectedIds);
            setAlert(`${selectedIds.length} `, "success");
        }

    };

    const handlePrint =  useReactToPrint({
        contentRef: printRef,
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
        <div className="w-100 h-100 zpanel" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="px-1">
                {
                    form ? (<div className="d-flex justify-content-between align-items-center py-1 border-bottom">
                        <div className="d-flex">
                            <h5 className="card-title me-3 fs-6" style={{ fontWeight: "700" }}>{form.title}</h5>
                            {/* <button className={`btn ${filterQuery != "" ? "btn-primary" : "btn-light"} btn-sm shadow-sm`} title="filter" onClick={() => { openWindow("filter"); }}>
                                <FilterAltIcon sx={{ fontSize: 20 }} />
                            </button> */}
                        </div>
                        <div>

                            <div className="btn-group">
                                <div className="dropdown me-3">
                                    <span className="card-title text-muted me-3" style={{color: "var(--text_color) !important", fontSize: "13px"}}>{pageSetting.pageSize} Per page</span>
                                    <button className="btn btn-outline-secondary btn-sm dropdown-toggle py-0" style={{fontSize: "13px"}} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Show
                                    </button>
                                    <ul className="dropdown-menu zpanel">
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 3})}}>3 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 5})}}>5 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 15})}}>15 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 25})}}>25 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 35})}}>35 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 50})}}>50 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 75})}}>75 Records</button></li>
                                        <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 100})}}>100 Records</button></li>
                                    </ul>
                                </div>
                                <div className="">
                                    <button className="btn btn-outline-secondary rounded-1 btn-sm py-0" style={{fontSize: "13px"}} onClick={() => { openWindow("filter");}}>
                                        Filters
                                        {/* <KeyboardArrowDownIcon sx={{fontSize: 15}} /> */}
                                    </button>
                                </div>
                                <div className="">
                                    <button className="btn btn-outline-secondary btn-sm py-0 rounded-1 mx-3" style={{fontSize: "13px"}} type="button" onClick={() => { getData(); }}>
                                        <Refresh style={{fontSize: 13, top: 0, transform: "translateY(-14%)"}} />
                                    </button>
                                </div>
                                <div className="">
                                    {
                                        (selectedIds.length > 0) && (
                                            <button
                                                className="btn btn-danger btn-sm me-3 py-0"
                                                style={{fontSize: "13px"}}
                                                onClick={() => { deleteSelected(); }}
                                            >
                                                <DeleteIcon style={{fontSize: 13, top: 0, transform: "translateY(-14%)"}} className="me-1" />
                                                Delete
                                            </button>
                                        )
                                        // (selectedIds.length > 0 && loggedUser.Roles.includes(UserRoles.ADMIN)) && (<button className="btn btn-danger btn-sm me-3" onClick={() => { deleteSelected(); }}>Delete</button>)
                                    }
                                </div>
                                <div className="">
                                    <button className="btn btn-sm zbtn-outline rounded-1 me-3 py-0" style={{fontSize: "13px"}} onClick={handlePrint}>
                                        <PrintIcon style={{fontSize: 13, top: 0, transform: "translateY(-14%)"}} />
                                    </button>
                                </div>
                                <div className="">
                                    {Utils.roleCheck(loggedUser.Roles, (form?.writeRoles ?? [])) && (
                                        <button className="btn btn-sm zbtn rounded-1 py-0" style={{fontSize: "13px"}} onClick={() => goToForm(-1)}>
                                            <AddIcon style={{fontSize: 13}} /> New
                                        </button>
                                    )}
                                </div>

                                {/* <button className="btn btn-outline-primary rounded-1 me-3" onClick={() => { goToForm(-1) }}>Import Orders</button> */}
                            </div>
 
                        </div>
                    </div>) : (<></>)
                }
            </div>

            {
                form ? (<div className={props.isRelatedList ? "w-100" : "h-100 w-100"} style={{ overflow: "auto" }}>
                    {
                        showWaiting ? (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <div className="spinner-border" style={{color: 'var(--button_bg)'}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-100" ref={printRef}>
                                <ListComponent 
                                    tableId={form.id}
                                    cols={form?.fields.filter((fld: any) => (!fld.notOnList && Utils.roleCheck(loggedUser.Roles, fld.readRoles)))}
                                    rows={records ? records.Items : []}
                                    selector={goToForm}
                                    emitOnSelect={(recs => { setSelectedIds(recs) })}
                                    idColumn={form.idColumn}
                                    realId={form.realId}
                                    keys={form.keys}
                                />
                            </div>
                        )
                    }
                </div>) : ("")
                // </div>) : (<div className="h-100 container p-3"><Empty message="List Not Available! It is may be because you have no role on this! Contanct your administrator to fix this issue." /></div>)
            }
            {
                form && !form.hidePagination ? (<div className="d-flex justify-content-center p-2 border-top">
                    <div className="btn-group">
                        <button className="btn btn-sm zbtn py-0" style={{fontSize: "13px"}} onClick={previousPage}>Previous</button>
                        <input
                            value={pageSetting.pageNumber}
                            onChange={(event) => { setPageSetting({ ...pageSetting, pageNumber: parseInt(event.target.value) }) }}
                            type="number"
                            className="form-control form-control-sm zinput py-0"
                            style={{ width: "75px", fontSize: "13px" }}
                            placeholder="Page"
                        />
                        <button className="btn btn-sm zbtn py-0" style={{fontSize: "13px"}}>/{(records?.Items ? Math.ceil(records.TotalCount / pageSetting.pageSize) : 1)}</button>
                        <button className="btn btn-sm zbtn py-0" onClick={nextPage} style={{fontSize: "13px"}}>Next</button>
                    </div>
                </div>) : (<></>)
            }

            {
                (form && visibleWindow == "filter") ? (
                    <FilterWindow
                        form={form}
                        closeWindow={() => { openWindow() }}
                        conditions={filterConditions}
                        filter={(conditions) => {
                            // setSearchParams(`/list/${props.formName}/${pageSetting.pageNumber}?filter=${encodeURIComponent(JSON.stringify(conditions))}`);
                            if(!props.isRelatedList) {
                                setSearchParams({filter: encodeURIComponent(JSON.stringify(conditions))});
                            } else {
                                setFilterConditions(conditions);
                            }
                            openWindow()
                        }}
                    />
                ) : (<></>)
            }
            {/* {showWaiting ? (<Waiting />) : ""} */}
        </div>
    );
}

export default TablePage;