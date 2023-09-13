import React, { useEffect, useState } from "react";
import DataGrid, {
  AsyncRule,
  Column,
  ColumnFixing,
  Editing,
  Pager,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import { Button, TextArea, TextBox } from "devextreme-react";

const allowedPageSizes = [10, 20, "all"];
const SelectedItemsListings = ({ scannedItemsData, productionIssueSaver }) => {
  // console.log(scannedItemsData);
  const [displayMode, setDisplayMode] = useState("full");
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [comments, setComments] = useState("");

  const calculateOpenQtyValue = (data) => {
    const { plannedQty, issuedQty } = data;
    const totalReceivableQuantity = (
      parseFloat(plannedQty) - parseFloat(issuedQty)
    ).toFixed(6);
    return [totalReceivableQuantity];
  };
  const handleGridSaving = (e) => {
    console.log(e.changes[0]);
  };
  const asyncValidation = (params) => {
    const { value } = params;
    const { plannedQty, issuedQty, qrQty } = params.data;
    console.log(params.data);
    const totalReceivableQuantity = (
      parseFloat(plannedQty) - parseFloat(issuedQty)
    ).toFixed(6);

    return new Promise((resolve, reject) => {
      if (parseFloat(value) > totalReceivableQuantity) {
        return reject(
          `Total Receivable Quantity should be smaller than or Equal to: ${totalReceivableQuantity}`
        );
      } else {
        console.log(value);
        return resolve(value);
      }
    });
  };
  const commentsHandler = (comments) => {
    return setComments(comments.value);
  };
  return (
    <>
      <DataGrid
        id="receive-materials-selected-listings-data-grid"
        className="pending-tab-data-grid"
        dataSource={scannedItemsData}
        keyExpr="detailQRCodeID"
        height={"100%"}
        showBorders={false}
        showColumnLines={false}
        columnAutoWidth={true}
        columnMinWidth={100}
        onSaving={handleGridSaving}
      >
        <Scrolling columnRenderingMode="virtual"></Scrolling>
        <Paging defaultPageSize={10} />
        <Selection mode={"single"} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          displayMode={displayMode}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Editing
          mode="row"
          useIcons={true}
          allowUpdating
          allowDeleting
          selectTextOnEditStart={true}
        />

        <ColumnFixing enabled={true} />
        <Column
          caption="Item Code"
          dataField={"itemCode"}
          allowEditing={false}
        />
        <Column
          caption="Item Name"
          dataField={"itemName"}
          allowEditing={false}
        />
        <Column
          caption="Planned Qty"
          dataField={"plannedQty"}
          allowEditing={false}
        />
        <Column
          caption="Previously issued Qty"
          dataField={"issuedQty"}
          allowEditing={false}
        />
        <Column
          caption="Open Qty"
          calculateCellValue={calculateOpenQtyValue}
          allowEditing={false}
        />
        <Column caption="Qr Qty." dataField={"qrQty"} allowEditing={false} />
        <Column caption="UOM" dataField={"uomCode"} allowEditing={false} />
        <Column caption="Project" dataField={"project"} allowEditing={false} />
        <Column
          caption="Issue Qty"
          dataField={"issQty"}
          allowEditing={true}
          dataType={"number"}
        >
          <AsyncRule validationCallback={asyncValidation} />
        </Column>
        <Column
          caption="Warehouse Code"
          dataField={"proWhsCode"}
          allowEditing={false}
        />
        <Column type="buttons" width={110} caption={"Actions"}>
          <Button name="edit" />
          <Button name="delete" />
        </Column>
      </DataGrid>
      <div
        className="action-button"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignSelf: "flex-end",
          bottom: "0px !important",
        }}
      >
        <TextArea
          placeholder="Add  Comments:(OPTIONAL)"
          maxHeight={41}
          width={"100%"}
          stylingMode="outlined"
          onValueChanged={commentsHandler}
        />
        <Button
          type="default"
          text="Issue"
          width={124}
          height={35}
          className="default-button"
          onClick={() => productionIssueSaver(scannedItemsData, comments)}
        />
      </div>
    </>
  );
};

export default SelectedItemsListings;

/*
    The section is to show the list of selected/scanned items in the dataGrid.
*/
