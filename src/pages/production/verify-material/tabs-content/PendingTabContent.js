import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import "./styles.scss";
import PendingTabGrid from "./PendingTabGrid";
import VerifyMaterialOrderList from "../varifyMaterial-OrderList";

const PendingTabContent = ({VerifyMaterialList,deleteItem}) => {
  const navigate = useNavigate();
  const [isDataGridVisible, setIsDataGridVisible] = useState(false);

  const proceedToItemsScan = () => {
    navigate("/production/verify-material/verify-items:prodid");
  };

  const handleShowRealtiveDataGrid = () => {
    return setIsDataGridVisible(!isDataGridVisible);
  };
  return (
    <div className="pending-list-section">
      {/* <div className="single-pending">
        <div className="single-pending-delete">
          <Button icon="trash"></Button>
        </div>

        <div className="single-pending-name">
          <span className="pending-name">{"CACDAHBH AH 000001"}</span>
          <Button
            icon="custom-chevron-down-icon"
            onClick={handleShowRealtiveDataGrid}
          ></Button>
        </div>

        <div className="single-pending-proceed">
          <Button text="Proceed" onClick={proceedToItemsScan}></Button>
        </div>
      </div>
      {isDataGridVisible && (
        <div className="data-grid-drop-down">
          <PendingTabGrid />
        </div>
      )} */}
       <div className="orderList-section">
        <VerifyMaterialOrderList IQCList2={VerifyMaterialList} deleteItem={deleteItem}/>
      </div>
    </div>
  );
};

export default PendingTabContent;
