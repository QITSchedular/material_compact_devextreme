import DataGrid, { Scrolling } from "devextreme-react/data-grid";
import "./MachineManagement.scss";
import { customers } from "./data";
import React, { useEffect, useState } from "react";
import FilterToolbar from "../../components/machineFilter/FilterToolbar";
import { parseDate } from "devextreme/localization";

function MachineManagement() {
  const [loginDetails , setLoginDetails] = useState([]);
  const columns = ["CompanyName", "City", "State", "Phone", "Fax"];

  function getLocalData() {
    const storedData = localStorage.getItem("loginUserDetail");
    const storeQr = localStorage.getItem("QrData");

   
    const dataArray = [];


    if (storedData) {
      const parsedData = JSON.parse(storedData);

      const ScannedData = JSON.parse(storeQr);

      const dataObject = {
        Id: parsedData.ID,
        ScannedData,
        name: parsedData.Name,
        Shift: parsedData.shift,
        Date: parsedData.Date,
        Time: parsedData.time,

      };

      dataArray.push(dataObject);

 
      console.log(dataArray);
      setLoginDetails(dataArray);
    } else {
      console.log("No data found in local storage.");
    }
  }

  useEffect(()=>{
    getLocalData();
  },[])

  return (
    <>
      <div className="machine-card">
        <div className="content-block-wrapper">
          <div className="content-block-1">
            <div className="content-text">
              <div className="Machine-header">Machine Management</div>
              <div className="Machine-text">
                Manage the machine and employee
              </div>
              <div className="filter-toolbar-row">
                <div className="Machine-text">Filter By</div>
                <FilterToolbar />
              </div>
            </div>
          </div>
        </div>
        <DataGrid
          dataSource={loginDetails}
          keyExpr="Id"
         
          showBorders={true}
        >
          <Scrolling columnRenderingMode="virtual" />
        </DataGrid>
      </div>
    </>
  );
}

export default MachineManagement;
