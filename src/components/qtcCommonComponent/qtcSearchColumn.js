import React, { useEffect, useRef, useState } from 'react'
import Button from 'devextreme-react/button'
import {TextBox,Button as NormalButton,Button as TextBoxButton} from 'devextreme-react/text-box'
import { DataGrid, Popup } from 'devextreme-react'
import { ToolbarItem } from 'devextreme-react/autocomplete'
import { PopupHeaderText,PopupSubText } from '../typographyTexts/TypographyComponents'
import { Column,Paging,Scrolling,SearchPanel,Selection } from 'devextreme-react/data-grid'
import { HelpIcons } from '../../pages/purchases/grpo/icons-exporter'
import { toastDisplayer } from '../../api/qrgenerators'

const PopupContent = ({popupHeaderText,popupSubHeaderText,onSave,PopUpContent,selectedRowsData}) => {
  const [dataSource, setDataSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState('')
  const dataGridRef = useRef()

  const handleDataGridRowSelection = async ({selectedRowKeys,selectedRowsData}) => {
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[length - 1]
      )
      return selectedRowSetter(value)
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[0]
      )
      return selectedRowSetter(value)
    }
  }

  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params)
    return onSave(params)
  }

  useEffect(() => {
    setLoading(true)
    const dataGridDataHandler = async () => {
      const poListData = await PopUpContent
      console.log(poListData)
      if (poListData.length > 0) {
        console.log('It has data')
        setDataSource(poListData)
        return setLoading(false) // Correct the state update to false
      } else {
        const { errorText } = poListData
        return setError(errorText)
      }
    }
    setLoading(true)
    dataGridDataHandler()
  }, [])

  return (
    <>
      {error ? (
        <div
          className='loader-displayer'
          style={{
            margin: '50px',
            height: '200px',
            padding: '25px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div className='text-section'>Data Could not be loaded..</div>
          <div className='text-section'>Click outside to exit</div>
        </div>
      ) : (
        <div className='responsive-paddings grpo-po-help-container'>
          <div className='header-section'>
            <PopupHeaderText text={popupHeaderText} />
            <PopupSubText text={popupSubHeaderText} />
          </div>
          <DataGrid
            height={420}
            dataSource={dataSource}
            keyExpr='docEntry'
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            selectedRowKeys={
              selectedRowsData.length > 0 ? [selectedRowsData[0].docEntry] : ''
            }
            ref={dataGridRef}
          >
            <SearchPanel visible={true} />
            <Selection mode='multiple' />
            <Scrolling columnRenderingMode='infinite' />
            <Paging enabled={false} />
            <Column
              dataField='cardCode'
              alignment='left'
              caption={'Vendor Code'}
            />
            <Column
              dataField='cardName'
              alignment='left'
              caption={'Vendor Name'}
            />
            <Column dataField='docNum' alignment='left' caption={'PO No.'} />
            <Column
              dataField='docDate'
              alignment='left'
              caption={'Doc Date'}
              dataType={'date'}
            />
          </DataGrid>
        </div>
      )}
    </>
  )
}

const QtcSearchColumn = ({popupHeaderText,popupSubHeaderText,keyArray,PopUpContent,getparamFunc}) => {
  const [selectedRowsData, setSelectedRowsData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [showPoHelp, setShowPoHelp] = useState(false)
  const showPopupHandler = () => {
    return setShowPoHelp(true)
  }
  const handleGrpoPoSelection = params => {
    if (params.length > 0) {
      return setSelectedRowsData(params)
    }
  }
  const handleCancelNoSelection = () => {
    return setShowPoHelp(false)
  }
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler()
    }
  }
  const handleSaveSelectedPo = () => {
    console.log('The save button has been clicked')
    if (selectedRowsData.length > 0) {
      setSelectedData(selectedRowsData)
      return setShowPoHelp(false)
    } else {
      return toastDisplayer("error", "Please select a PO to save and proceed");
    }
  }

  const cancelButtonOptions = {
    width: 120,
    height: 40,
    text: 'Cancel',
    type: 'error',
    stylingMode: 'contained',
    onClick: () => handleCancelNoSelection()
  }
  const saveButtonOptions = {
    width: 120,
    height: 40,
    text: 'Save',
    type: 'default',
    stylingMode: 'contained',
    onClick: () => handleSaveSelectedPo()
  }
  const selectedRowSetter = async () => {
    return getparamFunc(selectedData)
  }
  return (
    <div className='search-section'>
      {showPoHelp && (
        <Popup
          visible={true}
          showCloseButton={true}
          contentRender={() => (
            <PopupContent
              popupHeaderText={popupHeaderText}
              popupSubHeaderText={popupSubHeaderText}
              PopUpContent={PopUpContent}
              onSave={handleGrpoPoSelection}
              selectedRowsData={selectedRowsData}
            />
          )}
        >
          <ToolbarItem
            widget='dxButton'
            toolbar='bottom'
            location='after'
            options={cancelButtonOptions}
          />
          <ToolbarItem
            widget='dxButton'
            toolbar='bottom'
            location='after'
            options={saveButtonOptions}
            cssClass={'tootlbar-save-button'}
          />
        </Popup>
      )}
      {keyArray &&
        keyArray.map((item, index) => {
          const key = item.feildType
          const handlefunc = item.handlefunc
          const selectedData = item.selectedRowsData
          const placeholder = item.placeholder
          const btnIcon = item.btnIcon
          const TextWithIcon = item.TextWithIcon
          if (key === 'textBox') {
            if (TextWithIcon) {
              return (
                <TextBox
                  className='dx-field-value'
                  stylingMode='outlined'
                  placeholder={placeholder}
                  width={250}
                  showClearButton={true}
                  onValueChanged={handlefunc}
                  value={
                    selectedRowsData.length > 0
                      ? selectedRowsData[0].qrCodeID
                      : ''
                  }
                  // disabled={selectedData.length > 0 ? false : true}
                >
                  <TextBoxButton
                    name='currency'
                    location='after'
                    options={helpOptions}
                  />
                </TextBox>
              )
            } else {
              return (
                <TextBox
                  className='dx-field-value'
                  stylingMode='outlined'
                  placeholder={placeholder}
                  width={250}
                  showClearButton={true}
                  onValueChanged={handlefunc}
                  value={
                    selectedRowsData.length > 0
                      ? selectedRowsData[0].qrCodeID
                      : ''
                  }
                  // disabled={selectedData.length > 0 ? false : true}
                ></TextBox>
              )
            }
          } else if (key === 'button') {
            if (btnIcon == 'search') {
              return (
                <Button
                  width={33}
                  height={33}
                  type='normal'
                  stylingMode='outlined'
                  icon={btnIcon}
                  onClick={selectedRowSetter}
                />
              )
            } else {
              return (
                <Button
                  width={33}
                  height={33}
                  type='normal'
                  stylingMode='outlined'
                  icon={btnIcon}
                  onClick={handlefunc}
                />
              )
            }
          }
        })}
    </div>
  )
}
export default QtcSearchColumn
