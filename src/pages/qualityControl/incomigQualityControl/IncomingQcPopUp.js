import React, { useEffect, useState } from "react";
import {
  Button
} from "devextreme-react";
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

function IncomingQcPopUp({
  handleCancel,
  handleSave,
  apiCallFun,
  keyExpr,
  columns,
  handleDataGridRowSelection,
  dataGridRef,
  selectedRowKeys,
  title,
  caption,
  selectedWarehouse,
}) {
  const [dataSource, setDataSource] = useState(null);
  //   const [error, setError] = useState(false);
  const [selectedRowKeysNew, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const dataGridDataHandler = async () => {
      const allDataList = await apiCallFun;
      if (allDataList.length > 0) {
        const newArray = allDataList.filter(
          (obj) => obj.whsCode !== selectedWarehouse[0]
        );
        setSelectedRowKeys(selectedRowKeys);
        setDataSource(newArray);
        return setLoading(false); // Correct the state update to false
      } else {
        // const { errorText } = poListData;
        // return setError(errorText);
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
              // padding: "5px 20px !important",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={title} />
            <PopupSubText text={caption} />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancel} />
          </div>
        </div>
        <div className="purchaseOrderList-data-section">
          <DataGrid
            // height={420}
            dataSource={dataSource}
            keyExpr={keyExpr}
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRef}
            selectedRowKeys={selectedRowKeysNew}
          >
            <ColumnChooser enabled={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="infinite" />
            <Paging enabled={false} />
            {columns &&
              columns.map((value, key) => (
                <Column
                  dataField={value["field"]}
                  caption={value["caption"]}
                  hidingPriority={6}
                ></Column>
              ))}
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
            // disabled={selectedRowKeys.length > 0 ? false : true}
          />
        </div>
      </div>
    </>
  );
}

export default IncomingQcPopUp;
