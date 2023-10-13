import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  Editing,
  SearchPanel,
  ColumnFixing,
  Button
} from "devextreme-react/data-grid";
import { GateInList } from "../../../utils/gate-in-purchase";

import { toast } from "react-toastify";
import "./gate-in-styles.scss";
import { toastDisplayer } from "../../../api/qrgenerators";

function OldEntryComponent() {
  const [scrollingMode, setScrollingMode] = React.useState("standard");
  const [loading, setLoading] = useState(true);

  const [transporterDataSource, setTransporterDataSource] = useState([]);
  // useEffect(() => {
  //     const OldEntryDataSource = async () => {
  //         const transPortersData = await GateInList();
  //         if (transPortersData.length > 0) {
  //             setTransporterDataSource(transPortersData);
  //             console.log(transPortersData);
  //         } else {

  //         }
  //     };

  //     OldEntryDataSource();
  // }, []);

  const OldEntryDataSource = async () => {
    try {
      const transPortersData = await GateInList();
      if (transPortersData.length > 0) {
        setTransporterDataSource(transPortersData);
      } else {
        // No data found, display the error message using your custom toaster function
        console.log("no data");
        return toastDisplayer("error", "No data found!");
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
      //toastDisplayer("error", "An error occurred while fetching data");
    }
  };
  useEffect(() => {
    OldEntryDataSource();
  }, []);

  return (
    <>
      <DataGrid
        id="data-grid-container-local"
        dataSource={transporterDataSource}
        keyExpr={"srNo"}
        showBorders={true}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        remoteOperations={true}
        height={400}
        className="gate-in-data-grid"
        
      >
        <SearchPanel
          visible={true}
          highlightCaseSensitive={true}
          height={40}
          className="search-panel"
        />
        <Scrolling mode={scrollingMode} />
        <Paging defaultPageSize={10} />
        <Selection mode="multiple"  allowSelectAll={false}/>
        <ColumnFixing enabled={true} />
        <Editing
          mode="row"
          allowDeleting={true}
          allowUpdating={true}
          useIcons={true}
        />
        <Column type="buttons" caption="Actions">
          <Button name="edit" />
          <Button name="delete" />
        </Column>
        <Column
          dataField={"docNum"}
          caption={"PO Document No."}
          allowEditing={false}
          width={182}
        />
        <Column
          dataField={"gateInNo"}
          caption={"Gate In No."}
          allowEditing={false}
        />

        <Column
          dataField={"recDate"}
          caption={"Recieved Date"}
          allowEditing={false}
        />
        <Column
          dataField={"vehicleNo"}
          caption={"Vehical No."}
          allowEditing={false}
        />
        <Column
          dataField={"transporterCode"}
          caption={"Transporter Code"}
          allowEditing={false}
        />
      </DataGrid>
      <div
        className="content-block-save content-block-wrapper"
        style={{ justifyContent: "flex-end", marginTop: "10rem" }}
      ></div>
    </>
  );
}

export default OldEntryComponent;
