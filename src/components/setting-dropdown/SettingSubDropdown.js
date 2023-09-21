import React, { useEffect, useState } from 'react';
import './SettingSubDropdown.scss';
import { SelectBox } from 'devextreme-react';
import CustomCheckBox from './CustomCheckBox';
import { UseHeaderContext } from '../../contexts/headerContext';
import { getWarehouse } from '../../utils/gate-in-purchase';
import { UseSettingContext } from '../../contexts/settingConfig';


function SettingSubDropdown() {
    const {
        settingSubDropdownRef, setisSettingDropdownOpen,
        settingDropdownRef, isSettingDropdownOpen, setisSettingSubDropdownOpen } = UseHeaderContext();
    const { SettingValues, Dropdownchanged } = UseSettingContext();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSettingDropdownOpen) {
                if (settingSubDropdownRef.current && !settingSubDropdownRef.current.contains(event.target) && !settingDropdownRef.current.contains(event.target)) {
                    const isItemClicked = event.target.classList.contains('dx-list-item-content') ||
                        event.target.classList.contains('setting-icon') ||
                        event.target.classList.contains('dx-checkbox-text') ||
                        event.target.classList.contains('dx-checkbox-icon') ||
                        event.target.classList.contains('quality-control-dropdown') ||
                        event.target.classList.contains('dx-checkbox-container') ||
                        event.target.classList.contains('dx-texteditor-input') ||
                        event.target.classList.contains('dropdown-body');
                    if (!isItemClicked) {
                        setisSettingDropdownOpen((prev) => {
                            return !prev;
                        });

                        setisSettingSubDropdownOpen((prev) => {
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
    }, [settingSubDropdownRef, setisSettingDropdownOpen, settingDropdownRef, setisSettingSubDropdownOpen, isSettingDropdownOpen]);

    async function getPeriodIndicatorData() {
        try {
            return Promise.resolve((await getWarehouse()).map(value => value.whsName));
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

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

    const [selectedItems, setSelectedItems] = useState(Array(4).fill(null));

    const handleDropdownSelect = (itemData, dropdownIndex) => {
        setSelectedItems((prevSelectedItems) => {
            prevSelectedItems[dropdownIndex] = itemData;
            return [...prevSelectedItems];
        });
        Dropdownchanged("Warehouse", selectedItems);
    };

    const filterDataSource = (index) => {
        return dataSource.filter(item => !selectedItems.includes(item));
    };

    const labels = ["Incoming QC", "Inprocess QC", "Approved", "Rejeted"];


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

                    <fieldset>
                        <legend>Warehouse</legend>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div className='warehouseselectionBox'>
                                <label>{`${labels[index]}`}</label>
                                <SelectBox
                                    key={index}
                                    // selectBoxGroup={"Default Period Indicator"}
                                    className='warehouseDropdown'
                                    dataSource={filterDataSource(index)}
                                    stylingMode='outlined'
                                    searchEnabled={true}
                                    selectedItem={SettingValues['Warehouse'][index]}
                                    onItemClick={(e) => {
                                        handleDropdownSelect(e.itemData, index);
                                    }}
                                    placeholder={selectedItems[index] ? selectedItems[index] : "Select Warehouse"}
                                    useItemTextAsTitle={true}
                                />
                            </div>
                        ))}
                    </fieldset>
                </div>
            </div>
        </div>
    );
}

export default SettingSubDropdown;
