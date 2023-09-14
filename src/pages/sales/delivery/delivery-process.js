import React, { useState } from 'react'
import {
    PopupHeaderText,
    PopupSubText
} from '../../../components/typographyTexts/TypographyComponents'
import { useParams } from 'react-router-dom'
import QtcSearchColumn from '../../../components/qtcCommonComponent/qtcSearchColumn'
import { getPoLists } from '../../../utils/gate-in-purchase'
import { GRPOScanner } from '../../../assets/icon'
import { ValidateItemQR1 } from '../../../utils/grpo-saver'
import { toastDisplayer } from '../../../api/qrgenerators'
import { Button } from 'devextreme-react'
import QtcDataGrid from '../../../components/qtcCommonComponent/qtcDataGrid'

const DeliveryProcess = () => {
    const { qrCode, docEntry } = useParams()
    const [selectedItemQr, setSelectedItemQR] = useState(null)
    const [gridDataSource, setGridDataSource] = useState('')
    const [displayGrid, setDisplayGrid] = useState(false)

    const handleTextValueChange = e => {
        return setSelectedItemQR(e.value)
    }

    const onRowRemoved = async () => {
        const newGridData = await gridDataSource
        if (newGridData.length === 0) {
            return setDisplayGrid(false)
        }
    }

    // on hit of search button
    const handleItemQrVerification = async e => {
        if (selectedItemQr) {
            const doItemExists = await ValidateItemQR1(
                qrCode,
                selectedItemQr,
                docEntry
            )
            console.log('doItemExists : ', doItemExists)
            if (doItemExists === 'No data found') {
                return toastDisplayer(
                    'error',
                    'The scanned item does not belong to this P.O'
                )
            } else {
                setDisplayGrid(true)
                return setGridDataSource(previous => [...previous, ...doItemExists])
            }
        } else {
            setDisplayGrid(false)
            return toastDisplayer('error', 'Scan the Item Qr first')
        }
    }

    const handleGrpoSaving = async () => {
        console.log('gridDataSource : ', gridDataSource)
    }

    const handleScanner = () => {
        alert()
    }
    const keyArray1 = [
        {
            feildType: 'textBox',
            handlefunc: handleTextValueChange,
            placeholder: 'Type the item QR code',
            selectedRowsData: 'selectedRowsData',
            TextWithIcon: false
        },
        {
            feildType: 'button',
            handlefunc: handleItemQrVerification,
            btnIcon: 'search'
        },
        { feildType: 'button', handlefunc: handleScanner, btnIcon: GRPOScanner }
    ]
    return (
        <div className='content-block dx-card responsive-paddings issue-material-container'>
            <div className='header-section'>
                <PopupHeaderText text={'Issue Material'} />
                <PopupSubText text={'Type or scan the item code to make an entry'} />
            </div>
            <QtcSearchColumn
                popupHeaderText='Purchase Order List'
                popupSubHeaderText='Search the purchase order'
                keyArray={keyArray1}
                PopUpContent={getPoLists()}
                getparamFunc={handleItemQrVerification}
            />

            {displayGrid && (
                <div
                    style={{
                        marginTop: '1rem'
                    }}
                >
                    <QtcDataGrid
                        keyExpr='grpoDocEntry'
                        Data={gridDataSource}
                        onRowRemoved={onRowRemoved}
                    />

                    {gridDataSource.length > 0 && (
                        <>
                            <div
                                // className='cta-section'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '1rem'
                                }}
                            >
                                <Button
                                    text='Save'
                                    type='default'
                                    onClick={handleGrpoSaving}
                                    className='grpo-save'
                                    width={120}
                                    height={40}
                                ></Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
export default DeliveryProcess;