import React, { useState } from "react";
import { Button } from "devextreme-react";
import ScrollView from "devextreme-react/scroll-view";
import DataGrid, { Editing, Selection } from "devextreme-react/data-grid";

const IssuedTabContent = () => {
  const [showDataGrid, setShowDataGrid] = useState(false);

  const showDataGridHandler = () => {
    return setShowDataGrid(!showDataGrid);
  };

  return (
    <>
      <div className="pending-list-section">
        <div className="single-pending">
          <div className="single-pending-delete">
            <Button icon="trash"></Button>
          </div>

          <div className="single-pending-name">
            <span className="pending-name">{"CACDAHBH AH 000001"}</span>
            <Button
              icon="custom-chevron-down-icon"
              onClick={showDataGridHandler}
            ></Button>
          </div>
        </div>
      </div>
      {showDataGrid && (
        <>
          <div className="data-grid-section" style={{ marginTop: "1rem" }}>
            <ScrollView>
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
            </ScrollView>
          </div>
        </>
      )}
    </>
  );
};

export default IssuedTabContent;

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
];
