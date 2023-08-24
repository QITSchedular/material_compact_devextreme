import React, { useState } from "react";
import { Button } from "devextreme-react";

function IncomingQCOrderList({ IQCList }) {
    const [isDataGridVisible, setIsDataGridVisible] = useState(false);
    const handleShowRealtiveDataGrid = () => {
        return setIsDataGridVisible(!isDataGridVisible);
      };
  return (
    <>
      {IQCList.size > 0 && (
        <div className="po-list-section">
          {[...IQCList].map((qrCode, index) => (
            <div key={index} className="single-po">
              <div className="single-po-delete">
                <Button icon="trash"></Button>
              </div>
              <div className="single-po-name">
                <span className="po-name">{qrCode}</span>
                <Button
                  icon="custom-chevron-down-icon"
                  onClick={handleShowRealtiveDataGrid}
                ></Button>
              </div>
              <div className="single-po-proceed">
                <Button
                  text="Proceed"
                  // onClick={() => handleProceed(qrCode)}
                ></Button>
              </div>
              {isDataGridVisible && (
                <div className="data-grid-drop-down">
                  {/* <PendingTabGrid /> */}
                  
                  {/* <QtcDataGrid columns={columns} Data={customers} keyExpr="ID"/> */}
                </div>
              )}
            </div>
           
          ))}
        </div>
        
      )}
    </>
  );
}

export default IncomingQCOrderList;
