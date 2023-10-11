// import { Switch } from 'devextreme-react'
// import React from 'react'

// function CustomSwitchBox({ switchVal, onValueChanged, switchGroup }) {
//     return (
//         <div style={{ "display": "flex", "alignItems": "center", "gap": "1rem", "marginBottom": "1rem" }}>
//             <label>{switchGroup}</label>
//             <Switch
//                 value={switchVal}
//                 onValueChanged={onValueChanged}
//             />
//         </div>
//     )
// }

// export default CustomSwitchBox

import { Switch } from 'devextreme-react'
import React, { useEffect, useState } from 'react'
import { UseSettingContext } from '../../../contexts/settingConfig';

function CustomSwitchBox({ switchGroup }) {
    const { SettingValues } = UseSettingContext();
    const [isSetValues, setIsSetValues] = useState(false);
    useEffect(() => {
        if (SettingValues) {
            setIsSetValues(true);
        }
    }, [SettingValues]);

    const onValueChanged = (newValue) => {
        SettingValues[switchGroup] = newValue.value;
        console.log("update", SettingValues);
    };


    return (
        <>
            {
                isSetValues &&
                <div className='cusotm-switch' style={{}}>
                    <label>{switchGroup}</label>
                    <Switch
                        value={SettingValues[switchGroup] ? SettingValues[switchGroup] : null}
                        onValueChanged={onValueChanged}
                    />
                </div>
            }
        </>
    );
}

export default CustomSwitchBox;
