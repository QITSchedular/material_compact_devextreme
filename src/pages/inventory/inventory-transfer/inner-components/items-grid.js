import React, { useState } from "react";
import DataGrid, {
  AsyncRule,
  Column,
  ColumnFixing,
  Editing,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import { toastDisplayer } from "../../../../api/qrgenerators";
import {
  inventoryTransferSaver,
  verifyProdcutionQrInput,
} from "../../../../api/inventory.transfer.api";
import { SwalDisplayer } from "../../../../utils/showToastsNotifications";
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
  selectedFromBin,
  selectedToBin,
  productionNumberInput,
  setDataGridDataSource,
  handleRefresh
}) => {
  console.log("Visible Data grid data source: ", dataGridDataSource);
  // const [dataSource, setDataGridDataSource] = useState([]);
  const [isSaveDisble, setSaveDisble] = useState(true);

  const refreshDataGrid = async () => {
    
    const apiRes = await verifyProdcutionQrInput(
      productionNumberInput,
      selectedFromWarehouse
    );
    const { hasError, errorMessage, responseData } = await apiRes;
    console.log("responseData",responseData)
    if (hasError === true) {
      const updatedDataGridDataSource = dataGridDataSource.filter(
        (dataItem) => dataItem.detailQRCodeID !== productionNumberInput
      );
      if(!updatedDataGridDataSource.length)
        handleRefresh();
  
      // Update the dataGridDataSource with the filtered array
      setDataGridDataSource(updatedDataGridDataSource);
  
      return;
    }
    responseData.qty_edit = 0;
  
    // Assuming dataGridDataSource is an array
    const updatedDataGridDataSource = dataGridDataSource.map((dataItem) => {
      if (dataItem.detailQRCodeID === responseData.detailQRCodeID) {
        return { ...dataItem, ...responseData }; // Merge dataItem with responseData
      }
      return dataItem; // Keep the original data item if no match
    });
  
    // Update the dataGridDataSource with the updated array
    setDataGridDataSource(updatedDataGridDataSource);
  };
  // Handle the editing of the cell recieved qty
  const asyncValidation = (params) => {
    return new Promise((resolve, reject) => {
      const { qty_edit, itemWhsStock } = params.data;
      if (
        parseFloat(qty_edit) == 0 ||
        parseFloat(qty_edit) > parseFloat(itemWhsStock)
      ) {
        return reject(
          "Transfer quantity can not be geater than Transferable quantity"
        );
      } else {
        setSaveDisble(false);
        return resolve(itemWhsStock);
      }
    });
  };
  const handleGridSaving = async (e) => {
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
    if (selectedToBin === "") {
      return toastDisplayer("error", "Select to warehouse bin location..");
    } else if (selectedToBin === "none") {
      selectedToBin = 0;
    } else if (selectedToBin.length) {
      selectedToBin = selectedToBin[0].absEntry;
    }

    const constructorData = await inventoryTransferSaver(
      dataGridDataSource,
      selectedFromWarehouse,
      selectedToWarehouse,
      selectedFromBin,
      selectedToBin
    );
    console.log("Inventory transfer api response", constructorData);
    if (constructorData.statusCode == 200) {
      refreshDataGrid();
      return SwalDisplayer("success", "Inventory Transfer successfull");
    }else if(constructorData["hasError"]===true){
      return toastDisplayer("error", constructorData.errorText);
    }
  };
  return (
    <>
      <DataGrid
        height={window.innerHeight - 90}
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
        {/* <Column
          caption="Transferable Qty."
          dataField={"itemWhsStock"}
          allowEditing={false}
        /> */}
        <Column
          caption="Quantity "
          dataField={"qty_edit"}
          allowEditing={true}
          defaultValue={"0"}
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
          disabled={isSaveDisble}
        />
      </div>
    </>
  );
};

export default ItemsGrid;
