import React, { createContext, useContext, useRef, useState } from 'react';

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
    const settingDropdownRef = useRef(null);
    const settingSubDropdownRef = useRef(null);
    const notifyDropdownRef = useRef(null);

    const [isSettingDropdownOpen, setisSettingDropdownOpen] = useState(false);
    const [isSettingSubDropdownOpen, setisSettingSubDropdownOpen] = useState(false);
    const [isNotifyDropdownOpen, setisNotifyDropdownOpen] = useState(false);

    const toggleSettingDropdown = () => {
        setisNotifyDropdownOpen(false);
        setisSettingDropdownOpen(!isSettingDropdownOpen);
    };

    const toggleSettingSubDropdown = () => {
        setisSettingSubDropdownOpen(!isSettingSubDropdownOpen);
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
                isSettingSubDropdownOpen, toggleSettingSubDropdown, setisSettingSubDropdownOpen,
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
