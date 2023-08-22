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

  const proceedToItemsScan = (param,param1) => {
    console.log("params : " ,param1);
    console.log("navigate : " ,`/production/issue-material/verify-material/${param}`);
    navigate(`/production/issue-material/productionProcess/${param}/${param1}`);
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
    <QtcMainColumn IQCList={selectedPo} columns={columns} handleProceed1={proceedToItemsScan} displayname="headerQRCodeID" DownArrowKey="docEntry"/>
  );
};
export default PendingTabContent;