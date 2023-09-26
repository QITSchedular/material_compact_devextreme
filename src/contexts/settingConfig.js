import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettingConfig } from '../utils/settingConfigAPI';


const SettingContext = createContext();

export function SettingProvider({ children }) {

    const [SettingValues, setSettingValues] = useState();
    const [OriginalSettingValues, setOriginalSettingValues] = useState();
    const [isValueUpdated, setisValueUpdated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getSettingConfig();

                const resultObject = {
                    'Batch / Serial No Generation Method': {
                        "Auto": result[0].genMethod === "A",
                        "Manual": result[0].genMethod === "M",
                    },
                    'QR Managed by': {
                        "None": result[0].qrMngBy === "N",
                        "Manual": result[0].qrMngBy === "M",
                        "Serial Numbar": result[0].qrMngBy === "S",
                    },
                    'QR Generation Method': {
                        "Transaction Wise QR": result[0].qrGenMethod === "T",
                        "Master Wise QR": result[0].qrGenMethod === "M",
                    },
                    'Batch Type': {
                        "Batch": result[0].batchType === "B",
                        "Batch + Project": result[0].batchType === "BP",
                    },
                    'Quality Control': {
                        "Yes": result[0].qcRequired === "Y",
                        "No": result[0].qcRequired === "N",
                    },
                    'Default Period Indicator': result[0].indicator || "",
                    'Warehouse': [
                        result[0].incomingQCWhs || "",
                        result[0].inProcessQCWhs || "",
                        result[0].approvedWhs || "",
                        result[0].rejectedWhs || ""
                    ]
                };
                const originalValuesCopy = JSON.parse(JSON.stringify(resultObject));
                // Object.freeze(originalValuesCopy);

                setSettingValues(resultObject);
                setOriginalSettingValues(originalValuesCopy);

                // console.log("SettingValues", SettingValues);
                // console.log("OriginalSettingValues", OriginalSettingValues);
                // console.log("resultObject", resultObject);
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchData(); // Call the async function
    }, []);



    const toggleCheckbox = (group, value, state) => {
        setSettingValues(prevValues => {
            const updatedValues = { ...prevValues };

            if (!updatedValues[group][value]) {
                updatedValues[group][value] = state;

                for (const key in updatedValues[group]) {
                    if (key !== value) {
                        updatedValues[group][key] = !state;
                    }
                }
            }
            if (!isValueUpdated) {
                setisValueUpdated(true);
            }
            return updatedValues;
        });
    };

    const Dropdownchanged = (group, value) => {
        setSettingValues(prevValues => {
            const updatedValues = { ...prevValues };

            updatedValues[group] = value;

            if (!isValueUpdated) {
                setisValueUpdated(true);
            }
            return updatedValues;
        });
    };

    return (
        <SettingContext.Provider value={{ SettingValues, setSettingValues, OriginalSettingValues, toggleCheckbox, Dropdownchanged, isValueUpdated, setisValueUpdated }}>
            {children}
        </SettingContext.Provider>
    );
}

export function UseSettingContext() {
    return useContext(SettingContext);
}
