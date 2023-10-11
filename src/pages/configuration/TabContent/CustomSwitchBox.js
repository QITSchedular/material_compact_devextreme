import { Switch } from 'devextreme-react'
import React from 'react'
import { UseSettingContext } from '../../../contexts/settingConfig';

function CustomSwitchBox({ switchGroup }) {
    const { SettingValues } = UseSettingContext();

    const onValueChanged = (newValue) => {
        SettingValues[switchGroup] = newValue.value;
    };

    return (
        <>
            <div className='cusotm-switch' style={{}}>
                <label>{switchGroup}</label>
                <Switch
                    // value={SettingValues[switchGroup] ? SettingValues[switchGroup] : null}
                    onValueChanged={onValueChanged}
                />
            </div>
        </>
    );
}

export default CustomSwitchBox;
