import { Button, TextBox } from "devextreme-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ValidateItemQR, generateGrpo } from "../../../utils/grpo-saver";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Scrolling,
  Selection,
  Button as DeleteButton,
  Pager,
} from "devextreme-react/data-grid";
import { toastDisplayer } from "../../../api/qrgenerators";
const GrpoItems = () => {
  const { qrCode } = useParams();
  const [selectedItemQr, setSelectedItemQR] = useState(null);
  const [gridDataSource, setGridDataSource] = useState([]);

  const handleTextValueChange = (e) => {
    // console.log(e.previousValue);
    // console.log(e.value);
    return setSelectedItemQR(e.value);
  };
  // on hit of search button
  const handleItemQrVerification = async (e) => {
    // validate the scanned item
    const doItemExists = await ValidateItemQR(qrCode, selectedItemQr);
    if (doItemExists === "No data found") {
      // console.log("the scanned item does not exist");
      return toastDisplayer("error", "Invalid Qr Scan Request");
    } else {
      return setGridDataSource((previous) => [...previous, ...doItemExists]);
    }
  };
  const handleGrpoSaving = async () => {
    // console.log("Yo there");
    // console.log(
    //   "This is the current Saved Data For Datgrid value",
    //   gridDataSource
    // );
    // console.log(gridDataSource.length);
    if (!gridDataSource.length > 0) {
      toastDisplayer("error", " ❌ Request not allowed");
      return toastDisplayer("error", " ❌ Scan items to proceed");
    } else {
      const doGrpo = await generateGrpo(gridDataSource);
      console.log(doGrpo);
    }
    console.log("Current request data: ", gridDataSource);
  };
  return (
    <div className="content-block dx-card responsive-paddings grpo-content-wrapper">
      <div className="title-section">
        <h3 className="title-name">Grpo</h3>
        <span className="title-description">
          Type or scan the item code to make an entry
        </span>
      </div>

      <div className="actions-section">
        <div className="search-section">
          <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Scan the items"
            width={250}
            showClearButton={true}
            onValueChanged={handleTextValueChange}
          ></TextBox>

          <Button
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={handleItemQrVerification}
          />
        </div>
      </div>
      {gridDataSource && (
        <>
          <DataGrid
            dataSource={gridDataSource}
            keyExpr="detailQRCodeID"
            showBorders={false}
            columnAutoWidth={true}
            hoverStateEnabled={true}
          >
            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              showInfo={true}
              showNavigationButtons={true}
            />
            <Scrolling columnRenderingMode="virtual" />
            {/* <Paging enabled={true} /> */}
            <Selection mode="multiple" allowSelectAll={false} />
            {/* <Column dataField={"docEntry"} caption={"Doc Entry"} /> */}
            <Editing mode={"row"} allowDeleting={true} />
            {/* <Column type={"buttons"} caption={"Actions"}>
            <DeleteButton icon="trash" />
          </Column> */}
          </DataGrid>
          <div
            className="cta-section"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button text="cancel" className="grpo-cancel"></Button>
            <Button
              text="Save"
              type="default"
              onClick={handleGrpoSaving}
              className="grpo-save"
            ></Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GrpoItems;
