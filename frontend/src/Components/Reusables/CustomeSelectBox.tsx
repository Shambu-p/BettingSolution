import React, { useContext, useEffect, useState } from 'react';
import MainAPI from '../../APIs/MainAPI';
import AlertContext from '../../Contexts/AlertContext';
import FieldTypes from '../../Enums/FiedTypes';
import Operators from '../../Enums/Operators';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';

function CustomeSelectBox({givenValue, onChange, title, readonly, disabled, id, displayField, onFocus, onBlur, options, token, displayFieldCalculator, references, openForm }: {
    givenValue: any,
    options: any,
    token: string,
    references: string,
    displayFieldCalculator?: (item: any) => String,
    onChange?: (event: any) => Promise<void>,
    title?: string,
    readonly?: boolean,
    disabled?: boolean,
    id?: string,
    displayField: string,
    onFocus?: (event?: any) => void,
    onBlur?: (event?: any) => void,
    openForm?: () => void
}) {

    const {setAlert} = useContext(AlertContext);

    const [selectedOption, setSelectedOption] = useState<{value: any, label: string}>();
    const [searchWord, setSearchWord] = useState<string>("");
    const [controlledOptions, setControlledOptions] = useState<{value: any, label: string}[]>([]);
    const [allOptions, setAllOptions] = useState<{value: any, label: string}[]>([]);
    const [localPageNumber, setLocalPageNumber] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [urlParams, setURLParams] = useState<any>({});



    const params = useParams();

    useEffect(() => {

        if(givenValue != undefined && givenValue != "") {
            loadGivenRecord(givenValue);
        }

        if(!disabled || !readonly) {
            loadOptionRecords(1, options);
        }

    }, [urlParams]);

    useEffect(() => {
        if(!disabled || !readonly) {
            loadOptionRecords(1, options);
        }
    }, [options]);

    useEffect(() => {

        // console.log("param changed", params);
        if(urlParams.name != params.name || urlParams.r_id != params.r_id) {
            setURLParams(params);
        }

    }, [params]);


    const loadOptionRecords = async (pageNumber: number, conditions: any) => {

        setTimeout(() => {setIsLoading(true);}, 1);
        try {

            let result = await MainAPI.getWithDirectCondition(token, references, pageNumber, 20, {
                ...conditions,
                // [displayField]: {
                //     type: FieldTypes.TEXT,
                //     operator: Operators.CONTAINS,
                //     value: searchWord
                // }
            }, "reference");
            console.log("found options ", result.Items);
            setTotalCount(result.TotalCount);
            let found_options = ((pageNumber == 1) ? (result.Items.map(record => ({
                value: record[id ?? "id"],
                label: displayFieldCalculator ? displayFieldCalculator(record) : record[displayField]
            }))) : ([...allOptions, ...(result.Items.map(record => ({
                value: record[id ?? "id"],
                label: displayFieldCalculator ? displayFieldCalculator(record) : record[displayField]
            })))]));
            setAllOptions(found_options);
            setControlledOptions(searchWord ? (found_options.filter(opt => (opt.label.toLowerCase().includes(searchWord.toLowerCase())))) : found_options);

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setIsLoading(false);}, 1);

    }

    const loadGivenRecord = async (record_id: string) => {

        try {

            let result = await MainAPI.getSingle(token, references, record_id, "reference");
            setSelectedOption({
                value: result[id ?? "id"],
                label: displayFieldCalculator ? displayFieldCalculator(result) : result[displayField]
            });

        } catch(error: any) {
            setAlert(error.message, "error");
        }

    }

    const selectOption = async (selected_option: {value: any, label: string}) => {

        setSelectedOption(selected_option);
        setSearchWord("");
        setControlledOptions(allOptions);
        if(onChange) {
            await onChange(selected_option);
        }

    }

    return (
        <div className="dropdown w-100 p-0 m-0">
            <button 
                className={`btn btn-sm zinput form-control border text-start`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={disabled}
                title={title}
                style={{fontSize: "13px"}}
            >
                {selectedOption ? selectedOption.label : "None"}
            </button>
            <ul className="dropdown-menu w-100 shadow zpanel" style={{ minHeight: "100px", height: "max-content", maxHeight: "350px", overflow: "hidden auto"}}>
                <li className="p-2 d-flex align-items-center" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                    <button className="btn zbtn py-1 px-2 me-2" onClick={() => {
                        loadOptionRecords(1, options);
                    }}>
                        <ReplayIcon sx={{fontSize: "15px"}} />
                    </button>
                    <input 
                        className="form-control zinput form-control-sm"
                        value={searchWord}
                        style={{fontSize: "13px"}}
                        onChange={(event: any) => {
                            setSearchWord(event.target.value);
                            setControlledOptions(allOptions.filter(opt => (opt.label.toLowerCase().includes(event.target.value.toLowerCase()))));
                        }}
                        placeholder='Search Here'
                    />
                    <button className="btn zbtn py-1 px-2 ms-2" onClick={openForm}>
                        <AddIcon sx={{fontSize: "15px"}} />
                    </button>
                </li>
                {controlledOptions.map(opt => (
                    <li 
                        className={`dropdown-item zoption ${selectedOption?.value == opt.value ? "selected_zoption" : ""}`}
                        style={{cursor: "pointer", fontSize: "13px"}}
                        onClick={() => {
                            selectOption(opt);
                        }}
                    >{opt.label}</li>
                ))}
                {
                    isLoading && (
                        <li className="p-2" style={{backgroundColor: "transparent"}} >
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border spinner-border-sm" style={{color: "var(--button_bg)", fontSize: "15px"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </li>
                    )
                }
                {
                    (Math.ceil(totalCount/20) > localPageNumber) && (
                        <li className="px-2 py-0 mt-1" style={{backgroundColor: "transparent"}} >
                            <button className="btn btn-sm zbtn w-100" style={{fontSize: "13px"}} onClick={async () => {
                                await loadOptionRecords(localPageNumber + 1, options);
                                setLocalPageNumber(localPageNumber + 1);
                            }}>Load more</button>
                        </li>
                    )
                }
            </ul>
        </div>
    );

}

export default CustomeSelectBox;