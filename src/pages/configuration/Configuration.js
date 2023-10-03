import React, { useEffect, useState } from 'react'
import './configuration.scss'
import { Button, SelectBox, TabPanel, Tabs } from 'devextreme-react'
import CustomCheckBox from './CustomCheckBox'
import { getPeriodIndicator } from '../../utils/gate-in-purchase';
// import { setSettingConfig } from '../../utils/settingConfigAPI';
import { UseSettingContext } from '../../contexts/settingConfig';
import { toastDisplayer } from "../../api/qrgenerators";
import { getWarehouse } from '../../utils/settingConfigAPI';
import { Item } from 'devextreme-react/accordion';


function Configuration() {
    const { SettingValues, Dropdownchanged, isValueUpdated } = UseSettingContext();

    const [selectedSeries, setSelectedSeries] = useState(SettingValues["Default Period Indicator"]);

    async function getwarehouseData() {
        try {
            return Promise.resolve((await getWarehouse()));
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

    async function getPeriodIndicatorData() {
        try {
            return Promise.resolve((await getPeriodIndicator()).map(value => value.indicator));
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
        <div className="custom-card">

            <div className="card-header">
                <Tabs
                    width={300}
                    selectedIndex={0}
                    // onItemClick={onItemClick}
                    id="selectTab"
                >
                    <Item text="Configuration"></Item>
                    <Item text="Quality Control"></Item>
                </Tabs>
            </div>
            <div className="card-body">
                <div className='checkbox-group'>
                    <fieldset className='checkbox-group-fieldset'>
                        <legend>Batch / Serial No Generation Method</legend>
                        <CustomCheckBox checkboxvalue={["Auto", "Manual"]} checkboxgroup={'Batch / Serial No Generation Method'} />
                    </fieldset>
                    <fieldset className='checkbox-group-fieldset'>
                        <legend>QR Managed by</legend>
                        <CustomCheckBox checkboxvalue={["None", "Manual", "Serial Numbar"]} checkboxgroup={'QR Managed by'} />
                    </fieldset>
                    <fieldset className='checkbox-group-fieldset'>
                        <legend>QR Generation Method</legend>
                        <CustomCheckBox checkboxvalue={["Transaction Wise QR", "Master Wise QR"]} checkboxgroup={'QR Generation Method'} />
                    </fieldset>
                    <fieldset className='checkbox-group-fieldset'>
                        <legend>Batch Type</legend>
                        <CustomCheckBox checkboxvalue={["Batch", "Batch + Project"]} checkboxgroup={'Batch Type'} />
                    </fieldset>
                </div>
                <div className='dropdown-group'>
                    <fieldset className='checkbox-group-fieldset'>
                        {/* <legend>Batch Type</legend> */}
                        <label>Default Period Indicator</label>
                        <SettingDropDownInputBox selectBoxGroup={"Default Period Indicator"} />
                        <label>GRPO Serise</label>
                        <SettingDropDownInputBox selectBoxGroup={"Default Period Indicator"} />
                        <label>Issue Serise</label>
                        <SettingDropDownInputBox selectBoxGroup={"Default Period Indicator"} />
                    </fieldset>
                    <fieldset className='checkbox-group-fieldset'>
                        <label>Issue Serise</label>
                        <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Enable Verify Material'} />
                        <label>Issue Serise</label>
                        <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Pro Rework Reason'} />
                    </fieldset>
                </div>
            </div>
            <div className="card-body">
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
                                    value={SettingValues['Warehouse'][index]}
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
            </div>

            <div className="card-footer">
                <div className='btn-group'>
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
    )
}

export default Configuration