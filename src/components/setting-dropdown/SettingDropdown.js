import React, { useEffect, useState } from 'react';
import './SettingDropdown.scss';
import { Accordion, SelectBox } from 'devextreme-react';
import SettingSubDropdown from './SettingSubDropdown';
import CustomCheckBox from './CustomCheckBox';
import { getPeriodIndicator } from '../../utils/gate-in-purchase';
import { UseSettingContext } from '../../contexts/settingConfig';

function SettingDropdown() {

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
        const [error, setError] = useState(null);

        useEffect(() => {
            getPeriodIndicatorData()
                .then((result) => {
                    setDataSource(result);
                })
                .catch((error) => {
                    setError(error);
                });
        }, []);

        if (error) {
            return <div>Error: {error.message}</div>;
        }

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
        // {
        //     title: 'QC',
        //     html: '',
        // }
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
                        onItemTitleClick={(e) => {
                            // if (e.itemIndex === 5) {
                            //     setIsSubDropdownOpen(!isSubDropdownOpen);
                            // }
                            // else {
                            // }
                            if (isSubDropdownOpen) {
                                return setIsSubDropdownOpen(!isSubDropdownOpen);
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
