import React, { useContext, useEffect, useState } from 'react';
import MultiSelect from './MultiSelect';
import { Authorized } from '../APIs/api';
import AuthContext from '../Contexts/AuthContext';
import FieldTypes from '../Enums/FiedTypes';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import ScriptEditor from "../Components/Reusables/ScriptEditor";

const FieldConfig = (props: any) => {

    const {cookies} = useContext(AuthContext)

    const [config, setConfig] = useState<any>({
        type: 'text',
        maxLength: 40,
        minLength: 32,
        required: false,
        id: 'sys_id',
        label: 'System Id',
        description: '',
        order: 1,
        visible: false,
        readonly: true,
        notOnList: true,
        onChange: 'default',
        writeRoles: [],
        readRoles: [],
        updateRoles: [],
        // New keys for reference types
        ref_app: '',
        references: '',
        displayField: ''
    });

    const [scriptViewer, setScriptViewer] = useState({
        open: false,
        scriptType: '',
        scriptContent: '',
        OnExit: (new_value: string) => {}
    });

    const [conditionVisibility, setConditionVisibility] = useState({
        onCreate: true,
        onUpdate: true,
        onDelete: true,
    });

    const [clientScripts, setClientScripts] = useState<{name: string, script: string}[]>([]);
    const [columnOptions, setColumnOptions] = useState<{id: string, label: string}[]>([]);

    const fieldTypes = [
        FieldTypes.TEXT,
        FieldTypes.NUMBER,
        FieldTypes.SELECT,
        FieldTypes.BOOLEAN,
        FieldTypes.REFERENCE,
        FieldTypes.DATE,
        FieldTypes.DATETIME,
        FieldTypes.TEXTAREA,
    ];

    const defaultOnChangeScript = `
export default async (token: string, fields: any[], value: any, set_field: (index: number, vl: IField) => void): Promise<any> => {

    // field on change logic will be here

    // final changed field value
    return value;

}`;


    useEffect(() => {
        setConfig(props.dataPassed.config);
    }, [props.dataPassed.config]);

    useEffect(() => {
        loadTableColumns();
        setClientScripts(props.dataPassed.clientScripts);
    }, []);

    useEffect(() => {
        loadTableColumns();
    }, [config.references, config.ref_app]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        let finalValue = value;
        if (type === 'checkbox') finalValue = checked;
        if (type === 'number') finalValue = Math.max(-1, parseInt(value, 10) || 0);

        setConfig(prev => ({ ...prev, [name]: finalValue }));

    };

    const handleRolesChange = (roleKey, selectedArray) => {
        setConfig(prev => ({ ...prev, [roleKey]: selectedArray }));
    };

    const loadTableColumns = async () => {

        if(config.references) {
            let result = await Authorized(cookies.login_token).bodyRequest("get", `/builder/single_config?app_id=${config.ref_app}&table_id=${config.references}`);
            setColumnOptions(Object.values(result.fields).map((f: any) => ({id: f.id, label: f.label})));
        }

    }

    return (
        <div className="card zpanel border-0">
            <div className="card-header border-bottom">
                <h5 className="mb-0 fw-bold">Field Configuration</h5>
            </div>
            <div className="card-body p-4">

                {/* Identity Section */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Field ID</label>
                    <input type="text" name="id" className="form-control form-control-sm zinput" value={config.id} onChange={handleChange} placeholder="e.g., u_my_field" />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Label</label>
                    <input placeholder='Field Label' type="text" name="label" className="form-control form-control-sm zinput" value={config.label} onChange={handleChange} />
                </div>

                {/* Type Selector */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Field Type</label>
                    <select title='Field type' name="type" className="form-select  form-select-sm zinput" value={config.type} onChange={handleChange}>
                        {fieldTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                </div>

                {/* CONDITIONAL REFERENCE FIELDS */}
                <div className="p-3 mb-3 bg-primary bg-opacity-10 border border-primary rounded shadow-sm" style={{display: (config.type === 'reference' ? '' : 'none'), borderColor: "var(--button_bg)"}}>
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-uppercase text-primary">Target Application (References)</label>
                        <select title='Related Table Application' name="ref_app" className="form-select form-select-sm zinput" value={config.ref_app} onChange={handleChange}>
                            <option value="">-- Select Table --</option>
                            {props.dataPassed.appList.map((app: any) => (
                                <option
                                    key={app.value}
                                    value={app.value}
                                    selected={config.ref_app === app.value}
                                >
                                    {app.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-uppercase text-primary">Target Table (References)</label>
                        <select title='Related Table' name="references" className="form-select form-select-sm zinput" value={config.references} onChange={handleChange}>
                            <option value="">-- Select Table --</option>
                            {props.dataPassed.tableOptions.map((table: any) => (
                                <option
                                    key={table.table_id}
                                    value={table.table_id}
                                    selected={config.references === table.table_id}
                                >
                                    {table.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-0">
                        <label className="form-label fw-bold small text-uppercase text-primary">Display Field</label>
                        <select title='Target Table Field' name="displayField" className="form-select form-select-sm zinput" value={config.displayField} onChange={handleChange}>
                            <option value=""> -- Select Column -- </option>
                            {columnOptions.map(col => (<option key={col.id} value={col.id}>{col.label}</option>))}
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Display Order</label>
                    <input title='Display sequence' type="number" name="order" className="form-control form-control-sm zinput" value={config.order} onChange={handleChange} />
                </div>

                {/* Length Controls */}
                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <label className="form-label fw-bold small text-uppercase">Min Length</label>
                        <input title='Minimum length of the field value' type="number" name="minLength" className="form-control form-control-sm zinput" value={config.minLength} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                        <label className="form-label fw-bold small text-uppercase">Max Length</label>
                        <input title='Maximum length of the field value' type="number" name="maxLength" className="form-control form-control-sm zinput" value={config.maxLength} onChange={handleChange} />
                    </div>
                </div>

                {/* Switches */}
                <div className="p-3 rounded mb-3 border">
                    <div className="form-check form-switch mb-2">
                        <input id="isRequiredField" className="form-check-input zcheck_box" type="checkbox" name="required" checked={config.required} onChange={handleChange} />
                        <label htmlFor='isRequiredField' className="form-check-label fw-semibold">Required</label>
                    </div>
                    <div className="form-check form-switch mb-2">
                        <input id="isVisibleField" className="form-check-input zcheck_box" type="checkbox" name="visible" checked={config.visible} onChange={handleChange} />
                        <label htmlFor='isVisibleField' className="form-check-label fw-semibold">Visible</label>
                    </div>
                    <div className="form-check form-switch mb-2">
                        <input id="isReadOnlyField" className="form-check-input zcheck_box" type="checkbox" name="readonly" checked={config.readonly} onChange={handleChange} />
                        <label htmlFor='isReadOnlyField' className="form-check-label fw-semibold">Read Only</label>
                    </div>
                    <div className="form-check form-switch">
                        <input id="isNotOnListField" className="form-check-input zcheck_box" type="checkbox" name="notOnList" checked={config.notOnList} onChange={handleChange} />
                        <label htmlFor='isNotOnListField' className="form-check-label fw-semibold">Hide on List</label>
                    </div>
                </div>

                {/* Role Multiselects */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Read Roles</label>
                    <MultiSelect options={props.dataPassed.roles} selectedValues={config.readRoles} onChange={(vals) => handleRolesChange('readRoles', vals)} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Write Roles</label>
                    <MultiSelect options={props.dataPassed.roles} selectedValues={config.writeRoles} onChange={(vals) => handleRolesChange('writeRoles', vals)} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Update Roles</label>
                    <MultiSelect options={props.dataPassed.roles} selectedValues={config.updateRoles} onChange={(vals) => handleRolesChange('updateRoles', vals)} />
                </div>



                {/* <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">OnChange Logic</label>
                    <textarea 
                        placeholder='On change script' 
                        name="onChange" 
                        className="form-control form-control-sm zinput font-monospace" 
                        rows={2} 
                        value={config.onChange} 
                        onChange={handleChange}
                    ></textarea>
                </div> */}

                <div className='mb-1 mt-3' >
                    <div className="form-check form-switch">
                        <input
                            id="setOnChangeLogic"
                            className="form-check-input zcheck_box"
                            type="checkbox"
                            checked={(config.onChange != 'default')} 
                            onChange={(event) => {
                                setConfig(prev => ({
                                    ...prev, 
                                    onChange: event.target.checked ? 
                                        props.dataPassed.tableConfig.application_id + "$" + props.dataPassed.tableConfig.id + "$" + config.id + "$OnChange" 
                                        : 'default'
                                }));

                            }}
                            title="access condition for update action, if enabled, record will only be updated if the condition is satisfied"
                        />
                        <label htmlFor='setOnChangeLogic' className="form-check-label fw-semibold">Set On Change Logic</label>
                    </div>
                </div>

                {
                    (config.onChange != 'default') && (

                        <div className='mb-3' >
                            <button 
                                className="btn zbtn btn-sm"
                                type='button'
                                title="Edit Table Access Condition Script"
                                onClick={() => {

                                    let script_name = props.dataPassed.tableConfig.application_id + "$" + props.dataPassed.tableConfig.id + "$" + config.id + "$OnChange";
                                    let existingScript = clientScripts.find(s => s.name === script_name);
                                    if(!existingScript) {
                                        existingScript = {
                                            name: script_name,
                                            script: defaultOnChangeScript
                                        }
                                    }

                                    setScriptViewer({
                                        open: true,
                                        scriptType: 'typescript',
                                        scriptContent: existingScript.script,
                                        OnExit: (new_value: string) => {
                                            setConfig(prv => ({...prv, onChange: script_name}));
                                            setClientScripts(prev => {
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
                            <span className='ms-2'>On Change Script</span>
                        </div>
                    )
                }

                <button  className="btn zbtn" onClick={async () => {await props.dataPassed.saveAction(config)}}>
                    <SaveOutlinedIcon className="me-1" />
                    Save
                </button>

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

export default FieldConfig;