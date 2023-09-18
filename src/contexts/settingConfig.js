import React, { createContext, useContext, useState } from 'react';

const SettingContext = createContext();



export function SettingProvider({ children }) {
    const settingObject = {
        'Batch / Serial No Generation Method': {
            "Auto": true,
            "Manual": false,
        },
        'QR Managed by': {
            "None": true,
            "Manual": false,
            "Serial Numbar": false,
        },
        'QR Generation Method': {
            "Transaction Wise QR": true,
            "Master Wise QR": false,
        },
        'Batch Type': {
            "Batch": true,
            "Batch + Project": false,
        },
        'Quality Control': {
            "Yes": true,
            "No": false,
        },
        'Default Period Indicator': ""
    }
    const [SettingValues, setSettingValues] = useState(settingObject);

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
