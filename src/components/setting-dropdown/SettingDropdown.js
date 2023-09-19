import React, { useEffect, useState } from 'react';
import './SettingDropdown.scss';
import { Accordion, SelectBox } from 'devextreme-react';
import SettingSubDropdown from './SettingSubDropdown';
import CustomCheckBox from './CustomCheckBox';
import { getPeriodIndicator } from '../../utils/gate-in-purchase';
import { UseSettingContext } from '../../contexts/settingConfig';
import { UseHeaderContext } from '../../contexts/headerContext';

function SettingDropdown() {

    const { settingDropdownRef, setisSettingDropdownOpen } = UseHeaderContext();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingDropdownRef.current && !settingDropdownRef.current.contains(event.target)) {
                const isIconClicked = event.target.classList.contains('setting-icon'); // Adjust the class name accordingly
                if (!isIconClicked || settingDropdownRef.current.contains(event.target)) {
                    setisSettingDropdownOpen((prev) => {
                        return !prev;
                    });
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [settingDropdownRef, setisSettingDropdownOpen]);


    const { SettingValues, Dropdownchanged } = UseSettingContext();

    const [selectedSeries, setSelectedSeries] = useState(SettingValues["Default Period Indicator"]);

    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsSubDropdownOpen(!isSubDropdownOpen);
    };

    async function getPeriodIndicatorData() {
        try {
            return Promise.resolve((await getPeriodIndicator()).map(value => value.indicator));
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

    const SettingDropDownInputBox = (selectBoxGroup) => {
        const [dataSource, setDataSource] = useState([]);

        useEffect(() => {
            getPeriodIndicatorData()
                .then((result) => {
                    setDataSource(result);
                })
                .catch((error) => {
                    console.log(error);
                });
        }, []);

        return (
            <SelectBox
                dataSource={dataSource}
                stylingMode='outlined'
                searchEnabled={true}
                selectedItem={dataSource[0]}
                onItemClick={
                    (value) => {
                        setSelectedSeries(value.itemData);
                        Dropdownchanged(selectBoxGroup, value.itemData)
                    }
                }
                value={selectedSeries}
                placeholder={"Select Series"}
                useItemTextAsTitle={true}
            />
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
            html: <SettingDropDownInputBox selectBoxGroup={"Default Period Indicator"} />,
        },
    ];

    return (
        <div className='dropdown-background'>
            <div className="dropdown" ref={settingDropdownRef}>
                <div className="dropdown-header">
                    <div className="heading">Setting</div>
                    <div className="sub-heading">Every Setting is available here</div>
                </div>
                <div className="dropdown-body">
                    <Accordion
                        animationDuration={450}
                        dataSource={itemsarr}
                        itemRender={(data) => data.html}
                        className="batch-serial-acrdn"
                        onItemTitleClick={() => {
                            if (isSubDropdownOpen) {
                                setIsSubDropdownOpen(!isSubDropdownOpen);
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
