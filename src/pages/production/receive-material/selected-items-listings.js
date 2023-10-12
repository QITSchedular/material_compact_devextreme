import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  ColumnFixing,
  Editing,
  Scrolling,
  Selection,
  Button,
  AsyncRule,
  Disabled
} from "devextreme-react/data-grid";
import { TextArea } from "devextreme-react";
import { Button as SaveButton } from "devextreme-react";

const SelectedItemsListings = ({
  receiverDataGridDataSource,
  draftReceiptSaver,
}) => {
  const [comments, setComments] = useState("");
  const [isReceiveButtonDisabled, setIsReceiveButtonDisabled] = useState(true); // State to manage button disable/enable

  useEffect(() => {
    // Update the disable state based on some condition (replace with your logic)
    // For example, you can enable the button if some condition is met.
    // Here, we're just disabling it by default.
    setIsReceiveButtonDisabled(true);
  }, []); // Empty dependency array to run this effect only once on component mount

  const asyncValidation = (params) => {
    const { value } = params;
    const { quantity } = params.data;

    return new Promise((resolve, reject) => {
      if (value > quantity) {
        console.log("Greated received");
        setIsReceiveButtonDisabled(true);
        return reject(`Receivable Quantity exceeded`);
      }
      if (value === 0) {
        setIsReceiveButtonDisabled(true);
        return reject(`Quantity must be greater than zero`);
      } else {
        console.log("Valid quantity", value);
        setIsReceiveButtonDisabled(false); // Enable the button when quantity is valid
        return resolve(value);
      }
    });
  };
  const commentsHandler = (comments) => {
    return setComments(comments.value);
  };

  return (
    <div className="receive-materials-selected-listings">
      <DataGrid
        id="receive-materials-selected-listings-data-grid"
        dataSource={receiverDataGridDataSource}
        keyExpr="docEntry"
        showBorders={true}
        className="pending-tab-data-grid"
        columnAutoWidth={false}
        columnMinWidth={50}
      >
        <Scrolling columnRenderingMode="virtual"></Scrolling>
        <Selection mode={"single"} />
        <Editing
          mode="row"
          useIcons={true}
          allowUpdating
          allowDeleting
          selectTextOnEditStart={true}
        />
        <ColumnFixing enabled={true} />
        <Column
          caption="Order Number"
          dataField={"docNum"}
          allowEditing={false}
          width={150}
        />
        <Column
          caption="Item Code"
          dataField={"itemCode"}
          allowEditing={false}
        />
        <Column
          caption="Production Code"
          dataField={"prodName"}
          allowEditing={false}
        />
        <Column
          caption="Series Number"
          dataField={"seriesName"}
          allowEditing={false}
        />
        <Column
          caption="Type"
          dataField={"type"}
          allowEditing={false}
          width={20}
        />
        <Column
          caption="Receiveable Qty"
          dataField={"quantity"}
          allowEditing={true}
          width={150}
        >
          <AsyncRule validationCallback={asyncValidation} />
        </Column>
        <Column
          caption="Planned Qty"
          dataField={"plannedQty"}
          allowEditing={false}
        />
        <Column
          caption="Completed Qty"
          dataField={"cmpltQty"}
          allowEditing={false}
        />
        <Column
          caption="WareHouse"
          dataField={"warehouse"}
          allowEditing={false}
        />
        <Column
          caption="Draft Receipt Qty"
          dataField={"receiptQty"}
          allowEditing={false}
        />
        <Column caption="UOM Code" dataField={"uomCode"} allowEditing={false} />
        <Column type="buttons" width={110} caption={"Actions"}>
          <Button name="edit" />
        </Column>
      </DataGrid>
      <div
        className="action-button"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignSelf: "flex-end",
        }}
      >
        <TextArea
          placeholder="Add  Comments:(OPTIONAL)"
          maxHeight={41}
          width={"100%"}
          stylingMode="outlined"
          onValueChanged={commentsHandler}
        />
        <SaveButton
          type="default"
          text="Receive"
          width={124}
          height={35}
          className="default-button"
          disabled={isReceiveButtonDisabled} // Disable the button based on the state
          onClick={() => draftReceiptSaver(receiverDataGridDataSource, comments)}
        />
      </div>
    </div>
  );
};

export default SelectedItemsListings;
