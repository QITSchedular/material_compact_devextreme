import React, { useState } from "react";
import DataGrid, {
  AsyncRule,
  Column,
  ColumnFixing,
  Editing,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import { toastDisplayer } from "../../../../api/qrgenerators";
import { inventoryTransferSaver } from "../../../../api/inventory.transfer.api";
const columns = [
  "Item Code",
  "Item Name",
  "From WareHouse",
  "To WareHouse",
  "Bin Location",
  "Warehouse Qty.",
  "Transfer Qty.",
  "Uom",
  "Project",
];

const ItemsGrid = ({
  dataGridDataSource,
  selectedFromWarehouse,
  selectedToWarehouse,
}) => {
  console.log("Visible Data grid data source: ", dataGridDataSource);
  const [dataSource, setDataGridDataSource] = useState([]);
  // Handle the editing of the cell recieved qty
  const asyncValidation = (params) => {
    return new Promise((resolve, reject) => {
      const { qty, transQty } = params.data;
      if (parseFloat(transQty) === 0) {
        return reject(
          "Transfer quantity must be between 0 and Transferable quantity"
        );
      } else {
        return resolve(transQty);
      }
    });
  };
  const handleGridSaving = (e) => {
    console.log(e.changes[0]);
    // if (!e.changes[0]) {
    //   return toastDisplayer(
    //     "error",
    //     "Please, receive the quantity first to proceed"
    //   );
    // }
    // const { key } = e.changes[0];
  };

  const inventorySaveHandler = async (dataGridDataSource) => {
    // console.log("dataGridDataSource : ", dataGridDataSource);
    const constructorData = await inventoryTransferSaver(
      dataGridDataSource,
      selectedFromWarehouse,
      selectedToWarehouse
    );
    console.log("Inventory transfer api response", constructorData);
    if (constructorData.statusCode == 200) {
      return toastDisplayer("succes", "Item transfer successful..");
    }
  };
  return (
    <>
      <DataGrid
        dataSource={dataGridDataSource}
        keyExpr="detailQRCodeID"
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        remoteOperations={true}
        onSaving={handleGridSaving}
      >
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
          caption="From Warehouse"
          dataField={"whs"}
          allowEditing={false}
        />
        <Column caption="To Warehouse" dataField={""} allowEditing={false} />
        <Column caption="Bin Location" dataField={""} allowEditing={false} />
        <Column
          caption="Total Item Stock"
          dataField={"itemStock"}
          allowEditing={false}
        />
        <Column
          caption="Warehouse Qty."
          dataField={"itemWhsStock"}
          allowEditing={false}
        />
        <Column
          caption="Transferable Qty."
          dataField={"qty"}
          allowEditing={true}
        >
          <AsyncRule validationCallback={asyncValidation} />
        </Column>
        <Column caption="Uom" dataField={"uoMCode"} allowEditing={false} />
        <Column caption="Project" dataField={"project"} allowEditing={false} />

        <Column type="buttons" width={110} caption={"Actions"} fixed={true}>
          <Button name="edit" />
          <Button name="delete" />
        </Column>
      </DataGrid>

      <div className="save-section">
        <Button
          className="default-button"
          type={"default"}
          text="Save"
          width={130}
          height={35}
          onClick={() => inventorySaveHandler(dataGridDataSource)}
        />
      </div>
    </>
  );
};

export default ItemsGrid;
