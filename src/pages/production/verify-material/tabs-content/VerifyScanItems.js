import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../../components/typographyTexts/TypographyComponents";
import { Button, TextBox } from "devextreme-react";
import ScrollView from "devextreme-react/scroll-view";
import DataGrid, { Editing, Selection } from "devextreme-react/data-grid";
import { GRPOScanner } from "../../../../assets/icon";
import { toastDisplayer } from "../../../../api/qrgenerators";

const VerifyScanItems = () => {
  const [inputQrValue, setInputQrValue] = useState("");
  const [scannedItemQR, setScannedItemQR] = useState("");
  const [showDataGrid, setShowDataGrid] = useState(true);
  const [gridDataSource, setGridDataSource] = useState(false);

  const inputQrValueChangedCallback = ({ value }) => {
    setInputQrValue(value);
  };

  // handle things when the search button is clicked
  const scannedItemSearchHandler = () => {
    /*
    take the input value
    hit the api :
  */

    /* 
    if success -  
      check if the value is has already been scanned and it is present in the data - IF YES ALERT THE USER
        if no, the add to the data grid source 
  */

    /*
    check the length of the of the dataGridSource
      length > 0 - show DataGrid
      else show not Loaded
  */
    return setShowDataGrid(true);
  };

  /* ---------------- Data Grid issue handler ----------------------*/

  const handleIssue = async () => {
    return toastDisplayer("succes", "Handle the data saving issue");
  };

  /* ---------------- Data Grid issue handler ----------------------*/

  return (
    <div className="content-block dx-card responsive-paddings issue-material-container verify-material-scanned-items">
      <div className="header-section">
        <PopupHeaderText text={"Verify Material"} />
        <PopupSubText text={"Type or scan the item code to make an entry"} />
      </div>

      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Type or scan the items QR code"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={inputQrValueChangedCallback}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={scannedItemSearchHandler}
        />
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={() => console.log("first")}
        />
      </div>

      {showDataGrid && (
        <>
          <ScrollView>
            <div className="data-grid-section" style={{ marginTop: "1rem" }}>
              <div>
                <DataGrid
                  dataSource={items}
                  keyExpr="ID"
                  showBorders={false}
                  className="pending-tab-data-grid"
                >
                  <Selection mode={"multiple"} />
                  <Editing
                    Editing
                    mode="row"
                    allowUpdating={true}
                    allowDeleting={true}
                    useIcons={true}
                  />
                </DataGrid>
              </div>
            </div>
          </ScrollView>
          <div
            className="action-button"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              marginTop: "5rem",
            }}
          >
            <Button
              type="default"
              text="Issue"
              width={124}
              height={35}
              className="default-button"
              onClick={handleIssue}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyScanItems;

export const items = [
  {
    ID: 1,
    "Item Code": "ABC12",
    "Item Name": "Product A",
    "Available Qty": 75,
    "Planned Qty": 20,
    "Issued Qty": 15,
    UOM: "pcs",
    Project: "Project X",
    WareHouse: "Warehouse A",
  },
  {
    ID: 2,
    "Item Code": "DEF34",
    "Item Name": "Product B",
    "Available Qty": 50,
    "Planned Qty": 30,
    "Issued Qty": 25,
    UOM: "pcs",
    Project: "Project Y",
    WareHouse: "Warehouse B",
  },
  {
    ID: 3,
    "Item Code": "GHI56",
    "Item Name": "Product C",
    "Available Qty": 90,
    "Planned Qty": 40,
    "Issued Qty": 35,
    UOM: "pcs",
    Project: "Project Z",
    WareHouse: "Warehouse C",
  },
  {
    ID: 4,
    "Item Code": "JKL78",
    "Item Name": "Product D",
    "Available Qty": 70,
    "Planned Qty": 10,
    "Issued Qty": 5,
    UOM: "pcs",
    Project: "Project X",
    WareHouse: "Warehouse A",
  },
  {
    ID: 5,
    "Item Code": "MNO90",
    "Item Name": "Product E",
    "Available Qty": 60,
    "Planned Qty": 15,
    "Issued Qty": 10,
    UOM: "pcs",
    Project: "Project Y",
    WareHouse: "Warehouse B",
  },
  {
    ID: 6,
    "Item Code": "PQR12",
    "Item Name": "Product F",
    "Available Qty": 80,
    "Planned Qty": 25,
    "Issued Qty": 20,
    UOM: "pcs",
    Project: "Project Z",
    WareHouse: "Warehouse C",
  },
  {
    ID: 7,
    "Item Code": "STU34",
    "Item Name": "Product G",
    "Available Qty": 45,
    "Planned Qty": 5,
    "Issued Qty": 3,
    UOM: "pcs",
    Project: "Project X",
    WareHouse: "Warehouse A",
  },
  {
    ID: 8,
    "Item Code": "VWX56",
    "Item Name": "Product H",
    "Available Qty": 55,
    "Planned Qty": 18,
    "Issued Qty": 15,
    UOM: "pcs",
    Project: "Project Y",
    WareHouse: "Warehouse B",
  },
  {
    ID: 9,
    "Item Code": "YZA78",
    "Item Name": "Product I",
    "Available Qty": 95,
    "Planned Qty": 22,
    "Issued Qty": 18,
    UOM: "pcs",
    Project: "Project Z",
    WareHouse: "Warehouse C",
  },
  {
    ID: 10,
    "Item Code": "BCD90",
    "Item Name": "Product J",
    "Available Qty": 65,
    "Planned Qty": 12,
    "Issued Qty": 8,
    UOM: "pcs",
    Project: "Project X",
    WareHouse: "Warehouse A",
  },
];
