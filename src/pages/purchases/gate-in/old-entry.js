import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  Editing,
  SearchPanel,
  ColumnFixing,
  Button,
} from "devextreme-react/data-grid";
import { GateInList } from "../../../utils/gate-in-purchase";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { toast } from "react-toastify";
import "./gate-in-styles.scss";
import { toastDisplayer } from "../../../api/qrgenerators";
import { LoadPanel, Popup } from "devextreme-react";

function OldEntryComponent() {
  const [scrollingMode, setScrollingMode] = React.useState("standard");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const transPortersData = await GateInList();
      if (transPortersData.length > 0) {
        setTransporterDataSource(transPortersData);
        setTimeout(() => {
          setLoading(false);
        }, 5000);
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
      {console.log("loading", loading)}
      {/* {loading && <LoadPanel visible={true} />} */}
      {loading ? (
        <div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Skeleton height={40} width={200} />
          </div>
          <Skeleton height={300} />
        </div>
      ) : (
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
          <SearchPanel visible={true} width={190} className={"search-panel"} />
          <Scrolling mode={scrollingMode} />
          <Paging defaultPageSize={10} />
          <Selection mode="multiple" allowSelectAll={false} />
          <ColumnFixing enabled={true} />
          <Editing
            mode="row"
            allowDeleting={true}
            allowUpdating={true}
            useIcons={true}
          >
            <Popup
              title="Employee Info"
              showTitle={true}
              width={700}
              height={525}
            />
          </Editing>
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
      )}

      <div
        className="content-block-save content-block-wrapper"
        style={{ justifyContent: "flex-end", marginTop: "10rem" }}
      ></div>
    </>
  );
}

export default OldEntryComponent;
