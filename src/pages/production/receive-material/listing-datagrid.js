import React from "react";
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
/* For the drop down of the selected listing*/
const ListingDatagrid = ({ dataSource }) => {
  console.log(dataSource);
  return (
    <div>
      <DataGrid
        dataSource={dataSource}
        keyExpr="detailQRCodeID"
        showBorders={true}
        className="pending-tab-data-grid"
      >
        <Selection mode={"multiple"} />
        <Column dataField="cardCode" alignment="right" />
        <Column dataField="docNum" alignment="right" />
        <Column dataField="itemCode" alignment="right" />
        <Column dataField="whsCode" alignment="right" />
      </DataGrid>
    </div>
  );
};

export default ListingDatagrid;
