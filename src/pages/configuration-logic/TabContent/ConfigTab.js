import React from 'react'
import CustomCheckBox from './CustomCheckBox'
import CustomDropdownBox from './CustomDropdownBox'
// import { UseSettingContext } from '../../../contexts/settingConfig';
import { getDeliverySerise, getIssueSerise, getReceiptSerise } from '../../../utils/settingConfigAPI';
import { getPeriodIndicator } from '../../../utils/gate-in-purchase';
import CustomSwitchBox from './CustomSwitchBox';

export default function ConfigTab() {
    // const { SettingValues } = UseSettingContext();
    // console.log("SettingValues", SettingValues);

    return (
        <>
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
                <fieldset className='dropdown-group-fieldset'>
                    <legend>Series</legend>
                    <div>
                        {/* <CustomDropdownBox
                            selectBoxGroup={"Default Period Indicator"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getPeriodIndicator()).map(value => value.indicator));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        /> */}
                        {/* <CustomDropdownBox
                            selectBoxGroup={"GRPO Serise <span style='color:red'>No API</span>"}
                            valueExpr={"series"}
                            displayExpr={"seriesName"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getIssueSerise()));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        /> */}
                        <CustomDropdownBox
                            selectBoxGroup={"Issue Serise"}
                            valueExpr={"series"}
                            displayExpr={"seriesName"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getIssueSerise()));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <CustomDropdownBox
                            selectBoxGroup={"Receipt Series"}
                            valueExpr={"series"}
                            displayExpr={"seriesName"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getReceiptSerise()));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        />
                        <CustomDropdownBox
                            selectBoxGroup={"Delivery Serise"}
                            valueExpr={"series"}
                            displayExpr={"seriesName"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getDeliverySerise()));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        />
                        {/* <CustomDropdownBox
                            selectBoxGroup={"Inventory Transfer Serise <span style='color:red'>No API</span>"}
                            valueExpr={"series"}
                            displayExpr={"seriesName"}
                            fetchDataFunction={async () => {
                                try {
                                    return Promise.resolve((await getIssueSerise()));
                                } catch (error) {
                                    return Promise.reject(error.message);
                                }
                            }}
                        /> */}
                    </div>
                </fieldset>
                <fieldset className='switch-group-fieldset'>
                    <legend>Others</legend>
                    <CustomSwitchBox switchGroup={'Enable Verify Material'} />
                    <CustomSwitchBox switchGroup={'Pro Rework Reason'} />
                    {/* <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Enable Verify Material'} /> */}
                    {/* <CustomCheckBox checkboxvalue={["Yes", "No"]} checkboxgroup={'Pro Rework Reason'} /> */}
                </fieldset>
            </div>
        </>
    )
}
