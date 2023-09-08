import React, { useEffect, useRef, useState } from "react";
import {
  TextBox,
  Button as NormalButton,
  Button,
  ScrollView,
} from "devextreme-react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  ColumnChooser
} from "devextreme-react/data-grid";
import { getPoLists } from "../../../utils/gate-in-purchase";
import { toastDisplayer } from "../../../api/qrgenerators";

function ProductReceiptList({ handleCancel, handleSave, handleDataGridRowSelection, dataGridRef, selectedRowKeys }) {

  const [dataSource, setDataSource] = useState(null);
  const [error, setError] = useState(false);
  const [selectedRowKeysNew, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const dataGridDataHandler = async () => {
      const poListData = await getPoLists();
      console.log(poListData);
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
      {/* <ScrollView ScrollView width="100%" height="100%"> */}
      <div className="purchaseOrderList-main-containter">
        <div className="purchaseOrderList-header">
          <div
            className="purchaseOrderList-title-section responsive-paddings"
            style={{
              // padding: "5px 20px !important",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={"Receipt from Production"} />
            <PopupSubText text={"Search the receipt from production"} />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancel} />
          </div>
        </div>
        <div className="purchaseOrderList-data-section">
          <DataGrid
            height={420}
            dataSource={dataSource}
            keyExpr="docEntry"
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRef}
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
            <Column dataField="docNum" alignment="left" caption={"PO No."} />
            <Column
              dataField="docDate"
              alignment="left"
              caption={"Doc Date"}
              dataType={"date"}
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
      {/* </ScrollView> */}
    </>
  );
}

export default ProductReceiptList;
