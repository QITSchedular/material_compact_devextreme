import { SelectBox } from 'devextreme-react';
import React, { useEffect, useState } from 'react'
import { UseSettingContext } from '../../../contexts/settingConfig';
import { getWarehouse } from '../../../utils/settingConfigAPI';
import CustomSwitchBox from './CustomSwitchBox';


export default function QCTab() {
    const { SettingValues, Dropdownchanged } = UseSettingContext();

    async function getwarehouseData() {
        try {
            return Promise.resolve((await getWarehouse()));
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        getwarehouseData()
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
        try {
            return dataSource.filter(item => {
                if (!item || !item.whsCode) {
                    return true;
                }
                return !selectedItems.some(selectedItem => selectedItem && selectedItem.whsCode === item.whsCode);
            });
        } catch (error) {
            return dataSource;
        }
    };

    const labels = ["Incoming QC", "Inprocess QC", "Approved", "Rejeted"];
    return (
        <>
            <CustomSwitchBox switchGroup={'Quality Control'} />

            {/* <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Quality Control'} /> */}

            <fieldset>
                <legend>Warehouse</legend>
                {Array.from({ length: 4 }).map((_, index) => {
                    return (
                        <div className='warehouseselectionBox'>
                            <label>{`${labels[index]}`}</label>
                            <SelectBox
                                key={index}
                                // selectBoxGroup={"Default Period Indicator"}
                                className='warehouseDropdown'
                                dataSource={filterDataSource(index)}
                                stylingMode='outlined'
                                searchEnabled={true}
                                valueExpr={"whsCode"}
                                displayExpr={"whsName"}
                                value={SettingValues['Warehouse'][index] ? SettingValues['Warehouse'][index] : "Select Warehouse"}
                                onItemClick={(e) => {
                                    handleDropdownSelect(e.itemData, index);
                                }}
                                placeholder={selectedItems[index] ? selectedItems[index]["whsName"] : "Select Warehouse"}
                                useItemTextAsTitle={true}
                            />
                        </div>
                    )
                })}
            </fieldset>
        </>
    )
}
