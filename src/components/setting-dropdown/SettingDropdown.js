import React, { useCallback, useState } from 'react';
import './SettingDropdown.scss';
import { Accordion, SelectBox } from 'devextreme-react';
import { CheckBox } from 'devextreme-react/check-box';
import SettingSubDropdown from './SettingSubDropdown';



function SettingDropdown() {

    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setIsSubDropdownOpen(!isSubDropdownOpen);
    };

    const onValueChanged = useCallback((e) => {
        if (e.value) {
            // alert(e.value); 
        }
    }, []);

    let CustomCheckBox = ({ checkboxvalue }) => {
        return (
            <>
                {
                    checkboxvalue.map((value, index) => {
                        return (
                            <>
                                <div className='custom-checkbox'>
                                    <CheckBox text={value} onValueChanged={onValueChanged} />
                                </div>
                            </>
                        )
                    })
                }
            </>
        );
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
                        "SuperLCD 55",
                        "SuperLCD 42",
                        "SuperPlasma 65",
                        "SuperLCD 70",
                        "Projector Plus",
                        "Projector PlusHT",
                        "ExcelRemote IR",
                        "ExcelRemote BT",
                        "ExcelRemote IP"
                    ]}
                        stylingMode='outlined' />
                }
            </>
        );
    };

    const itemsarr = [
        {
            title: 'Batch / Serial No Generation Method',
            html: <CustomCheckBox checkboxvalue={["Auto", "Manual"]} />
        },
        {
            title: 'QR Managed by',
            html: <CustomCheckBox checkboxvalue={["None", "Manual", "Serial Numbar"]} />
        },
        {
            title: 'QR Generation Method',
            html: <CustomCheckBox checkboxvalue={["Transaction Wise QR", "Master Wise QR"]} />
        },
        {
            title: 'Batch Type',
            html: <CustomCheckBox checkboxvalue={["Batch", "Batch + Project"]} />
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
                        collapsible={true}
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
