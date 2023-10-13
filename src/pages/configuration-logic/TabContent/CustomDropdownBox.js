import React, { useEffect, useState } from 'react'
import { toastDisplayer } from '../../../api/qrgenerators';
import { LoadPanel, SelectBox } from 'devextreme-react';
import { UseSettingContext } from '../../../contexts/settingConfig';

export default function CustomDropdownBox({ selectBoxGroup, fetchDataFunction, valueExpr, displayExpr }) {
    const { SettingValues, Dropdownchanged } = UseSettingContext();
    const [isSetValues, setIsSetValues] = useState(false);
    const [issueSeriesValue, setIssueSeriesValue] = useState(null);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (SettingValues) {
            console.log(SettingValues);
            fetchDataSource();
            setIsSetValues(true);
            setIssueSeriesValue(SettingValues["Delivery Serise"])
        }

    }, [SettingValues]);
    useEffect(() => {
        async function fetcher() {
            const response = await filterSettingValues();
            console.log("hasjkdgsdfj", response);
        }
        fetcher();
    }, [dataSource])


    const fetchDataSource = async () => {
        try {
            const response = await fetchDataFunction();
            if (SettingValues) {
                setDataSource(response);
            }
            return response;
        } catch (error) {
            console.log("fetchDataFunction", error)
            return error;
        }
    }
    const filterSettingValues = async () => {
        if (dataSource.length > 0) {
            console.log("okay");
            const givenSeriesData = dataSource.find(item => parseInt(item.series) === parseInt(issueSeriesValue))
            return givenSeriesData;
        }
    };
    return (
        <>
            {
                isSetValues && issueSeriesValue && (
                    // console.log("Ola", dataSource.find(item => parseInt(item.series) === parseInt(issueSeriesValue))),
                    // console.log("issueSeriesValue", typeof issueSeriesValue),
                    <>
                        <div
                            dangerouslySetInnerHTML={{ __html: selectBoxGroup }}
                        />
                        <SelectBox
                            dataSource={dataSource}
                            stylingMode='outlined'
                            searchEnabled={true}
                            valueExpr={valueExpr ? valueExpr : null}
                            displayExpr={displayExpr ? displayExpr : null}
                            // value={issueSeriesValue ? issueSeriesValue : "toaster"}
                            // value={dataSource[(() => {
                            //     let selectedIndex = null;
                            //     // dataSource.map((item, index) => {
                            //     //     if (String(item.series) === SettingValues[selectBoxGroup]) {
                            //     //         selectedIndex = index;
                            //     //     }
                            //     // });
                            //     // return selectedIndex;
                            //     dataSource.find((ite))
                            // })()].series}
                            // value={dataSource.filter(item => String(item.series) === SettingValues[selectBoxGroup]).series}
                            value={dataSource.find(item => parseInt(item.series) === parseInt(issueSeriesValue))}
                            onItemClick={value => Dropdownchanged(selectBoxGroup, value.itemData.seriesName)}
                        />

                    </>
                )
            }

        </>
    );
}
