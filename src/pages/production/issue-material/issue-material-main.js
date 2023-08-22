import React, { useState } from 'react'
import {
  PopupHeaderText,
  PopupSubText
} from '../../../components/typographyTexts/TypographyComponents'
import Tabs, { Item } from 'devextreme-react/tabs'
import { toastDisplayer } from '../../../api/qrgenerators'
import ApprovedTabContent from './tabs-content/ApprovedTabContent'
import PendingTabContent from './tabs-content/PendingTabContent'
import RejectedTabContent from './tabs-content/RejectedTabContent'

import './issue-material.styles.scss'
import QtcSearchColumn from '../../../components/qtcCommonComponent/qtcSearchColumn'
import { getPoLists, searchPoListsIQC } from '../../../utils/gate-in-purchase'

const IssueMaterialMain = () => {
  const [grpoList, setGrpoList] = useState(new Set())
  const [activeTab, setActiveTab] = useState('Pending') // Set default active tab
  const [selectedPo, setSelectedPo] = useState('')
  const [loading, setLoading] = useState(false)
  const tabsItemClickHandler = e => {
    const selectedTab = e.itemData.text
    setActiveTab(selectedTab)
  }
  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Approved':
        return <ApprovedTabContent />
      case 'Pending':
        return <PendingTabContent selectedPo={grpoList} />
      case 'Rejected':
        return <RejectedTabContent />
      default:
        return null
    }
  }

  const handlePoVerification = async param => {
    if (param.length > 0 && param) {
      setSelectedPo(param)
      const doPoExists = await searchPoListsIQC(param[0].qrCodeID)
      var doProuctExist
      if (grpoList.size > 0) {
        doProuctExist = false
        grpoList.forEach(value => {
          if (value.headerQRCodeID == param[0].qrCodeID) {
            doProuctExist = true
            return
          }
        })
      } else {
        doProuctExist = false
      }
      if (doProuctExist && doPoExists) {
        return toastDisplayer('error', 'QR Code already exists in the list!')
      } else if (doPoExists && !doProuctExist) {
        setGrpoList(prevGrpoList => {
          const updatedSet = new Set(prevGrpoList)
          doPoExists.forEach(response => {
            updatedSet.add(response)
          })
          return updatedSet
        })
      } else if (doProuctExist === 'No data found') {
        return toastDisplayer(
          'error',
          'The scanned item does not belong to this P.O'
        )
      }
    } else {
      return toastDisplayer('error', 'Please type/scan P.O')
    }
  }

  const keyArray1 = [
    {
      feildType: 'textBox',
      handlefunc: 'handleTextValueChange',
      placeholder: 'Search by purchase order',
      selectedRowsData: 'selectedRowsData',
      TextWithIcon: true
    },
    { feildType: 'button', handlefunc: handlePoVerification, btnIcon: 'search' }
  ]
  return (
    <div className='content-block dx-card responsive-paddings issue-material-container'>
      <div className='header-section'>
        <PopupHeaderText text={'Issue Material'} />
        <PopupSubText text={'Search the production number to verify'} />
      </div>

      <QtcSearchColumn
        popupHeaderText='Purchase Order List'
        popupSubHeaderText='Search the purchase order'
        keyArray={keyArray1}
        PopUpContent={getPoLists()}
        getparamFunc={handlePoVerification}
      />

      <div className='issue-material-main-section'>
        <Tabs
          width={300}
          selectedIndex={0}
          id='selectTab'
          onItemClick={tabsItemClickHandler}
        >
          <Item text='Pending'></Item>
          <Item text='Approved'></Item>
          <Item text='Rejected'></Item>
        </Tabs>
      </div>
      <div className='issue-material-tabs-content'>{renderTabContent()}</div>
    </div>
  )
}

export default IssueMaterialMain
