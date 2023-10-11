import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettingConfig } from '../utils/settingConfigAPI';

const SettingContext = createContext();

export function SettingProvider({ children }) {

    const [SettingValues, setSettingValues] = useState(null);
    const [isValueUpdated, setisValueUpdated] = useState(false);

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
                    'Quality Control': true,
                    'Enable Verify Material': false,
                    'Pro Rework Reason': true,
                    'Default Period Indicator': result[0].indicator || null,
                    "GRPO Serise": result[0].issueSeries || null,
                    "Issue Serise": "26" || null,
                    "Receipt Series": "25" || null,
                    "Delivery Serise": "9" || null,
                    "Inventory Transfer Serise": result[0].issueSeries || null,
                    'Warehouse': [
                        result[0].incomingQCWhs || null,
                        result[0].inProcessQCWhs || null,
                        result[0].approvedWhs || null,
                        result[0].rejectedWhs || null
                    ],

                };
                await setSettingValues(resultObject);
                // console.log("SettingValues", SettingValues);
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchData();
    }, []);
    return (
        <SettingContext.Provider value={{ SettingValues, setSettingValues, toggleCheckbox, Dropdownchanged, isValueUpdated, setisValueUpdated }}>
            {children}
        </SettingContext.Provider>
    );
}

export function UseSettingContext() {
    return useContext(SettingContext);
}
