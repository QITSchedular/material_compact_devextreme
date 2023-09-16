import React, { useState } from 'react';
import './SettingDropdown.scss';
import { Accordion, SelectBox } from 'devextreme-react';
import SettingSubDropdown from './SettingSubDropdown';
import CustomCheckBox from './CustomCheckBox';


function SettingDropdown() {

    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsSubDropdownOpen(!isSubDropdownOpen);
    };

    let SettingDropDownInputBox = () => {
        return (
            <>
                {
                    <SelectBox dataSource={[
                        "HD Video Player",
                        "SuperHD Video Player",
                        "SuperPlasma 50",
                        "SuperLED 50",
                        "SuperLED 42",
                    ]}
                        stylingMode='outlined' />
                }
            </>
        );
    };

    const itemsarr = [
        {
            title: 'Batch / Serial No Generation Method',
            html: <CustomCheckBox checkboxvalue={["Auto", "Manual"]} checkboxgroup={'Batch / Serial No Generation Method'} />
        },
        {
            title: 'QR Managed by',
            html: <CustomCheckBox checkboxvalue={["None", "Manual", "Serial Numbar"]} checkboxgroup={'QR Managed by'} />
        },
        {
            title: 'QR Generation Method',
            html: <CustomCheckBox checkboxvalue={["Transaction Wise QR", "Master Wise QR"]} checkboxgroup={'QR Generation Method'} />
        },
        {
            title: 'Batch Type',
            html: <CustomCheckBox checkboxvalue={["Batch", "Batch + Project"]} checkboxgroup={'Batch Type'} />
        },
        {
            title: 'Default Period Indicator',
            html: <SettingDropDownInputBox />,
        },
    ];

    return (
        <div className='dropdown-background'>
            <div className="dropdown">
                <div className="dropdown-header">
                    <div className="heading">Setting</div>
                    <div className="sub-heading">Every Setting is available here</div>
                </div>
                <div className="dropdown-body">
                    <Accordion
                        animationDuration={450}
                        dataSource={itemsarr}
                        itemRender={(data) => data.html}
                        // collapsible={true}
                        className="batch-serial-acrdn"
                        onItemTitleClick={() => {
                            if (isSubDropdownOpen) {
                                setIsSubDropdownOpen(false);
                            }
                        }}
                    />
                    <div className={`quality-control-dropdown ${isSubDropdownOpen ? 'subdropdown-open' : ''}`} onClick={toggleDropdown}>
                        Quality Control
                    </div>

                    {isSubDropdownOpen && <SettingSubDropdown />}
                </div>
            </div>
        </div>
    );
}

export default SettingDropdown;
