import React, { useEffect, useState } from 'react'
import { Button } from 'devextreme-react'
import QtcDataGrid from './qtcDataGrid'
import './qtc.scss'

function QtcMainColumn ({
  IQCList,
  columns,
  handleProceed1,
  displayname,
  DownArrowKey
}) {
  const [data, setData] = useState([])
  const handleShowRealtiveDataGrid = qrCode => {
    setData(prevData => ({
      ...prevData,
      [qrCode]: !prevData[qrCode]
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = {}
        ;[...IQCList].forEach(qrCode => {
          newData[qrCode] = false
        })
        setData(newData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [IQCList])

  const handleProceed = (qrCode, docEntry) => {
    return handleProceed1(qrCode, docEntry)
  }
  return (
    <>
      {IQCList.size > 0 && (
        <div className='po-list-section'>
          {[...IQCList].map((item, index) => (
            <div key={index} className='single-po'>
              <div className='single-po1'>
                <div className='single-po-delete'>
                  <Button icon='trash'></Button>
                </div>
                <div className='single-po-name'>
                  <span className='po-name'>{item[displayname]}</span>
                  <Button
                    icon='custom-chevron-down-icon'
                    onClick={() =>
                      handleShowRealtiveDataGrid(item[DownArrowKey])
                    }
                  ></Button>
                </div>
                <div className='single-po-proceed'>
                  <Button
                    text='Proceed'
                    onClick={() =>
                      handleProceed(item[displayname], item[DownArrowKey])
                    }
                  ></Button>
                </div>
              </div>
              <div className='single-po2'>
                {data[item['docEntry']] && (
                  <div className='data-grid-drop-down'>
                    <QtcDataGrid
                      columns={columns}
                      Data={[item]}
                      keyExpr='docEntry'
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default QtcMainColumn
