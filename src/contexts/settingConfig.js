import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettingConfig } from '../utils/settingConfigAPI';


const SettingContext = createContext();

export function SettingProvider({ children }) {

    const [SettingValues, setSettingValues] = useState();

    useEffect(() => {
        getSettingConfig()
            .then((result) => {
                console.log("Setting Data", result);

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

                setSettingValues(resultObject);
                console.log("api Data object", resultObject);
            })
            .catch((error) => {
                console.log(error);
            });
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

            return updatedValues;
        });
    };

    const Dropdownchanged = (group, value) => {
        setSettingValues(prevValues => {
            const updatedValues = { ...prevValues };

            updatedValues[group] = value;

            return updatedValues;
        });
    };

    return (
        <SettingContext.Provider value={{ SettingValues, toggleCheckbox, Dropdownchanged }}>
            {children}
        </SettingContext.Provider>
    );
}

export function UseSettingContext() {
    return useContext(SettingContext);
}
