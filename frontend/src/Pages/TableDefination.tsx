import React, { useEffect, useState } from 'react';
import MultiSelect from './MultiSelect';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import ScriptEditor from "../Components/Reusables/ScriptEditor";


const TableDefination = (props: any) => {
    const [formData, setFormData] = useState({
        name: '',
        backup_order: 0,
        title: '',
        id: '',
        application_id: '',
        activityRoles: [],
        canReadAttachment: [],
        canAddAttachment: [],
        idColumn: '',
        writeRoles: [
        ],
        updateRoles: [
        ],
        readRoles: [
        ],
        deleteRoles: [
        ],
        additionalFilter: [
        ],
        createAccessCondition: true,
        updateAccessCondition: [
        ],
        deleteAccessCondition: true,
        createScript: {
            before: "",
            after: ""
        },
        updateScript: {},
        deleteScript: {},
        onsubmit: "defaultOnsubmit",
        listLoader: "defaultListLoader",
        onload: "defaultOnload",
    });

    const [conditionVisibility, setConditionVisibility] = useState({
        onCreate: true,
        onUpdate: true,
        onDelete: true,
    });

    const [serverScripts, setServerScripts] = useState<{ name: string, script: string}[]>([]);

    const [scriptViewer, setScriptViewer] = useState({
        open: false,
        scriptType: '',
        scriptContent: '',
        OnExit: (new_value: string) => {}
    });

    const availableRoles = ['admin', 'branch_manager', 'editor', 'viewer'];

    useEffect(() => {
        setFormData(props.dataPassed.config);
        setServerScripts(props.dataPassed.serverScripts || []);
    }, [props.dataPassed]);

    // Handle standard text/number inputs
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value
        });
    };

    // Handle array-based roles (checkboxes)
    const handleArrayChange = (arrayName, currentArray) => {

        setFormData({ ...formData, [arrayName]: currentArray });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // debugger;
        props.dataPassed.saveAction(formData, serverScripts);
    };

    return (
        <div className="card zpanel" style={{borderRadius: "0px", minHeight: "100%"}}>
            <div className="card-header border-bottom">
                <h4 className="mb-0 fw-bold">Table Configuration</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Basic Strings */}
                       
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Label</label>
                            <input placeholder='Table Tible' type="text" name="title" className="form-control form-control-sm zinput" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">ID</label>
                            <input placeholder='Table Internal Id' type="text" name="id" className="form-control form-control-sm zinput" value={formData.id} onChange={handleChange} readOnly={true} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Backup Order (Int)</label>
                            <input placeholder='Table Backup Sequence' type="number" name="backup_order" className="form-control form-control-sm zinput" value={formData.backup_order} onChange={handleChange} readOnly={true} />
                        </div>

                        {/* Choice Field */}
                        <div className="col-md-12 mb-3">
                            <label className="form-label">ID Column</label>
                            <select title="Which column should be clickable on list to open the record" name="idColumn" className="form-select zinput" value={formData.idColumn} onChange={handleChange}>
                                <option value="">Select a column...</option>
                                {
                                    props.dataPassed.fieldsConfig.map(conf => (<option value={conf.id}>{conf.label}</option>))
                                }
                            </select>
                        </div>

                        <hr className='mb-3' />

                        {/* Role Arrays */}
                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Activity Roles</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('activityRoles', vls)} selectedValues={formData.activityRoles} options={props.dataPassed.roles} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Can Read Attachments</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('canReadAttachment', vls)} selectedValues={formData.canReadAttachment} options={props.dataPassed.roles} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Can Add Attachments</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('canAddAttachment', vls)} selectedValues={formData.canAddAttachment} options={props.dataPassed.roles} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Read Roles</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('readRoles', vls)} selectedValues={formData.readRoles} options={props.dataPassed.roles} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Write Roles</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('writeRoles', vls)} selectedValues={formData.writeRoles} options={props.dataPassed.roles} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Update Roles</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('updateRoles', vls)} selectedValues={formData.updateRoles} options={props.dataPassed.roles} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="d-block mb-2"><strong>Delete Roles</strong></label>
                            <MultiSelect onChange={(vls) => handleArrayChange('deleteRoles', vls)} selectedValues={formData.deleteRoles} options={props.dataPassed.roles} />
                        </div>

                        <div className='border-top mb-3 pt-2' >

                            <div className='col-md-12 mb-1' >
                                <div className="form-check form-switch">
                                    <input
                                        id="noCreateAccessCondition"
                                        className="form-check-input zcheck_box"
                                        type="checkbox"
                                        checked={conditionVisibility.onCreate} onChange={(vls) => {setConditionVisibility(prev => ({...prev, onCreate: !prev.onCreate}))}}
                                        title="access condition for create action, if enabled, record will only be created if the condition is satisfied"
                                    />
                                    <label htmlFor='noCreateAccessCondition' className="form-check-label fw-semibold">No Create Access Condition</label>
                                </div>
                            </div>

                            {
                                (!conditionVisibility.onCreate) && (
                                    <div className='col-md-12' >
                                        <button 
                                            className="btn zbtn btn-sm"
                                            type='button'
                                            title="Edit Table Access Condition Script"
                                            onClick={() => setScriptViewer({
                                                open: true,
                                                scriptType: 'json',
                                                scriptContent: JSON.stringify(formData.createAccessCondition),
                                                OnExit: (new_value: string) => {
                                                    setFormData(prev => ({...prev, createAccessCondition: JSON.parse(new_value)}));
                                                }
                                            })}
                                        >
                                            <DataObjectOutlinedIcon style={{fontSize: 20}} className='me-1' />
                                        </button>
                                        <span className='ms-2'>Change Create Condition Here</span>
                                    </div>
                                )
                            }

                        

                            <div className='col-md-12 mb-1 mt-3' >
                                <div className="form-check form-switch">
                                    <input
                                        id="noUpdateAccessCondition"
                                        className="form-check-input zcheck_box"
                                        type="checkbox"
                                        checked={conditionVisibility.onUpdate} onChange={(vls) => {setConditionVisibility(prev => ({...prev, onUpdate: !prev.onUpdate}))}}
                                        title="access condition for update action, if enabled, record will only be updated if the condition is satisfied"
                                    />
                                    <label htmlFor='noUpdateAccessCondition' className="form-check-label fw-semibold">No Update Access Condition</label>
                                </div>
                            </div>

                            {
                                (!conditionVisibility.onUpdate) && (
                                    <div className='col-md-12' >
                                        <button 
                                            className="btn zbtn btn-sm"
                                            type='button'
                                            title="Edit Table Access Condition Script"
                                            onClick={() => props.dataPassed.openScriptEditor('updateScript', 'Update Script')}
                                        >
                                            <DataObjectOutlinedIcon style={{fontSize: 20}} className='me-1' />
                                        </button>
                                        <span className='ms-2'>Change Update Condition Here</span>
                                    </div>
                                )
                            }


                            <div className='col-md-12 mb-1 mt-3' >
                                <div className="form-check form-switch">
                                    <input
                                        id="noDeleteAccessCondition"
                                        className="form-check-input zcheck_box"
                                        type="checkbox"
                                        checked={conditionVisibility.onDelete} onChange={(vls) => {setConditionVisibility(prev => ({...prev, onDelete: !prev.onDelete}))}}
                                        title="access condition for delete action, if enabled, record will only be deleted if the condition is satisfied"
                                    />
                                    <label htmlFor='noDeleteAccessCondition' className="form-check-label fw-semibold">No Delete Access Condition</label>
                                </div>
                            </div>

                            {
                                (!conditionVisibility.onDelete) && (
                                    <div className='col-md-12 mb-3' >
                                        <button 
                                            className="btn zbtn btn-sm"
                                            type='button'
                                            title="Edit Table Access Condition Script"
                                            onClick={() => props.dataPassed.openScriptEditor('deleteScript', 'Delete Script')}
                                        >
                                            <DataObjectOutlinedIcon style={{fontSize: 20}} className='me-1' />
                                        </button>
                                        <span className='ms-2'>Change Delete Condition Here</span>
                                    </div>
                                )
                            }

                        </div>

                        <div className='border-top mb-3 pt-2' >

                            <div className='col-md-12 mb-3' >
                                <button 
                                    className="btn zbtn btn-sm"
                                    type='button'
                                    title="Edit Table Access Condition Script"
                                    onClick={() => {

                                        let script_name = formData.application_id + "-" + formData.id + "-BeforeCreate";
                                        let existingScript = serverScripts.find(s => s.name === script_name);
                                        if(!existingScript) {
                                            existingScript = {
                                                name: script_name,
                                                script: `const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

module.exports = async function (reqUser, data, dependencies, smsService) {
    // Your code here, for example:
    // if(data.amount > 1000) {
    //     throw new Error("Amount cannot be greater than 1000");
    // }
};`
                                            }
                                        }

                                        setScriptViewer({
                                            open: true,
                                            scriptType: 'javascript',
                                            scriptContent: existingScript.script,
                                            OnExit: (new_value: string) => {
                                                setFormData(prv => ({...prv, createScript: {...prv.createScript, before: script_name}}));
                                                setServerScripts(prev => {
                                                    const updated = [...prev];
                                                    const index = updated.findIndex(s => s.name === script_name);
                                                    if (index !== -1) {
                                                        updated[index] = { ...updated[index], script: new_value };
                                                    } else {
                                                        updated.push({ name: script_name, script: new_value });
                                                    }
                                                    return updated;
                                                });
                                            }
                                        })
                                    }}
                                >
                                    <DataObjectOutlinedIcon style={{fontSize: 20}} className='me-1' />
                                </button>
                                <span className='ms-2'>Before Create Script Here</span>
                            </div>

                            <div className='col-md-12 mb-3' >
                                <button 
                                    className="btn zbtn btn-sm"
                                    type='button'
                                    title="Edit Table Access Condition Script"
                                    onClick={() => {

                                        let script_name = formData.application_id + "-" + formData.id + "-AfterCreate";
                                        let existingScript = serverScripts.find(s => s.name === script_name);
                                        if(!existingScript) {
                                            existingScript = {
                                                name: script_name,
                                                script: `const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');

module.exports = async function (reqUser, data, dependencies, smsService) {
    // Your code here, for example:
    // if(data.amount > 1000) {
    //     throw new Error("Amount cannot be greater than 1000");
    // }
};`
                                            }
                                        }

                                        setScriptViewer({
                                            open: true,
                                            scriptType: 'javascript',
                                            scriptContent: existingScript.script,
                                            OnExit: (new_value: string) => {
                                                setFormData(prv => ({...prv, createScript: {...prv.createScript, after: script_name}}));
                                                setServerScripts(prev => {
                                                    const updated = [...prev];
                                                    const index = updated.findIndex(s => s.name === script_name);
                                                    if (index !== -1) {
                                                        updated[index] = { ...updated[index], script: new_value };
                                                    } else {
                                                        updated.push({ name: script_name, script: new_value });
                                                    }
                                                    return updated;
                                                });
                                            }
                                        })
                                    }}
                                >
                                    <DataObjectOutlinedIcon style={{fontSize: 20}} className='me-1' />
                                </button>
                                <span className='ms-2'>After Create Script Here</span>
                            </div>

                        </div>


                    </div>

                    <button type="submit" className="btn btn-success mt-3" >
                        Save
                    </button>
                </form>
            </div>

            {
                (scriptViewer.open) && (
                    <div
                        style={{
                            width: "100%", 
                            height: "100%", 
                            position: "fixed",
                            left: "50%", 
                            transform: "translateX(-50%)", 
                            zIndex: 1050
                        }}
                    >
                        <ScriptEditor
                            onExit={(new_value: string) => {
                                setScriptViewer(prev => ({...prev, scriptContent: new_value, open: false}));
                                scriptViewer.OnExit(new_value);
                            }}
                            language={scriptViewer.scriptType}
                            scriptValue={scriptViewer.scriptContent}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default TableDefination;