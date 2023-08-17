import React from "react";
import DataGrid from "devextreme-react/data-grid";
import { customers } from "./data.js";

const columns = ["CompanyName", "City", "State", "Phone", "Fax"];
const PendingTabGrid = () => {
  return (
    <div>
      <DataGrid
        dataSource={customers}
        keyExpr="ID"
        defaultColumns={columns}
        showBorders={true}
      />
    </div>
  );
};

export default PendingTabGrid;
