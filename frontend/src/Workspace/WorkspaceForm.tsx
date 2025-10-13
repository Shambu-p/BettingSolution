import React, { useContext, useEffect, useState } from "react";
import IField from "../Intefaces/IField";
import { useNavigate, useParams } from "react-router-dom";
import IForm from "../Intefaces/IForm";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import FieldTypes from "../Enums/FiedTypes";
import { authFileRequest, Authorized, props, Request } from "../APIs/api";
import IRelatedList from "../Intefaces/IRelatedList";
import IFormAction from "../Intefaces/IFormAction";
import CustomeSelectBox from "../Components/Reusables/CustomeSelectBox";
import ScriptEditor from "../Components/Reusables/ScriptEditor";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SelectOrAddField from "../Components/Reusables/SelectOrAddField";
import { isMobile } from "react-device-detect";
import MainAPI from "../APIs/MainAPI";
import UserRoles from "../Enums/UserRoles";
import TablePage from "../Views/TablePage";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// import Empty from "../Components/Extra/Empty";
// import TablePage from "./TablePage";
import PushPinIcon from '@mui/icons-material/PushPin';
// import UserRoles from "../Enums/UserRoles";
// import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
// import CustomeSelectBox from "../Components/Reusables/CustomeSelectBox";
import { Refresh, WindowSharp } from "@mui/icons-material";
import onFormLoadFunction from "../Scripts/onFormLoadFunction";
import onSubmitFunction from "../Scripts/onSubmitFunctions";
import Utils from "../Models/Utils";
import buttonAction from "../Scripts/buttonAction";
import fieldOnChange from "../Scripts/fieldOnChange";
import Operators from "../Enums/Operators";
import actionCondition from "../Scripts/actionCondition";
import WorkspaceTable from "./WorkspaceTable";
import FormAttachment from "../Components/Reusables/FormAttachment";
import RecordActivity from "../Components/Reusables/RecordActivity";


function WorkspaceForm(properties: {
    workspaceParams: {
        title: string,
        id: string,
        is_selected: true,
        type: string,
        table: string,
        dashboard_id: string,
        rec_id: string,
        filter: string,
        pageNumber: string,
        link: string
    },
    workspaceNavigation: (data: any) => void,
    updateWindowData: (id: string, data: any) => void
}) {

    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    // const [fields, setFields] = useState<IField[]>([]);
    const [form, setForm] = useState<any>();
    // const [fieldValues, setFieldValues] = useState<any>({});
    const [currentRelatedList, setCurrentRelatedList] = useState<string>("");
    const [allRelatedList, setAllRelatedList] = useState<any[]>([]);
    // const [recordAttachments, setRecordAttachments] = useState<any[]>([]);
    const [recordActivities, setRecordActivities] = useState<any[]>([]);
    const [urlParams, setURLParams] = useState<any>({});
    const [localWaiting, setShowWaiting] = useState<boolean>(false);

    const [attachment, setAttachment] = useState<{
        content: any,
        extension: string,
        name: string
    }>({
        content: null,
        name: "",
        extension: ""
    });

    const params = useParams();
    const navigate = useNavigate();

    const prepareForm = async () => {

        setTimeout(() => {setShowWaiting(true);  properties.updateWindowData(properties.workspaceParams.id, {title: "Loading..."});}, 10);
        let spec = getFormSpec(properties.workspaceParams.table ?? "");
        // if (!spec.roles.includes(loggedUser.Roles[0])) {
        //     setFieldValues({});
        //     return;
        // }
        let new_fields = await onFormLoadFunction[spec.onload](cookies.login_token, spec.fields, localData, loggedUser, properties.workspaceParams.rec_id, spec.id);
        let real_id_field = new_fields.find((fld: any) => (fld.id == spec.idColumn))
        console.log("organized data", new_fields);
        spec.fields = new_fields;
        // let temp_fields: any = {};
        let temp_fields: any = new Object();
        new_fields.forEach(({id, value}: { id: string, value: any }) => {
            // temp_fields[id] = value;
            Object.defineProperty(temp_fields, id, {
                value: value,
                writable: true,
            });
        })
        // console.log("new_fields", new_fields)
        // console.log("inputs", temp_fields)
        // setFieldValues(temp_fields);
        setForm(spec);
        setAllRelatedList(spec.relatedList);
        if(Utils.roleCheck(loggedUser.Roles, spec.activityRoles)) {
            loadActivities();
        }
        setCurrentRelatedList(spec.relatedList.length > 0 ? spec.relatedList[0].id : "");

        setTimeout(() => {setShowWaiting(false); properties.updateWindowData(properties.workspaceParams.id, {title: ((real_id_field && real_id_field.value) ? real_id_field.value : `${spec.title} Form`)});}, 10);
    }

    const onWillUnmount = () => {
        setForm(undefined);
        setAttachment({
            content: null,
            name: "",
            extension: ""
        });
        setCurrentRelatedList("");
        setAllRelatedList([]);
        setURLParams({});
    };

    useEffect(() => {
        return () => {onWillUnmount(); };
    }, [properties.workspaceParams.id, properties.workspaceParams.table, properties.workspaceParams.rec_id]);

    useEffect(() => {

        // console.log("url param changed", urlParams);
        prepareForm();

    }, [properties.workspaceParams.id, properties.workspaceParams.table, properties.workspaceParams.rec_id]);

    // useEffect(() => {

    //     // console.log("param changed", params);
    //     if(urlParams.name != params.name || urlParams.r_id != params.r_id) {
    //         setURLParams(params);
    //     }

    // }, [params]);

    const fieldSetter = (index: number, value: IField) => {

        // console.log(`changing ${index} to `, value);
        if(form) {
            let temp = {...form};
            let new_value = ((temp.fields[index].type == FieldTypes.NUMBER) ? (Number.isInteger(temp.fields[index].value) ? parseInt(value.value) : parseFloat(value.value)) : value.value)
            temp.fields[index] = {...value, value: new_value};
            setForm(temp);
        }

    }

    const readFileAsDataURL = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            // When reading is complete, resolve the promise with the data URL
            reader.onload = () => resolve(reader.result);
    
            // If an error occurs, reject the promise
            reader.onerror = () => reject(new Error('Error reading file'));
    
            // Read the file as a Data URL
            reader.readAsDataURL(file);
        });
    }

    const getFileExtension = (file: any) => {
        if (!file) {
          return null; // No file selected
        }

        const fileName = file.name.split('.');

        return (fileName.length > 1) ? (fileName.pop().toLowerCase()) : (""); // Extract extension
    }

    // console.log("temporary value ", form?.fields);

    const submitForm = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response = await onSubmitFunction[form.onsubmit](cookies.login_token, form.fields, (form.id ?? ""));
            // setAlert("Record Created Successfully", "success");
            setAlert(response.message, "success");
            // window.history.back();
            // navigate(`/list/${params.name}`);
            // console.log("the form", form?.fields);
            // console.log("the values", fieldValues);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);


    }
    const insertAndStay = async (event: any) => {

        event.preventDefault();
        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {

            let response = await onSubmitFunction[form.onsubmit](cookies.login_token, form.fields, form.id);
            setAlert(response.message, "success");

            properties.updateWindowData(properties.workspaceParams.id, {
                title: "Loading...",
                type: "form",
                rec_id: response[form?.realId ?? "id"]
            });

            // navigate(`/form/${params.name}/${response[form?.realId ?? "id"]}`);

        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);

    }

    const getFormSpec = (form_name: string): any => {

        let found_form = forms.find((frm: any) => (frm.id == form_name));
        if (!found_form) {
            throw new Error("Form not found");
        }

        let cloned = JSON.parse(JSON.stringify(found_form));
        cloned.fields = Object.values(cloned.fields);
        return cloned;
        // found_form.fields = Object.values(found_form.fields);
        // return found_form;
    }

    const actionCall = async (formAction: any, frm: any) => {
        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response: any = await buttonAction[formAction.action](
                cookies.login_token,
                frm.fields,
                loggedUser,
                (navData: any) => {
                    properties.workspaceNavigation({
                        id: navData.routeAddress,
                        title: "Loading...",
                        type: navData.type,
                        table: navData.table,
                        rec_id: navData.record_id,
                        dashboard_id: navData.page_id,
                        data: {
                            routeData: navData.routeData,
                            dataPassed: navData.dataPassed
                        }
                    });
                },
                (form?.id ?? "")
            );
            setAlert(response.message, "success");
            // setAlert("Action Successful", "success");
            setTimeout(() => {
                setWaiting(false);
            }, 1);

            if(!formAction.stayOnForm) {
                window.history.back();
            } else {
                prepareForm();
                // navigate(`/form/${params.name}/${response[(frm.realId ?? "id")]}`);
                // let id_field = frm.fields.find((fld: any) => (fld.id == frm.realId));
                // if(id_field) {
                //     prepareForm();
                //     response[form?.realId ?? "id"]
                // }
            }
        } catch (error: any) {
            setAlert(error.message, "error");
            setTimeout(() => { setWaiting(false); }, 1);
        }
    }

    // const addAttachment = async (event: any) => {

    //     event.preventDefault();

    //     setTimeout(() => {
    //         setWaiting(true);
    //     }, 1);
        
    //     try {
    //         if(!attachment.content) {
    //             setAlert("Select a file to attach", "error");
    //             setTimeout(() => {
    //                 setWaiting(false);
    //             }, 1);
    //             return;
    //         }
            
    //         if(attachment.name == "") {
    //             setAlert("fill attachment name", "error");
    //             setTimeout(() => {
    //                 setWaiting(false);
    //             }, 1);
    //             return;
    //         }

    //         // let extension = ;

    //         if(attachment.extension == "") {
    //             setAlert("unknow file type", "error");
    //             setTimeout(() => {
    //                 setWaiting(false);
    //             }, 1);
    //             return;
    //         }

    //         let response = await Authorized(cookies.login_token).bodyRequest(
    //             "post",
    //             "file/create",
    //             {
    //                 content: attachment.content,
    //                 name: attachment.name,
    //                 file_name: attachment.name,
    //                 table: params?.name,
    //                 extension: (['jpg', 'jpeg', 'png', 'webp'].includes(attachment.extension) ? `image/${attachment.extension}` : `application/${attachment.extension}`),
    //                 record: params?.r_id
    //             }
    //         );
    //         // await form?.onsubmit(cookies.login_token, form.fields);
    //         setAlert("Attachment added Successfully", "success");
    //         setRecordAttachments(att => ([...att, response]));
    //         // navigate(`/list/${params.name}`);
    //     } catch (error: any) {
    //         setAlert(error.message, "error");
    //     }

    //     setWaiting(false);

    // };

    // const loadAttachment = async () => {
    //     let response = await MainAPI.loadAttachments(cookies.login_token, params?.name ?? "unknown", params?.r_id ?? "0");
    //     setRecordAttachments(rat => (response.Items));
    //     // setRecordAttachments(rat => []);
    // }

    const loadActivities = async () => {
        let response = await MainAPI.loadActivities(cookies.login_token, params?.name ?? "unknown", params?.r_id ?? "0");
        console.log("activities loaded ", response.Items);
        setRecordActivities(rat => (response.Items));
    }

    // const attachmentOnChange = async (event: any) => {
    //     // console.log((event.target.name == "file" ? event.target.files : event.target.value));
    //     let fl = event.target;
    //     if(event.target.name == "file") {
    //         let encoded_file = await readFileAsDataURL(fl.files[0]);
    //         setAttachment(att => ({ ...att, content: encoded_file, extension: getFileExtension(fl.files[0]) }));
    //     } else {
    //         setAttachment(att => ({ ...att, [fl.name]: fl.value }))
    //     }
    // };

    const goToReference = (ref_id: any, ref_table: string) => {
        properties.workspaceNavigation({
            title: "Loading...",
            type: "form",
            table: ref_table,
            rec_id: ref_id
        });
        // navigate(`/form/${ref_table}/${ref_id}`);
    }

    // const getAttachmentIcon = (record: any) => {

    //     console.log("extension ", record.extension, record.extension.indexOf("image/"));

    //     if(record.extension.indexOf("image/") > -1) {
    //         return (<img src={`${props.baseURL}file/${record.sys_id}`} className="w-100" alt="attached image" />)
    //     } else if (record.extension.indexOf("/pptx") > -1 || record.extension.indexOf("/ppt") > -1) {
    //         return (<img src={`${props.baseURL}file/${record.sys_id}`} className="w-100" alt="attached image" />)
    //     } else if (record.extension.indexOf("/doc") > -1 || record.extension.indexOf("/docs") > -1) {
    //         return (<img src="/images/word.png" className="w-100" alt="attached image" />)
    //     } else if (record.extension.indexOf("/xlsx") > -1 || record.extension.indexOf("/xls") > -1) {
    //         return (<img src="/images/excel.svg" className="w-100" alt="attached image" />)
    //     } else if(record.extension == "application/pdf") {
    //         return (<img src="/images/pdf-1.png" className="w-100" alt="attached file" />)
    //     } else {
    //         return (<img src="/images/unknow_file_type_no_bg.png" className="w-100" alt="attached image" />)
    //     }

    // }

    const getRelatedListCondition = (relation: any) => {

        let found_spec = getFormSpec(relation.table);

        if(!found_spec) {
            return null;
        }

        let found_sys_id = form.fields.find((fld: any) => (fld.id == "sys_id"));
        let found_column = found_spec.fields.find((fld: any) => (fld.id == relation.column_id));

        if(!found_sys_id || !found_column) {
            console.log("sys id field and child table relation column not found");
            return null;
        }

        return {
            ...(relation.condition ?? {}),
            [found_column.id]: {
                operator: Operators.IS,
                value: found_sys_id.value,
                type: found_column.type
            }
        };

    }

    return (
        <div className="zpanel w-100 h-100">
            {
                localWaiting ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border" style={{color: 'var(--button_bg)'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (

                    <div className="w-100 zpanel h-100" style={{overflow: "hidden", display: "flex", flexDirection: "column"}}>
                        {(form) ? (
                            <div className="d-flex justify-content-between align-itmes-center pt-2 pb-2 ps-4 pe-4" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}} >
                                <div className="d-flex" style={{width: "max-content"}}>
                                    <h5 className="card-title">{form?.title}</h5>
                                    {
                                        (properties.workspaceParams.rec_id != "-1") && (
                                            <button
                                                className="btn btn-outline-secondary btn-sm py-0 rounded-1 ms-3"
                                                style={{fontSize: "13px"}}
                                                type="button"
                                                onClick={() => { prepareForm(); }}
                                            >
                                                <Refresh sx={{fontSize: 13}} />
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="btn-groups">

                                    {
                                        form.actions.map((action: any) => (((properties.workspaceParams.rec_id == "-1" && action.showOnNewForm) || (properties.workspaceParams.rec_id != "-1")) && Utils.roleCheck(loggedUser.Roles, action.roles) && ((!action.condition) || (action.condition && (actionCondition[action.condition](cookies.login_token, form.fields, loggedUser))))) ? (
                                        // form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && ((!action.condition) || (action.condition && (action.condition("cookies.login_token", form.fields, null))))) ? (
                                            <button className={`btn btn-sm me-3 small_text ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                                        ) : (<></>))
                                    }
                                    {
                                        (properties.workspaceParams.rec_id == "-1") &&
                                        (<button className="btn zbtn btn-sm me-3 small_text" onClick={submitForm} >Submit</button>)
                                    }
                                    {
                                        (properties.workspaceParams.rec_id == "-1") &&
                                        (<button className="btn zbtn-outline btn-sm small_text" onClick={insertAndStay} >Save Stay</button>)
                                    }
                                </div>
                            </div>) : (<></>)}
                        {form ? (
                            <div className="row p-0 m-0 h-100" style={{position: "relative"}}>

                                <div className={(properties.workspaceParams.rec_id != "-1" && Utils.roleCheck(loggedUser.Roles, form.canReadAttachment)) ? "col-sm-12 col-md-12 col-lg-9 h-100 pb-3" : "col-12 h-100 pb-3"} style={{overflowX: "hidden", overflowY: "auto"}}>
                                    <div className="container py-3">
                                        <div className="form_section w-100 mb-4">
                                            <div className="row m-0 p-0">
                                                {
                                                    form?.fields.map((field: any, field_index: number) => {
                                                        if (!field.visible) {
                                                            return <></>;
                                                        } else {
                                                            if ([FieldTypes.TEXT, FieldTypes.EMAIL, FieldTypes.PASSWORD, FieldTypes.DATE, FieldTypes.DATETIME, FieldTypes.SELECTCOLOR].includes(field.type)) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <input
                                                                                id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                placeholder={field.label}
                                                                                type={field.type}
                                                                                value={field.value}
                                                                                className="form-control form-control-sm zinput"
                                                                                required={field.required}
                                                                                disabled={field.readonly}
                                                                                readOnly={field.readonly}
                                                                                title={field.description}
                                                                                style={{fontSize: "13px"}}
                                                                                data-bs-toggle="tooltip" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?"
                                                                                onChange={async (event: any) => {
                                                                                    let new_value = event.target.value;
                                                                                    await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter);
                                                                                    let tmp = field;
                                                                                    if(field.type == FieldTypes.NUMBER) {
                                                                                        tmp.value = Number.isInteger(new_value) ? parseInt(new_value) : parseFloat(new_value);
                                                                                    } else {
                                                                                        tmp.value = new_value;
                                                                                    }
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}
                                                                                
                                                                                onFocus={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if ([FieldTypes.FLOAT, FieldTypes.DOUBLE, FieldTypes.NUMBER].includes(field.type)) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <input
                                                                                id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                placeholder={field.label}
                                                                                type="number"
                                                                                value={field.value}
                                                                                className="form-control form-control-sm zinput"
                                                                                required={field.required}
                                                                                disabled={field.readonly}
                                                                                readOnly={field.readonly}
                                                                                title={field.description}
                                                                                style={{fontSize: "13px"}}
                                                                                data-bs-toggle="tooltip" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?"
                                                                                onChange={async (event: any) => {
                                                                                    let new_value = event.target.value;
                                                                                    await fieldOnChange[field.onChange]("cookies.login_token", form.fields, new_value, fieldSetter);
                                                                                    let tmp = field;
                                                                                    if(field.type == FieldTypes.NUMBER) {
                                                                                        tmp.value = Number.isInteger(new_value) ? parseInt(new_value) : parseFloat(new_value);
                                                                                    } else {
                                                                                        tmp.value = new_value;
                                                                                    }
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}
                                                                                
                                                                                onFocus={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.REFERENCE == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <div className="d-flex w-100">
                                                                                <CustomeSelectBox
                                                                                    id={form.realId ?? "id"}
                                                                                    references={field.references ?? ""}
                                                                                    token={cookies.login_token}
                                                                                    title={field.description}
                                                                                    options={field.referenceCondition ?? {}}
                                                                                    givenValue={field.value}
                                                                                    disabled={field.readonly}
                                                                                    displayField={field.displayField ?? "id"}
                                                                                    displayFieldCalculator={field.displayFieldCalculator}
                                                                                    onChange={async (event: any) => {
                                                                                        let new_value = event;
                                                                                        let tmp = {...field};
                                                                                        await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                        tmp.value = new_value.value;
                                                                                        fieldSetter(field_index, tmp);
                                                                                    }}
                                                                                    openForm={() => {properties.workspaceNavigation({
                                                                                        title: "Loading...",
                                                                                        type: "form",
                                                                                        table: field.references,
                                                                                        rec_id: "-1"
                                                                                    })}}

                                                                                    onFocus={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "";
                                                                                        }
                                                                                    }}
                
                                                                                    onBlur={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "none";
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                {
                                                                                    (properties.workspaceParams.rec_id != "-1" && field.value) && (
                                                                                        <button 
                                                                                            className="btn btn-sm btn-light ms-2 shadow-sm border"
                                                                                            title="Open this record"
                                                                                            onClick={() => {
                                                                                            goToReference(field.value, (field.references ? field.references : ""))
                                                                                        }}>
                                                                                            <InfoOutlinedIcon sx={{fontSize: "15px"}} />
                                                                                        </button>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.SELECTORADD == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <div className="d-flex w-100">
                                                                                <SelectOrAddField
                                                                                    id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                    title={field.description}
                                                                                    options={field.options ?? []}
                                                                                    givenValue={field.value}
                                                                                    disabled={field.readonly}
                                                                                    onChange={async (event: any) => {
                                                                                        let new_value = event;
                                                                                        let tmp = {...field};
                                                                                        await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                        tmp.value = new_value.value;
                                                                                        fieldSetter(field_index, tmp);
                                                                                    }}

                                                                                    onFocus={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "";
                                                                                        }
                                                                                    }}
                
                                                                                    onBlur={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "none";
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                {/*
                                                                                    (params.r_id != "-1" && Number.isInteger(field.value)) && (
                                                                                        <button className="btn btn-light ms-2 shadow-sm" onClick={() => {
                                                                                            goToReference(parseInt(field.value), field.references ?? "")
                                                                                        }}>
                                                                                            { <PushPinIcon /> }
                                                                                        </button>
                                                                                    )
                                                                                */}
                                                                            </div>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.SELECT == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <div className="d-flex w-100">
                                                                                <select
                                                                                    id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                    title={field.description}
                                                                                    className="form-control form-control-sm zinput"
                                                                                    value={field.value}
                                                                                    required={field.required}
                                                                                    disabled={field.readonly}
                                                                                    style={{fontSize: "13px"}}
                                                                                    onChange={async (event: any) => {
                                                                                        let new_value = event.target.value;
                                                                                        let vl = await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                        let tmp = {...field};
                                                                                        tmp.value = vl;
                                                                                        fieldSetter(field_index, tmp);
                                                                                    }}

                                                                                    onFocus={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "";
                                                                                        }
                                                                                    }}
                
                                                                                    onBlur={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "none";
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="">None</option>
                                                                                    {localData.Choices.filter((ch: any) => (ch.id == `${form.id}.${field.id}`)).map((option: any) => {
                                                                                        return (
                                                                                            (field.value == option.value) ?
                                                                                                (<option value={option.value} selected>{option.label}</option>) :
                                                                                                (<option value={option.value}>{option.label}</option>)
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                            </div>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.BOOLEAN == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text">
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <div className="d-flex w-100">
                                                                                <select
                                                                                    id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                    title={field.description}
                                                                                    className="form-control form-control-sm zinput"
                                                                                    value={field.value}
                                                                                    required={field.required}
                                                                                    disabled={field.readonly}
                                                                                    style={{fontSize: "13px"}}
                                                                                    onChange={async (event: any) => {
                                                                                        let new_value = event.target.value;
                                                                                        let vl = await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                        let tmp = {...field};
                                                                                        tmp.value = vl;
                                                                                        fieldSetter(field_index, tmp);
                                                                                    }}

                                                                                    onFocus={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "";
                                                                                        }
                                                                                    }}
                
                                                                                    onBlur={() => {
                                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                                        if(element) {
                                                                                            element.style.display = "none";
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="none" >None</option>
                                                                                    <option value="true" >True</option>
                                                                                    <option value="false" >False</option>
                                                                                </select>
                                                                            </div>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.IMAGE == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-sm-12 col-md-6 col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text" id={`input_label_${field.id}`}>
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            {(field.displayValue != "") && (<img src={field.displayValue} className="rounded my-2" style={{ width: "100%", height: "auto" }} alt="attachement" />)}
                                                                            <input
                                                                                id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                type="file"
                                                                                title={field.description}
                                                                                className="form-control form-control-sm zinput"
                                                                                required={field.required}
                                                                                disabled={field.readonly}
                                                                                readOnly={field.readonly}
                                                                                style={{fontSize: "13px"}}
                                                                                onChange={async (event: any) => {
                                                                                    let tmp = field;
                                                                                    // tmp.value = await field.onchange(cookies.login_token, form.fields, event.target, fieldSetter);
                                                                                    tmp.displayValue = await readFileAsDataURL(event.target.files[0]);
                                                                                    tmp.value = event.target;
                                                                                    // console.log("temporary data ", tmp);
                                                                                    // tmp.value = "event.target.value";
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}
                                                                                onFocus={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.SCRIPT == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text" id={`input_label_${field.id}`}>
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <div className="w-100 border-bottom pb-1 mb-1">
                                                                                <button className="btn btn-sm btn-dark" style={{fontSize: "13px"}} onClick={() => {
                                                                                    fieldSetter(field_index, {...field, editorExpanded: true});
                                                                                }}>Expand</button>
                                                                            </div>
                                                                            {
                                                                                field.editorExpanded ? (
                                                                                    <ScriptEditor
                                                                                        onExit={(new_value: string) => {
                                                                                            fieldSetter(field_index, {...field, value: new_value, editorExpanded: false});
                                                                                        }}
                                                                                        scriptValue={field.value}
                                                                                    />
                                                                                ) : ""
                                                                            }
                                                                            <textarea
                                                                                id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                placeholder="body"
                                                                                style={{ height: "150px", fontSize: "13px"}}
                                                                                className="form-control form-control-sm zinput"
                                                                                title={field.description}
                                                                                value={field.value}
                                                                                required={field.required}
                                                                                disabled={field.readonly}
                                                                                readOnly={field.readonly}
                                                                                onChange={async (event: any) => {
                                                                                    let tmp = {...field};
                                                                                    let new_value = event.target.value;
                                                                                    await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                    // tmp.value = event.target.value;
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}

                                                                                onFocus={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {field.value}
                                                                            </textarea>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.RICHTEXT == field.type) {

                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text" id={`input_label_${field.id}`}>
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <CKEditor
                                                                                editor={ClassicEditor}
                                                                                data={field.value}
                                                                            
                                                                                onChange={async (event, editor) => {
                                                                                    // const data = editor.getData();
                                                                                    let new_value = editor.getData();
                                                                                    let tmp = field;
                                                                                    await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                    tmp.value = new_value;
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}
                                                                                onFocus={(ev, ed) => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={(ev, ed) => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            
                                                                            />
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            if (FieldTypes.TEXTAREA == field.type) {
                                                                return (
                                                                    <div key={`${field.id}_${properties.workspaceParams.rec_id}`} className="col-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label small_text" id={`input_label_${field.id}`}>
                                                                                {(field.required) && (<b style={{color: "red", marginRight: "8px"}}>*</b>)}
                                                                                {field.label}
                                                                            </label>
                                                                            <textarea
                                                                                id={`${field.id}_${properties.workspaceParams.rec_id}`}
                                                                                placeholder="body"
                                                                                style={{ height: "150px", fontSize: "13px"}}
                                                                                className="form-control form-control-sm zinput"
                                                                                title={field.description}
                                                                                required={field.required}
                                                                                disabled={field.readonly}
                                                                                readOnly={field.readonly}
                                                                                onChange={async (event: any) => {
                                                                                    let new_value = event.target.value;
                                                                                    let tmp = {...field};
                                                                                    tmp.value = new_value;
                                                                                    await fieldOnChange[field.onChange](cookies.login_token, form.fields, new_value, fieldSetter, localData);
                                                                                    fieldSetter(field_index, tmp);
                                                                                }}

                                                                                onFocus={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "";
                                                                                    }
                                                                                }}

                                                                                onBlur={() => {
                                                                                    let element = document.getElementById(`${field.id}_help`);
                                                                                    if(element) {
                                                                                        element.style.display = "none";
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {field.value}
                                                                            </textarea>
                                                                            <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        }
                                                    })
                                                }

                                            </div>

                                            {
                                                (properties.workspaceParams.rec_id == "-1") &&
                                                (<button type="button" className="btn zbtn btn-sm ms-3" onClick={submitForm} >Submit</button>)
                                            }
                                            {
                                                form.actions.map((action: any) => (((properties.workspaceParams.rec_id == "-1" && action.showOnNewForm) || (properties.workspaceParams.rec_id != "-1")) && !action.notBelow && Utils.roleCheck(loggedUser.Roles, action.roles) && ((!action.condition) || (action.condition && (actionCondition[action.condition](cookies.login_token, form.fields, loggedUser))))) ? (
                                                    <button className={`btn btn-sm me-3 small_text ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                                                ) : (<></>))
                                            }
                                        </div>

                                        {
                                            (Utils.roleCheck(loggedUser.Roles, form.activityRoles) && properties.workspaceParams.rec_id != "-1") && (
                                                <RecordActivity recordId={properties.workspaceParams.rec_id} tableName={properties.workspaceParams.table} />
                                            )
                                        }

                                        {(allRelatedList.length > 0 && properties.workspaceParams.rec_id != "-1") ? (
                                            <div className="w-100">
                                                <ul className="nav nav-tabs">
                                                    {allRelatedList.map(rl => (<li key={`rl_selector_${rl.id}`} className="nav-item p-0 zpanel">
                                                        <button
                                                            className={`btn btn-sm py-1 ${rl.id == currentRelatedList ? "zbtn" : "zbtn-outline"}`}
                                                            aria-current="page"
                                                            style={{fontSize: "14px", borderRadius: 0, borderTopRightRadius: "7px", borderTopLeftRadius: "7px"}}
                                                            onClick={() => { setCurrentRelatedList(rl.id); }}
                                                        >
                                                            {rl.label}
                                                        </button>
                                                    </li>))}
                                                </ul>
                                                {
                                                    allRelatedList.map(rl => (<div
                                                        key={`rl_body_${rl.id}`}
                                                        className="w-100 p-2"
                                                        style={{ display: (rl.id == currentRelatedList ? "" : "none") }}
                                                    >
                                                        <WorkspaceTable 
                                                            formName={rl.table}
                                                            // parentValue={form.fields.find((fld: any) => fld.id == "id")?.value}
                                                            isRelatedList={true}
                                                            condition={getRelatedListCondition(rl) ?? {}}
                                                            initialPageNumber={1}
                                                            workspaceParams={{
                                                                ...properties.workspaceParams,
                                                                type: "list",
                                                                pageNumber: "1",
                                                                filter: ""
                                                            }}
                                                            workspaceNavigation={properties.workspaceNavigation}
                                                            updateWindowData={(id: string, data: any) => {}}
                                                        />
                                                    </div>))
                                                }
                                            </div>
                                        ) : (<></>)}
                                    </div>
                                </div>
                                {
                                    ( Utils.roleCheck(loggedUser.Roles, form.canReadAttachment) && properties.workspaceParams.rec_id != "-1" && !isMobile) && (
                                        <div className="col-sm-12 col-md-12 col-lg-3 p-0 border-start h-100" style={{display: "flex", flexDirection: "column", background: "var(--main_bg)", overflowY: "auto", overflowX: "hidden", position: "relative"}}>
                                            <FormAttachment canAddAttachment={form.canAddAttachment} recordId={properties.workspaceParams.rec_id} tableName={properties.workspaceParams.table} />
                                        </div>
                                    )
                                }
                            </div>
                        ) : (!showWaiting && (""))}
                        {/* ) : (!showWaiting && (<Empty message="Form Not found! It is may be because you have no role on this! Contanct your administrator to fix this issue." />))} */}
                    </div>
                )
            }
        </div>
    );
}

export default WorkspaceForm;