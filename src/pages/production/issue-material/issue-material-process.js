import React, { useState } from 'react'
import './issue-material.styles.scss'
import {
  PopupHeaderText,
  PopupSubText
} from '../../../components/typographyTexts/TypographyComponents'
import { Navigate, useParams } from 'react-router-dom'
import QtcSearchColumn from '../../../components/qtcCommonComponent/qtcSearchColumn'
import { getPoLists } from '../../../utils/gate-in-purchase'
import { GRPOScanner } from '../../../assets/icon'
import { ValidateItemQR, generateGrpo } from '../../../utils/grpo-saver'
import { toastDisplayer } from '../../../api/qrgenerators'
import { Button } from 'devextreme-react'
import QtcDataGrid from '../../../components/qtcCommonComponent/qtcDataGrid'
const IssueMaterialProcess = () => {
  const { qrCode } = useParams()
  const [uniqueIds, setUniqueIds] = useState(new Set())
  const [selectedItemQr, setSelectedItemQR] = useState(null)
  const [gridDataSource, setGridDataSource] = useState([])
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
    // validate the scanned item
    if (selectedItemQr) {
      const doItemExists = await ValidateItemQR(qrCode, selectedItemQr)

      if (doItemExists === 'No data found') {
        // console.log("the scanned item does not exist");
        return toastDisplayer(
          'error',
          'The scanned item does not belong to this P.O'
        )
      } else {
        // Filter out duplicate detailQRCodeID values
        const newData = doItemExists.filter(
          item => !uniqueIds.has(item.detailQRCodeID)
        )
        setDisplayGrid(true)
        console.log('setGridDataSource : ', gridDataSource)
        return setGridDataSource(previous => [...previous, ...doItemExists])
      }
    } else {
      //   setDisplayGrid(false);
      return toastDisplayer('error', 'Scan the Item Qr first')
    }
  }

  const handleGrpoSaving = async () => {
    console.log("gridDataSource : ",gridDataSource);
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
        }}>

          <QtcDataGrid
            keyExpr='detailQRCodeID'
            Data={gridDataSource}
            onRowRemoved={onRowRemoved}

          >

          </QtcDataGrid>

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

export default IssueMaterialProcess
