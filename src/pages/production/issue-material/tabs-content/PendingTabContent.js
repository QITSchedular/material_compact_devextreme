import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import "./styles.scss";
import PendingTabGrid from "./PendingTabGrid";
import QtcDataGrid from "../../../../components/qtcCommonComponent/qtcDataGrid";
import { customers } from "./data.js";
import QtcMainColumn from "../../../../components/qtcCommonComponent/qtcMainColumn";
const PendingTabContent = ({selectedPo}) => {
  const navigate = useNavigate();
  const [isDataGridVisible, setIsDataGridVisible] = useState(false);

  const proceedToItemsScan = (param) => {
    console.log("params : " ,param);
    console.log("navigate : " ,`/production/issue-material/verify-material/${param}`);
    navigate(`/production/issue-material/productionProcess/${param}`);
  };


  const handleShowRealtiveDataGrid = () => {
    return setIsDataGridVisible(!isDataGridVisible);
  };
  const columns = [
    {
      caption: "Vendor Code",
      field: "cardCode",
    },
    {
      caption: "Vendor Ref No.",
      field: "cardCode",
    },
    {
      caption: "Vendor Name",
      field: "cardName",
    },
    {
      caption: "Doc Series",
      field: "series",
    },
    {
      caption: "Doc No.",
      field: "docNum",
    },
    {
      caption: "Doc Date",
      field: "docDate",
    },
    {
      caption: "Post Date",
      field: "postDate",
    },
    {
      caption: "Project",
      field: "project",
    },
    {
      caption: "Remark",
      field: "project",
    },
    {
      caption: "Doc Entry",
      field: "docEntry",
    },
  ];

  return (
    // <div className="pending-list-section">
    //   <div className="single-pending">
    //     <div className="single-pending-delete">
    //       <Button icon="trash"></Button>
    //     </div>

    //     <div className="single-pending-name">
    //       <span className="pending-name">{"CACDAHBH AH 000001"}</span>
    //       <Button
    //         icon="custom-chevron-down-icon"
    //         onClick={handleShowRealtiveDataGrid}
    //       ></Button>
    //     </div>

    //     <div className="single-pending-proceed">
    //       <Button text="Proceed" onClick={proceedToItemsScan}></Button>
    //     </div>
    //   </div>
    //   {isDataGridVisible && (
    //     <div className="data-grid-drop-down">
    //       {/* <PendingTabGrid /> */}
    //       <QtcDataGrid columns={columns} Data={customers} keyExpr="ID"/>
    //     </div>
    //   )}
    // </div>
    <QtcMainColumn IQCList={selectedPo} columns={columns} Data={selectedPo} keyExpr="ID" handleProceed1={proceedToItemsScan}/>
  );
};

export default PendingTabContent;
