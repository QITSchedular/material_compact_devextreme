import React, { createContext, useContext, useState } from 'react';

const CheckboxContext = createContext();

export function CheckboxProvider({ children }) {
    const [checkboxValues, setCheckboxValues] = useState({
        'Batch / Serial No Generation Method': {
            "Auto": false,
            "Manual": false
        },
        'QR Managed by': {
            "None": false,
            "Manual": false,
            "Serial Numbar": false
        },
        'QR Generation Method': {
            "Transaction Wise QR": false,
            "Master Wise QR": false
        },
        'Batch Type': {
            "Batch": false,
            "Batch + Project": false
        }
    });

    const toggleCheckbox = (name, value) => {
        setCheckboxValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return (
        <CheckboxContext.Provider value={{ checkboxValues, toggleCheckbox }}>
            {children}
        </CheckboxContext.Provider>
    );
}

export function useCheckbox() {
    return useContext(CheckboxContext);
}
