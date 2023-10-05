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
import TransparentContainer from '../../../components/qr-scanner/transparent-container'
const PickPackProcess = () => {
  const { qrCode, docEntry } = useParams()
  const [selectedItemQr, setSelectedItemQR] = useState(null)
  const [gridDataSource, setGridDataSource] = useState('')
  const [displayGrid, setDisplayGrid] = useState(false)
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

  // on hit of search button
  const handleItemQrVerification = async (scanData) => {
    if (selectedItemQr) {
      const doItemExists = await ValidateItemQR1(
        qrCode,
        selectedItemQr,
        docEntry
      )
      console.log('doItemExists : ', doItemExists)
      if(doItemExists.hasError){
        return toastDisplayer(
          'error',
          doItemExists.errorText
        )
      }
      if (doItemExists === 'No data found') {
        return toastDisplayer(
          'error',
          'The scanned item does not belong to this P.O'
        )
      } else {
        setDisplayGrid(true)
        return setGridDataSource(previous => [...previous, ...doItemExists])
      }
    }else if(scanData!=null){
      const doItemExists = await ValidateItemQR1(
        qrCode,
        scanData,
        docEntry
      )
      if(doItemExists.hasError){
        return toastDisplayer(
          'error',
          doItemExists.errorText
        )
      }
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
    }
     else {
      setDisplayGrid(false)
      return toastDisplayer('error', 'Scan the Item Qr first')
    }
  }

  const handleGrpoSaving = async () => {
    console.log('gridDataSource : ', gridDataSource)
  }

  const handleScanner = () => {
    setShowScanner(true);
  }
  const keyArray1 = [
    {
      feildType: 'textBox',
      handlefunc: handleTextValueChange,
      placeholder: 'Type the item QR code',
      selectedRowsData: selectedItemQr,
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
  const HandleDecodedData1 = (data1)=>{
    // console.log("Scanned Data : ",data1);
    if (scannedData.includes(data1)) {
      console.log(`${data1} is already available.`);
    } else {
      setScannedData([...scannedData, data1]);
    }
    // setShowScanner(false);
  }
  const HandleSaveDecodedScannedData = async()=>{
    console.log("From HandleSaveDecodedScannedData",scannedData)
    setShowScanner(false);
    scannedData.forEach(async(scannedItem)=>{
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
        <PopupHeaderText text={'Pick & Packer'} />
        <PopupSubText text={'Search the sales order to pick the items'} />
      </div> */}
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
                className='cta-section'
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1rem'
                }}
              >
                <Button
                  text='Pick & Packed'
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
export default PickPackProcess;