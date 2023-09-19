import React, { createContext, useContext, useRef, useState } from 'react';

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
    // const [HeaderValues, setHeaderValues] = useState(null);
    const settingDropdownRef = useRef(null);
    const settingSubDropdownRef = useRef(null);
    const notifyDropdownRef = useRef(null);

    const [isSettingDropdownOpen, setisSettingDropdownOpen] = useState(false);
    const [isNotifyDropdownOpen, setisNotifyDropdownOpen] = useState(false);

    const toggleSettingDropdown = () => {
        setisNotifyDropdownOpen(false);
        setisSettingDropdownOpen(!isSettingDropdownOpen);
        console.log('isSettingDropdownOpen', isSettingDropdownOpen);
    };

    const toggleNotifyDropdown = () => {
        setisSettingDropdownOpen(false);
        setisNotifyDropdownOpen(!isNotifyDropdownOpen);
    };


    return (
        <HeaderContext.Provider value={
            {
                settingDropdownRef, settingSubDropdownRef, notifyDropdownRef,
                isSettingDropdownOpen, toggleSettingDropdown, setisSettingDropdownOpen,
                isNotifyDropdownOpen, toggleNotifyDropdown, setisNotifyDropdownOpen
            }
        }>
            {children}
        </HeaderContext.Provider>
    );
}

export function UseHeaderContext() {
    return useContext(HeaderContext);
}
