import React from 'react'
import { useCheckbox } from '../../contexts/settingConfig'; // Adjust the import path
import { CheckBox } from 'devextreme-react/check-box';

export default function CustomCheckBox({ checkboxvalue, checkboxgroup }) {
    const { checkboxValues, toggleCheckbox } = useCheckbox();

    const onValueChanged = (name, value) => {
        toggleCheckbox(name, value);
    };

    return (
        <>
            {
                checkboxvalue.map((value, index) => (
                    <div className='custom-checkbox' key={index}>
                        <CheckBox
                            text={value}
                            value={checkboxValues[checkboxgroup] === value}
                            onValueChanged={() => onValueChanged(checkboxgroup, value)}
                        />
                    </div>
                ))
            }
        </>
    )
}
