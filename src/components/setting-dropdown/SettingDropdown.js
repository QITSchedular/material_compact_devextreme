import React, { useEffect, useState } from 'react';
import './SettingDropdown.scss';
import { Accordion, Button, SelectBox } from 'devextreme-react';
import SettingSubDropdown from './SettingSubDropdown';
import CustomCheckBox from './CustomCheckBox';
import { getPeriodIndicator } from '../../utils/gate-in-purchase';
import { setSettingConfig } from '../../utils/settingConfigAPI';
import { UseSettingContext } from '../../contexts/settingConfig';
import { UseHeaderContext } from '../../contexts/headerContext';
import { toastDisplayer } from "../../api/qrgenerators";


function SettingDropdown() {
    const { settingDropdownRef, setisSettingDropdownOpen, isSettingSubDropdownOpen, toggleSettingSubDropdown, setisSettingSubDropdownOpen } = UseHeaderContext();
    const { SettingValues, Dropdownchanged, isValueUpdated, setisValueUpdated, setSettingValues, OriginalSettingValues } = UseSettingContext();

    const handleCancel = async () => {
        setisValueUpdated(false);
        setisSettingDropdownOpen(false);
        setisSettingSubDropdownOpen(false);
        console.log("OriginalSettingValues", OriginalSettingValues);
        console.log("SettingValues", SettingValues);
        setSettingValues(OriginalSettingValues);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isSettingSubDropdownOpen) {
                if (settingDropdownRef.current && !settingDropdownRef.current.contains(event.target)) {
                    const isItemClicked = event.target.classList.contains('dx-list-item-content') ||
                        event.target.classList.contains('setting-icon') ||
                        event.target.classList.contains('quality-control-dropdown') ||
                        event.target.classList.contains('dx-checkbox-text') ||
                        event.target.classList.contains('dx-checkbox-icon') ||
                        event.target.classList.contains('dx-checkbox-container') ||
                        event.target.classList.contains('dropdown-body') ||
                        event.target.classList.contains('dx-accordion-item-title-caption') ||
                        event.target.classList.contains('subdropdown');
                    if (!isItemClicked) {
                        setisSettingDropdownOpen((prev) => {
                            setisValueUpdated(false);
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
    }, [settingDropdownRef, setisSettingDropdownOpen, isSettingSubDropdownOpen, setisValueUpdated]);

    const [selectedSeries, setSelectedSeries] = useState(SettingValues["Default Period Indicator"]);

    async function getPeriodIndicatorData() {
        try {
            return Promise.resolve((await getPeriodIndicator()).map(value => value.indicator));
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

    console.log("OriginalSettingValues", OriginalSettingValues);
    console.log("SettingValues", SettingValues);
    const handleSaveClick = async () => {
        try {
            // const response = await setSettingConfig(SettingValues);
            // console.log('Settings saved:', response);
            console.log('Settings saved:', SettingValues);
        } catch (error) {
            console.error('API Error:', error);
            return toastDisplayer('error', error.message);
        }
    };

    const SettingDropDownInputBox = (selectBoxGroup) => {
        const [dataSource, setDataSource] = useState([]);

        useEffect(() => {
            getPeriodIndicatorData()
                .then((result) => {
                    setDataSource(result);
                })
                .catch((error) => {
                    console.log(error);
                    return toastDisplayer('error', error.message);
                });
        }, []);

        return (
            <SelectBox
                dataSource={dataSource}
                stylingMode='outlined'
                searchEnabled={true}
                // selectedItem={dataSource[0]}
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
                        collapsible={isSettingSubDropdownOpen}
                        itemRender={(data) => data.html}
                        className="batch-serial-acrdn"
                        onItemTitleClick={() => {
                            if (isSettingSubDropdownOpen) {
                                setisSettingSubDropdownOpen(!isSettingSubDropdownOpen);
                            }
                        }}
                    />
                    <div className={`quality-control-dropdown ${isSettingSubDropdownOpen ? 'subdropdown-open' : ''}`} onClick={toggleSettingSubDropdown}>
                        Quality Control
                    </div>
                </div>
                <div className="dropdown-footer">
                    <div className='btn-group'>
                        <Button
                            className='my-button cancel-button'
                            text={'Cancel'}
                            stylingMode='outlined'
                            type='default'
                            onClick={handleCancel}
                        />
                        <Button
                            text={'Save'}
                            stylingMode='contained'
                            type='default'
                            className='my-button save-button'
                            onClick={handleSaveClick}
                            disabled={!isValueUpdated}
                        />
                    </div>
                </div>
            </div>
            {isSettingSubDropdownOpen && <SettingSubDropdown />}
        </div>
    );
}

export default SettingDropdown;
