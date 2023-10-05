import React, { useState } from 'react'
import {
    PopupHeaderText,
    PopupSubText
} from '../../../components/typographyTexts/TypographyComponents'
import { useNavigate, useParams } from 'react-router-dom'
import QtcSearchColumn from '../../../components/qtcCommonComponent/qtcSearchColumn'
import { getPoLists } from '../../../utils/gate-in-purchase'
import { GRPOScanner } from '../../../assets/icon'
import { ValidateItemQR } from '../../../utils/grpo-saver'
import { toastDisplayer } from '../../../api/qrgenerators'
import { Button } from 'devextreme-react'
import QtcDataGrid from '../../../components/qtcCommonComponent/qtcDataGrid'
import TransparentContainer from '../../../components/qr-scanner/transparent-container'

const DeliveryProcess = () => {
    const navigate = useNavigate()
    const { qrCode, docEntry } = useParams()
    const [selectedItemQr, setSelectedItemQR] = useState(null)
    const [gridDataSource, setGridDataSource] = useState('')
    const [displayGrid, setDisplayGrid] = useState(false)
    const [uniqueIds, setUniqueIds] = useState(new Set());
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState([]);

    const handleTextValueChange = e => {
        return setSelectedItemQR(e.value)
    }

    const onRowRemoved = async () => {
        const newGridData = await gridDataSource
        if (newGridData.length === 0) {
            return setDisplayGrid(false)
        }
    }

    // on hit og search button
    const handleItemQrVerification = async (dataScanFromScanner) => {
        console.log("At handleItemQrVerification");
        console.log("The selectedItemQr is:", selectedItemQr);
        if (typeof dataScanFromScanner !== 'object' && dataScanFromScanner !== null) {
            const doItemExists = await ValidateItemQR(qrCode, dataScanFromScanner);
            if (doItemExists.hasError) {
                return toastDisplayer(
                    "error",
                    doItemExists.errorMessage.statusMsg
                );
            }

            // Filter out duplicate detailQRCodeID values
            const validatecheck = doItemExists.responseData;
            const newItems = validatecheck.filter((item) => {
                if (uniqueIds.has(item.detailQRCodeID)) {
                    console.log(`Duplicate data arrived: ${item.detailQRCodeID}`);
                    toastDisplayer("error", `${item.detailQRCodeID} Item already available`);
                    return false; // Filter out duplicates
                }
                return true; // Keep unique items
            });
            setDisplayGrid(true);

            // Update uniqueIds with the new item IDs
            newItems.forEach((item) => {
                uniqueIds.add(item.detailQRCodeID);
            });

            setGridDataSource((previous) => [...previous, ...newItems]);

        }
        else if (selectedItemQr) {
            const doItemExists = await ValidateItemQR(qrCode, selectedItemQr);
            if (doItemExists.hasError) {
                return toastDisplayer(
                    "error",
                    doItemExists.errorMessage.statusMsg
                );
            }

            // Filter out duplicate detailQRCodeID values
            const validatecheck = doItemExists.responseData;
            const newItems = validatecheck.filter((item) => {
                if (uniqueIds.has(item.detailQRCodeID)) {
                    console.log(`Duplicate data arrived: ${item.detailQRCodeID}`);
                    toastDisplayer("error", `${item.detailQRCodeID} Item already available`);
                    return false; // Filter out duplicates
                }
                return true; // Keep unique items
            });

            setDisplayGrid(true);

            // Update uniqueIds with the new item IDs
            newItems.forEach((item) => {
                uniqueIds.add(item.detailQRCodeID);
            });
            setGridDataSource((previous) => [...previous, ...newItems]);
        } else {
            setDisplayGrid(false);
            return toastDisplayer("error", "Scan the Item Qr first");
        }
    };

    const handleGrpoSaving = async () => {
        console.log('gridDataSource : ', gridDataSource)
        toastDisplayer("succes", `Delivery order generated successfully`);
        return navigate("/sales/delivery")
    }

    const handleScanner = () => {
        setShowScanner(true);
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

    const HandleCloseQrScanner = () => {
        setShowScanner(false);
    };

    const HandleDecodedData1 = (data1) => {
        // console.log("Scanned Data : ",data1);
        if (scannedData.includes(data1)) {
            console.log(`${data1} is already available.`);
        } else {
            setScannedData([...scannedData, data1]);
        }
        // setShowScanner(false);
    }

    const HandleSaveDecodedScannedData = async () => {
        setShowScanner(false);
        scannedData.forEach(async (scannedItem) => {
            await handleItemQrVerification(scannedItem);
            // alert(scannedItem);
        })
    }

    return (
        <div className='content-block dx-card responsive-paddings issue-material-container'>
            {showScanner && (
                <div>
                    <TransparentContainer
                        mountNodeId="containerInventry"
                        showScan={showScanner}
                        HandleCloseQrScanner1={HandleCloseQrScanner}
                        HandleDecodedData={HandleDecodedData1}
                        HandleSaveDecodedData={HandleSaveDecodedScannedData}
                    ></TransparentContainer>
                </div>
            )}
            <div className='header-section'>
                <PopupHeaderText text={'Delivery'} />
                <PopupSubText text={'All the item details at one place'} />
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
                        keyExpr='detailQRCodeID'
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
                                    className='default-button'
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