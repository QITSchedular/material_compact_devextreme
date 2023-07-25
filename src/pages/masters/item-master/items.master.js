import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Export,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/dataContext";
import { getAllItems } from "../../../utils/items-master-data";
import HeaderContent from "./headerContent";
import "./items-master.scss";

const allowedPageSizes = [10, 20, 30];
export default function ItemsMaster() {
  const [itemsData, setItemsData] = useState();
  const {
    isPopupVisible,
    isItemAdded,
    openPopup,
    closePopup,
    newItemIsAdded,
    revertIsItemAdded,
  } = useContext(AppContext);

  useEffect(() => {
    const getData = async () => {
      const allItemsData = await getAllItems();
      setItemsData(allItemsData);
    };
    getData();
  }, []);
  useEffect(() => {
    const setDataAgain = async () => {
      if (isItemAdded) {
        const allItemsData = await getAllItems();
        setItemsData(allItemsData);
        revertIsItemAdded();
      }
    };
    setDataAgain();
  }, [isItemAdded]);

  return (
    <React.Fragment>
      <div
        className="content-block dx-card responsive-paddings items-master-content-wrapper"
        style={{
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <div className="content-blocks">
          <HeaderContent />
        </div>
        {/* <div
          id="exportContainer"
          style={{ marginTop: "5px", marginBottom: "5px" }}
        >
          <Button text="Refresh" icon="refresh" />
        </div> */}
        <DataGrid
          dataSource={itemsData}
          keyExpr={"itemCode"}
          showBorders={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          columnHidingEnabled={false}
          className="items-master-datagrid"
        >
          <Scrolling columnRenderingMode="virtual" />
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
            allowedPageSizes={allowedPageSizes}
          />
          <Editing allowUpdating={true} allowDeleting={true} />
          <SearchPanel visible={true} width={190} className={"search-panel"} />
          <Selection mode="multiple" />

          <Column dataField={"itemCode"} width={90} />
          <Column dataField={"itemName"} width={190} caption={"Item Name"} />
          <Column dataField={"itmsGrpNam"} caption={"Item Group Name"} />
          <Column
            dataField={"itmsSubGrpNam"}
            caption={"Items Sub Group Name"}
          ></Column>
          <Column dataField={"uomName"} caption={"Uom Name"} />

          <Column dataField={"qrMngByName"} caption={"Qr Managed By"} />
          <Column dataField={"itemMngByName"} caption={"Item Managed By"} />
          <Column dataField={"isActive"} caption={"Is Active"} />
          <Export enabled={true} allowExportSelectedData={true} />
        </DataGrid>
      </div>
    </React.Fragment>
  );
}
