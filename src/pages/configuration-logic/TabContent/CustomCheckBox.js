import React, { useContext, useEffect, useState } from 'react'
import { CheckBox } from 'devextreme-react/check-box';
import { UseSettingContext } from '../../../contexts/settingConfig';

export default function CustomCheckBox({ checkboxvalue, checkboxgroup }) {
    const { SettingValues, toggleCheckbox } = UseSettingContext();
    const [isSetValues, setIsSetValues] = useState(false);
    useEffect(() => {
        if (SettingValues) {
            setIsSetValues(true);
        }
    }, [SettingValues]);

    return (
        <>
            {isSetValues &&
                checkboxvalue.map((value, index) => (
                    <div className='custom-checkbox' key={index}>
                        <CheckBox
                            text={value}
                            value={SettingValues[checkboxgroup] && SettingValues[checkboxgroup][value] ? SettingValues[checkboxgroup][value] : ""}
                            onValueChange={(state) => toggleCheckbox(checkboxgroup, value, state)}
                            enableThreeStateBehavior={false}
                        />
                    </div>
                ))
            }
        </>
    )
}
