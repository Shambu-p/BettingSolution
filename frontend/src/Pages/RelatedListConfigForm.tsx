import React, { useState } from 'react';
import MultiSelect from './MultiSelect';

const RelatedListConfigForm = () => {
    const [config, setConfig] = useState({
        label: 'R.M. Level',
        id: 'ref_store_items',
        table: 'store_item',
        column_id: 'store_id',
        order: 1,
        readRoles: ['admin', 'branch_manager', 'finance', 'production_manager', 'sells']
    });

    // Mock data for selectors
    const tableOptions = ['store_item', 'inventory_log', 'purchase_order', 'branch_assets'];
    const columnOptions = ['store_id', 'branch_ref', 'parent_sys_id', 'item_link'];

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Branch Manager', value: 'branch_manager' },
        { label: 'Finance', value: 'finance' },
        { label: 'Production Manager', value: 'production_manager' },
        { label: 'Sells', value: 'sells' }
    ];

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let finalValue = value;

        if (type === 'number') {
            finalValue = parseInt(value, 10) || 0;
        }

        setConfig(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleRolesChange = (selectedArray) => {
        setConfig(prev => ({ ...prev, readRoles: selectedArray }));
    };

    return (
        <div className="card zpanel shadow-sm border-0" style={{minHeight: "100%"}}>
            <div className="card-header border-bottom py-2">
                <h6 className="mb-0 fw-bold">Related List Configuration</h6>
            </div>

            <div className="card-body p-4">
                <form>
                    {/* Label Field */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Label</label>
                        <input
                            type="text"
                            name="label"
                            className="form-control form-control-sm zinput"
                            value={config.label}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ID Field */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">List ID (Relationship Name)</label>
                        <input
                            type="text"
                            name="id"
                            className="form-control form-control-sm zinput"
                            value={config.id}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Table Selector */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Table</label>
                        <select
                            name="table"
                            className="form-select form-select-sm zinput"
                            value={config.table}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Target Table --</option>
                            {tableOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Column Selector */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Column ID (Map to)</label>
                        <select
                            name="column_id"
                            className="form-select form-select-sm zinput"
                            value={config.column_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Reference Column --</option>
                            {columnOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Order Field */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Display Order</label>
                        <input
                            type="number"
                            name="order"
                            className="form-control form-control-sm zinput"
                            value={config.order}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Read Roles Multiselect */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Read Roles</label>
                        <MultiSelect
                            options={roleOptions}
                            selectedValues={config.readRoles}
                            onChange={handleRolesChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RelatedListConfigForm;