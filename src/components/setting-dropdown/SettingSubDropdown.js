import React, { useEffect } from 'react';
import './SettingSubDropdown.scss';
import { SelectBox } from 'devextreme-react';
import CustomCheckBox from './CustomCheckBox';
import { UseHeaderContext } from '../../contexts/headerContext';

function SettingSubDropdown() {

    const { settingSubDropdownRef, setisSettingDropdownOpen, settingDropdownRef } = UseHeaderContext();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingSubDropdownRef.current && !settingSubDropdownRef.current.contains(event.target)) {
                const isIconClicked = event.target.classList.contains('quality-control-dropdown');
                if (settingDropdownRef.current.contains(event.target)) {
                }
                else {
                    if (!isIconClicked) {
                        setisSettingDropdownOpen((prev) => {
                            return !prev;
                        });
                    }
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [settingSubDropdownRef, setisSettingDropdownOpen]);


    let SettingDropDownInputBox = ({ data }) => {
        return (
            <>
                <SelectBox dataSource={data} defaultValue={data[0]} stylingMode='outlined' />
            </>
        );
    };

    return (
        <div className={`subdropdown`} ref={settingSubDropdownRef}>
            <div className="subdropdown-header">
                <div className="heading">Quality Control</div>
                <div className="sub-heading">Quality control Setting</div>
            </div>
            <div className="subdropdown-body">
                <div className={`quality-control-dropdown`}>
                    Quality Control
                    <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Quality Control'} />
                    Incoming QC Warehouse
                    <SettingDropDownInputBox data={[
                        "Incoming Warehouse",
                        "SuperHD Video Player",
                    ]} />
                    <SettingDropDownInputBox data={[
                        "In - process Warehouse",
                        "SuperLED 50",
                    ]} />
                    <SettingDropDownInputBox data={[
                        "Approved Warehouse",
                        "SuperHD Video Player",
                    ]} />
                    <SettingDropDownInputBox data={[
                        "Rejected Warehouse",
                        "SuperHD Video Player",
                    ]} />
                </div>
            </div>
        </div>
    );
}

export default SettingSubDropdown;
