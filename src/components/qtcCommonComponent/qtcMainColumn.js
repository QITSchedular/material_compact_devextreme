import React, { useEffect, useState } from 'react'
import { Button } from 'devextreme-react'
import QtcDataGrid from './qtcDataGrid'
import './qtc.scss'
import { Navigate } from 'react-router-dom'

function QtcMainColumn ({ IQCList, columns, Data, keyExpr,handleProceed1 }) {
  const [isDataGridVisible, setIsDataGridVisible] = useState(false)
  // const handleShowRealtiveDataGrid = () => {
  //   return setIsDataGridVisible(!isDataGridVisible)
  // }
  const [data, setData] = useState([])
  const handleShowRealtiveDataGrid = qrCode => {
    setData(prevData => ({
      ...prevData,
      [qrCode]: !prevData[qrCode] // Toggle the value
    }))
  }

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchData = async () => {
      try {
        const newData = {}
        ;[...IQCList].forEach(qrCode => {
          newData[qrCode] = false // Set initial value to false
        })
        setData(newData)
        // setData(jsonData); // Store the array of objects in the state
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData() // Call the function to fetch and update data
  }, [IQCList])

  const handleProceed = (qrCode) => {
    console.log(qrCode);
    return handleProceed1(qrCode);
    // return Navigate(`/purchases/grpo/scanItems/${qrCode}`);
  };
  // useEffect(()=>{},[IQCList])
  return (
    <>
      {IQCList.size > 0 && (
        <div className='pending-list-section'>
          <div className='po-list-section'>
            {[...IQCList].map((qrCode, index) => (
              <div key={index} className='single-po'>
                <div  className='single-po1'>
                  <div className='single-po-delete'>
                    <Button icon='trash'></Button>
                  </div>
                  <div className='single-po-name'>
                    <span className='po-name'>{qrCode}</span>
                    <Button
                      icon='custom-chevron-down-icon'
                      onClick={() => handleShowRealtiveDataGrid(qrCode)}
                    ></Button>
                  </div>
                  <div className='single-po-proceed'>
                    <Button
                      text='Proceed'
                      onClick={() => handleProceed(qrCode)}
                    ></Button>
                  </div>
                </div>
                <div  className='single-po'>
                {data[qrCode] && (
                  <div className='data-grid-drop-down'>
                    <QtcDataGrid
                      columns={columns}
                      Data={Data}
                      keyExpr={keyExpr}
                    />
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default QtcMainColumn
