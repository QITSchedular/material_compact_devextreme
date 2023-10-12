import React, { useContext, useEffect, useState } from 'react'
import { CheckBox } from 'devextreme-react/check-box';
import { UseSettingContext } from '../../../contexts/settingConfig';

export default function CustomCheckBox({ checkboxvalue, checkboxgroup }) {
    return (
        <>
            {
                checkboxvalue.map((value, index) => (
                    <div className='custom-checkbox' key={index}>
                        <CheckBox
                            text={value}
                            enableThreeStateBehavior={false}
                        />
                    </div>
                ))
            }
        </>
    )
}

