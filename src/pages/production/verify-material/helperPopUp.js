import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Button, DataGrid } from "devextreme-react";
import { getProductionOrder } from "../../../utils/production-verify-material";
import {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";

function HelperPopUp({
  handleSave,
  handleCancel,
  handleDataGridRowSelection,
  dataGridRef,
  selectedRowKeys,
}) {
  const [dataSource, setDataSource] = useState(null);
  const [error, setError] = useState(false);
  const [selectedRowKeysNew, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const dataGridDataHandler = async () => {
      const poListData = await getProductionOrder();
      if (poListData.length > 0) {
        console.log("It has data", poListData[0].dueDate);
        poListData.forEach((item) => {
          item.dueDate = formatDate(item.dueDate);
          item.startDate = formatDate(item.startDate);
        });
        setSelectedRowKeys(selectedRowKeys);
        setDataSource(poListData);
        return setLoading(false); // Correct the state update to false
      } else {
        const { errorText } = poListData;
        return setError(errorText);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yy = String(date.getFullYear()).slice(-2);

      return `${dd}/${mm}/${yy}`;
    };
    dataGridDataHandler();
  }, []);
  return (
    <>
      <div className="purchaseOrderList-main-containter ">
        <div className="purchaseOrderList-header">
          <div
            className="purchaseOrderList-title-section responsive-paddings"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={"Purchase Order List"} />
            <PopupSubText text={"Search the purchase order"} />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancel} />
          </div>
        </div>
        <div className="varify-popup">
          <DataGrid
            height={420}
            dataSource={dataSource}
            keyExpr="docEntry"
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRef}
            selectedRowKeys={selectedRowKeysNew}
          >
            <SearchPanel visible={true} />
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="infinite" />
            <Paging enabled={false} />
            <Column
              dataField="itemCode"
              alignment="left"
              caption={"Item Code"}
            // dataType={"date"}
            />
            <Column
              dataField="seriesName"
              alignment="left"
              caption={"Series Name"}
            />
            <Column
              dataField="prodName"
              alignment="left"
              caption={"Product Name"}
            />
            <Column
              dataField="startDate"
              alignment="left"
              caption="Start Date"
              dataType="date"
              format="shortDate"
            />
            <Column
              dataField="dueDate"
              alignment="left"
              caption="Due Date"
              dataType="date"
              format="shortDate"
            />
          </DataGrid>
        </div>
        <div
          className="btn-section"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            text="Cancel"
            width={124}
            height={35}
            onClick={handleCancel}
            className="cancelQcBtn"
          />
          <Button
            text="OK"
            type="default"
            width={124}
            height={35}
            onClick={handleSave}
            className=".dx-button-text"
          />
        </div>
      </div>
    </>
  );
}

export default HelperPopUp;
