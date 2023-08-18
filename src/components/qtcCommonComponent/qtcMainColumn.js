import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";
import QtcDataGrid from "./qtcDataGrid";
import "./qtc.scss";

function QtcMainColumn({ IQCList, columns, Data, keyExpr }) {
    const [isDataGridVisible, setIsDataGridVisible] = useState(false);
    const handleShowRealtiveDataGrid = () => {
        return setIsDataGridVisible(!isDataGridVisible);
      };
    // useEffect(()=>{},[IQCList])
  return (
    <>
      {IQCList.size > 0 && (
        <div className="pending-list-section">
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
            </div>
          ))}
      {isDataGridVisible && (
        <div className="data-grid-drop-down">
          {/* <PendingTabGrid /> */}
          <QtcDataGrid
            columns={columns}
            Data={Data}
            keyExpr={keyExpr}
          />
        </div>
      )}
        </div>
        </div>
      )}
    </>
  );
}

export default QtcMainColumn;
