import React from 'react';
import './SettingSubDropdown.scss';
import { SelectBox } from 'devextreme-react';
import CustomCheckBox from './CustomCheckBox';

function SettingSubDropdown() {

    let SettingDropDownInputBox = ({ data }) => {
        return (
            <>
                <SelectBox dataSource={data} defaultValue={data[0]} stylingMode='outlined' />
            </>
        );
    };

    return (
        <div className={`subdropdown`}>
            <div className="subdropdown-header">
                <div className="heading">Quality Control</div>
                <div className="sub-heading">Quality control Setting</div>
            </div>
            <div className="subdropdown-body">
                <div className={`quality-control-dropdown`}>
                    Quality Control
                    <CustomCheckBox checkboxvalue={["Yes", "No"]} />
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
