import React, { useEffect, useState } from 'react';
import MultiSelect from './MultiSelect';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';

const ButtonConfigForm = (props) => {

	const [btnConfig, setBtnConfig] = useState({
		roles: ['admin'],
		id: 'update',
		lable: 'Update',
		class: 'zbtn',
		action: '',
		condition: null,
		stayOnForm: true,
		showOnNewForm: false,
      	showOnList: false,
		notBelow: true
	});

	const [scriptViewer, setScriptViewer] = useState({
		open: false,
		scriptType: '',
		scriptContent: '',
		OnExit: (new_value: string) => {}
	});

	const [clientScripts, setClientScripts] = useState<{name: string, script: string}[]>([]);

	const roleOptions = [
		{ label: 'Admin', value: 'admin' },
		{ label: 'Branch Manager', value: 'branch_manager' },
		{ label: 'Finance', value: 'finance' },
		{ label: 'Production Manager', value: 'production_manager' },
		{ label: 'Sells', value: 'sells' }
	];

	const defaultConditionScript = `
export default async (token: string, fields: any[], loggedUser: any, navigation: (route: any) => void, table_id: string) => {

	// let new_data: any = await mapValue(fields, token, table_id);
	// let response = await MainAPI.update(token, table_id, new_data);

	// return {
	// 	message: "Record Updated Successfully",
	// 	sys_id: response.sys_id
	// }

};`;

	const defaultActionScript = `
export default function (token: string, fields: any[], loggedUser: any): boolean {

	return true;

};`;

	useEffect(() => {
		if (props.dataPassed.config) {
			setBtnConfig(props.dataPassed.config);
		}
	}, [props.dataPassed.config]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setBtnConfig(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleRolesChange = (selectedRoles) => {
		setBtnConfig(prev => ({ ...prev, roles: selectedRoles }));
	};

	return (
		<div className="card zpanel border-0" style={{ minHeight: "100%" }}>
			<div className="card-header py-2 border-bottom">
				<h6 className="mb-0 fw-bold">Button Configuration</h6>
			</div>

			<div className="card-body p-4">
				<form>
					{/* Label Field */}
					<div className="mb-3">
						<label className="form-label fw-bold small">Label</label>
						<input
							placeholder="Button Label"
							type="text"
							name="lable"
							className="form-control form-control-sm zinput"
							value={btnConfig.lable}
							onChange={handleChange}
						/>
					</div>

					{/* CSS Class Field */}
					<div className="mb-3">
						<label className="form-label fw-bold small">CSS Class</label>
						<input
							placeholder="e.g. zbtn, zbtn-outline, etc."
							type="text"
							name="class"
							className="form-control form-control-sm zinput"
							value={btnConfig.class}
							onChange={handleChange}
						/>
					</div>

					{/* Roles Multiselect */}
					<div className="mb-3">
						<label className="form-label fw-bold small">Roles</label>
						<MultiSelect
							options={props.dataPassed.roles}
							selectedValues={btnConfig.roles}
							onChange={handleRolesChange}
						/>
					</div>

					{/* Action Field */}
					<div className='mb-1 mt-3' >
						<div className="form-check form-switch">
							<input
								id="setOnChangeLogic"
								className="form-check-input zcheck_box"
								type="checkbox"
								checked={(btnConfig.condition != null)}
								onChange={(event) => {
									setBtnConfig(prev => ({
										...prev,
										onChange: event.target.checked ?
											props.dataPassed.tableConfig.application_id + "$" + props.dataPassed.tableConfig.id + "$" + btnConfig.id + "$ButtonCondition"
											: null
									}));

								}}
								title="access condition for update action, if enabled, record will only be updated if the condition is satisfied"
							/>
							<label htmlFor='setOnChangeLogic' className="form-check-label fw-semibold">Set On Change Logic</label>
						</div>
					</div>

					{
						(btnConfig.condition) && (

							<div className='mb-3' >
								<button
									className="btn zbtn btn-sm"
									type='button'
									title="Edit Table Access Condition Script"
									onClick={() => {

										let script_name = props.dataPassed.tableConfig.application_id + "$" + props.dataPassed.tableConfig.id + "$" + btnConfig.id + "$ButtonCondition";
										let existingScript = clientScripts.find(s => s.name === script_name);
										if (!existingScript) {
											existingScript = {
												name: script_name,
												script: defaultConditionScript
											}
										}

										setScriptViewer({
											open: true,
											scriptType: 'typescript',
											scriptContent: existingScript.script,
											OnExit: (new_value: string) => {
												setBtnConfig(prv => ({ ...prv, onChange: script_name }));
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
									<DataObjectOutlinedIcon style={{ fontSize: 20 }} className='me-1' />
								</button>
								<span className='ms-2'>On Change Script</span>
							</div>
						)
					}



					{/* Stay on Form Toggle */}
					<div className="p-3 rounded border">
						<div className="form-check form-switch">
							<input
								className="form-check-input zcheck_box"
								type="checkbox"
								name="stayOnForm"
								id="stayOnFormSwitch"
								checked={btnConfig.stayOnForm}
								onChange={handleChange}
							/>
							<label className="form-check-label fw-bold" htmlFor="stayOnFormSwitch">
								Stay on Form after click
							</label>
						</div>
						<div className="form-text mt-1" style={{ fontSize: '0.75rem', color: 'var(--border_color)' }}>
							If enabled, the page will not redirect after the button action is executed.
						</div>
					</div>

				</form>
			</div>
		</div>
	);
};

export default ButtonConfigForm;