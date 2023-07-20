import { DataGrid } from "devextreme-react";
import {
  Column,
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
        className="content-block dx-card responsive-paddings"
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
          columnHidingEnabled={true}
        >
          <Scrolling columnRenderingMode="virtual" />
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
            allowedPageSizes={allowedPageSizes}
          />
          <SearchPanel visible={true} stylingMode={"outlined"} width={150} />
          <Selection mode="multiple" />

          <Column dataField={"itemCode"} width={90} hidingPriority={2} />
          <Column
            dataField={"itemName"}
            width={190}
            caption={"Item Name"}
            hidingPriority={8}
          />
          <Column
            dataField={"itmsGrpNam"}
            caption={"Item Group Name"}
            hidingPriority={6}
          />
          <Column
            dataField={"itmsSubGrpNam"}
            caption={"Items Sub Group Name"}
            hidingPriority={5}
          ></Column>
          <Column
            dataField={"uomName"}
            caption={"Uom Name"}
            hidingPriority={7}
          />

          <Column
            dataField={"qrMngByName"}
            caption={"Qr Managed By"}
            hidingPriority={3}
          />
          <Column
            dataField={"itemMngByName"}
            caption={"Item Managed By"}
            hidingPriority={3}
          />
          <Column
            dataField={"isActive"}
            caption={"Is Active"}
            hidingPriority={7}
          />
          <Export enabled={true} allowExportSelectedData={true} />
        </DataGrid>
      </div>
    </React.Fragment>
  );
}
