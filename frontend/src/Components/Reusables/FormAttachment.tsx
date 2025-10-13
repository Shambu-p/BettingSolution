import { Authorized, props } from "../../APIs/api";
import MainAPI from "../../APIs/MainAPI";
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";
import Utils from "../../Models/Utils";
import React, { useContext, useEffect, useState } from "react";

const FormAttachment = (properties: {
    tableName: string,
    recordId: string,
    canAddAttachment: any[]
}) => {

    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    const [recordAttachments, setRecordAttachments] = useState<any[]>([]);
    const [attachment, setAttachment] = useState<{
        content: any,
        extension: string,
        name: string
    }>({
        content: null,
        name: "",
        extension: ""
    });

    useEffect(() => {
        loadAttachment();
    }, [properties.tableName]);

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

    const addAttachment = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);
        
        try {
            if(!attachment.content) {
                setAlert("Select a file to attach", "error");
                setTimeout(() => {
                    setWaiting(false);
                }, 1);
                return;
            }
            
            if(attachment.name == "") {
                setAlert("fill attachment name", "error");
                setTimeout(() => {
                    setWaiting(false);
                }, 1);
                return;
            }

            // let extension = ;

            if(attachment.extension == "") {
                setAlert("unknow file type", "error");
                setTimeout(() => {
                    setWaiting(false);
                }, 1);
                return;
            }

            let response = await Authorized(cookies.login_token).bodyRequest(
                "post",
                "file/create",
                {
                    content: attachment.content,
                    name: attachment.name,
                    file_name: attachment.name,
                    table: properties.tableName,
                    extension: (['jpg', 'jpeg', 'png', 'webp'].includes(attachment.extension) ? `image/${attachment.extension}` : `application/${attachment.extension}`),
                    record: properties.recordId
                }
            );
            // await form?.onsubmit(cookies.login_token, form.fields);
            setAlert("Attachment added Successfully", "success");
            setRecordAttachments(att => ([...att, response]));
            // navigate(`/list/${params.name}`);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setWaiting(false);

    };

    const loadAttachment = async () => {
        let response = await MainAPI.loadAttachments(cookies.login_token, properties.tableName, properties.recordId);
        setRecordAttachments(rat => (response.Items));
        // setRecordAttachments(rat => []);
    }

    const attachmentOnChange = async (event: any) => {
        // console.log((event.target.name == "file" ? event.target.files : event.target.value));
        let fl = event.target;
        if(event.target.name == "file") {
            let encoded_file = await readFileAsDataURL(fl.files[0]);
            setAttachment(att => ({ ...att, content: encoded_file, extension: getFileExtension(fl.files[0]) }));
        } else {
            setAttachment(att => ({ ...att, [fl.name]: fl.value }))
        }
    };

    const getAttachmentIcon = (record: any) => {
    
        console.log("extension ", record.extension, record.extension.indexOf("image/"));

        if(record.extension.indexOf("image/") > -1) {
            return (<img src={`${props.baseURL}file/${record.sys_id}`} className="w-100" alt="attached image" />)
        } else if (record.extension.indexOf("/pptx") > -1 || record.extension.indexOf("/ppt") > -1) {
            return (<img src={`${props.baseURL}file/${record.sys_id}`} className="w-100" alt="attached image" />)
        } else if (record.extension.indexOf("/doc") > -1 || record.extension.indexOf("/docs") > -1) {
            return (<img src="/images/word.png" className="w-100" alt="attached image" />)
        } else if (record.extension.indexOf("/xlsx") > -1 || record.extension.indexOf("/xls") > -1) {
            return (<img src="/images/excel.svg" className="w-100" alt="attached image" />)
        } else if(record.extension == "application/pdf") {
            return (<img src="/images/pdf-1.png" className="w-100" alt="attached file" />)
        } else {
            return (<img src="/images/unknow_file_type_no_bg.png" className="w-100" alt="attached image" />)
        }

    }

    return (
        <div
            className="w-100 h-100 rounded-top-3"
            style={{
                display: "flex",
                flexDirection: "column",
                background: "transparent",
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative"
            }}
        >
            <div className="w-100 px-3 py-2 border-bottom zpanel">Attachments</div>
            {
                (Utils.roleCheck(loggedUser.Roles, properties.canAddAttachment)) ? (
                    <div className="card mt-3 zpanel">
                        <div className="card-body">
                            <input type="text" onChange={attachmentOnChange} name="name" placeholder="Attachment Title" value={attachment.name} className="form-control form-control-sm mb-3 zinput" />
                            <input type="file" onChange={attachmentOnChange} name="file" className="form-control form-control-sm mb-3 zinput" />
                            <button className="btn btn-sm w-100 zbtn" onClick={addAttachment}>Add Attachment</button>
                        </div>
                    </div>
                ) : (<></>)
            }
            <div className="px-2 py-3 h-100" style={{overflowX: "hidden", overflowY: "auto", position: "relative"}}>
                {
                    recordAttachments?.map(rec => (
                        <div className="card mb-3 zpanel" style={{overflow: "hidden"}}>
                            {getAttachmentIcon(rec)}
                            <div className="card-body">
                                <h6 className="card-title fs-6">{rec?.name}</h6>
                                <div className="card-subtitle mb-2 small_text">{rec?.extension}</div>

                                <a className="btn btn-sm btn-success me-3 zbtn small_text" href={`${props.baseURL}file/${rec?.sys_id}`} >Download</a>
                                {/* {(loggedUser.Roles.includes(UserRoles.Admin)) && (<button className="btn btn-sm btn-danger small_text">Delete</button>)} */}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default FormAttachment;