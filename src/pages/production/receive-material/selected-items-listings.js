import React, { useState } from "react";
import DataGrid, {
  Column,
  Editing,
  Pager,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import { customers } from "./data";

const allowedPageSizes = [10, 20, "all"];
const SelectedItemsListings = () => {
  const [displayMode, setDisplayMode] = useState("full");
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  return (
    <div>
      <DataGrid
        id="receive-materials-selected-listings-data-grid"
        dataSource={customers}
        keyExpr="ID"
        showBorders={true}
        className="pending-tab-data-grid"
        height={440}
        columnAutoWidth={false}
        columnMinWidth={100}
      >
        <Scrolling columnRenderingMode="virtual"></Scrolling>
        <Paging defaultPageSize={10} />
        <Selection mode={"multiple"} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          displayMode={displayMode}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Editing />
      </DataGrid>
    </div>
  );
};

export default SelectedItemsListings;

/*
    The section is to show the list of selected/scanned items in the dataGrid.
*/
