import React, { useEffect, useRef, useState } from "react";
import { Button } from "devextreme-react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import DataGrid, {
  Column,
  ColumnChooser,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import { getPoListsIC } from "../../../utils/incoming-QC";

function PurchaseOrderList({
  handleCancel,
  handleSave,
  handleDataGridRowSelection,
  dataGridRef,
  selectedRowKeys,
  fromDate,
  toDate,
}) {
  const [dataSource, setDataSource] = useState(null);
  const [error, setError] = useState(false);
  const [selectedRowKeysNew, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const dataGridDataHandler = async () => {
      const poListData = await getPoListsIC(fromDate, toDate);
      if (poListData.length > 0) {
        console.log("It has data");
        setSelectedRowKeys(selectedRowKeys);
        setDataSource(poListData);
        return setLoading(false); // Correct the state update to false
      } else {
        const { errorText } = poListData;
        return setError(errorText);
      }
    };
    setLoading(true);
    dataGridDataHandler();
  }, []);

  return (
    <>
      <div className="purchaseOrderList-main-containter">
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
        <div className="purchaseOrderList-data-section">
          <DataGrid
            height={420}
            dataSource={dataSource}
            keyExpr="poDocEntry"
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRef}
            selectedRowKeys={selectedRowKeysNew}
          >
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="infinite" />
            <Paging enabled={false} />
            <Column
              dataField="cardCode"
              alignment="left"
              caption={"Vendor Code"}
            />
            <Column
              dataField="cardName"
              alignment="left"
              caption={"Vendor Name"}
            />
            <Column dataField="poDocNum" alignment="left" caption={"PO No."} />
            <Column
              dataField="seriesName"
              alignment="left"
              caption={"Doc Date"}
              // dataType={"date"}
            />
          </DataGrid>
        </div>
        <div
          className="buttons-section"
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
            className="OkQcBtn"
          />
        </div>
      </div>
    </>
  );
}

export default PurchaseOrderList;
