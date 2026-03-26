import React, { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ options, selectedValues, onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedValues, setlocalSelectedValues] = useState([]);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setlocalSelectedValues(selectedValues);
  }, [selectedValues]);

  const toggleOption = (value) => {
    const isSelected = localSelectedValues.includes(value);
    const newSelection = (isSelected
      ? localSelectedValues.filter((v) => v !== value)
      : [...localSelectedValues, value]);
    
    setlocalSelectedValues(newSelection);
    onChange(newSelection);
  };

  const getLabel = (value) => {
    return options.find(opt => opt.value === value)?.label || value;
  };

  return (
    <div className="position-relative" ref={containerRef} style={{ width: '100%' }}>
      {/* Selection Area / Trigger */}
      <button 
        type='button'
        className="form-control d-flex flex-wrap align-items-center gap-1 zinput" 
        style={{ minHeight: '38px', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 && (
          <span className="fs-6" style={{ color: "var(--border_color) !important"}}>{placeholder}</span>
        )}
        {selectedValues.map(val => (
          <span key={val} className="badge d-flex align-items-center" style={{background: "var(--button_bg)"}}>
            {getLabel(val)}
            <button 
              type="button"
              className="btn-close btn-close-white ms-2" 
              style={{ fontSize: '0.5rem' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleOption(val);
              }}
            />
          </span>
        ))}
        <div className="ms-auto ps-2">
          <small className="text-muted">{isOpen ? '▲' : '▼'}</small>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu show w-100 shadow-sm mt-1 overflow-auto zpanel" style={{ maxHeight: '200px' }}>
          {options.map((option) => (
            <div 
              key={option.value} 
              className={`dropdown-item d-flex align-items-center zoption ${selectedValues.includes(option.value) ? 'selected_zoption' : ''}`}
              onClick={() => toggleOption(option.value)}
              style={{ cursor: 'pointer' }}
            >
              <input 
                type="checkbox" 
                className="form-check-input me-2 zcheck_box" 
                checked={selectedValues.includes(option.value)}
                readOnly 
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;