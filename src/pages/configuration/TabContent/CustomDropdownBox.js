import React, { useEffect, useState } from 'react'
import { SelectBox } from 'devextreme-react';
import { UseSettingContext } from '../../../contexts/settingConfig';

export default function CustomDropdownBox({ selectBoxGroup, fetchDataFunction, valueExpr, displayExpr }) {
    const { SettingValues, Dropdownchanged } = UseSettingContext();
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (SettingValues) {
            fetchDataSource();
        }

    }, [SettingValues]);

    const fetchDataSource = async () => {
        try {
            const response = await fetchDataFunction();
            if (SettingValues) {
                setDataSource(response);
            }
            return response;
        } catch (error) {
            return error;
        }
    }

    return (
        <>
            <div
                dangerouslySetInnerHTML={{ __html: selectBoxGroup }}
            />
            <SelectBox
                // dataSource={dataSource}
                stylingMode='outlined'
                searchEnabled={true}
            // value={dataSource[0].series}
            />
        </>
    );
}
