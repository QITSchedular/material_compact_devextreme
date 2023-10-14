import React, { useEffect, useState } from 'react'
// import { UseSettingContext } from '../../../contexts/settingConfig';
import { getWarehouse } from '../../../utils/settingConfigAPI';
import CustomSwitchBox from './CustomSwitchBox';
import CustomDropdownBox from './CustomDropdownBox';


export default function QCTab() {
    // const { SettingValues, Dropdownchanged } = UseSettingContext();

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

        // Dropdownchanged("Warehouse", selectedItems);
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

            <div className='warehouse-group'>
                <CustomSwitchBox switchGroup={'Quality Control'} />
                <fieldset className='warehouse-group-fieldset'>
                    <legend>Warehouse</legend>
                    {Array.from({ length: 4 }).map((_, index) => {
                        return (
                            <div className='warehouseselectionBox'>
                                <CustomDropdownBox
                                    selectBoxGroup={labels[index]}
                                    fetchDataFunction={() => { }}
                                />
                            </div>
                        )
                    })}
                </fieldset>
            </div>
        </>
    )
}
