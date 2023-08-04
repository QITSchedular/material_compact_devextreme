import { Button, LoadPanel, TextBox } from "devextreme-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ValidateItemQR, generateGrpo } from "../../../utils/grpo-saver";
import TextArea from "devextreme-react/text-area";
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
import "./grpo-items.styles.scss";
import { useNavigation } from "../../../contexts/navigation";

const GrpoItems = () => {
  const { qrCode } = useParams();
  const [selectedItemQr, setSelectedItemQR] = useState(null);
  const [gridDataSource, setGridDataSource] = useState([]);
  const [displayGrid, setDisplayGrid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const handleTextValueChange = (e) => {
    // console.log(e.previousValue);
    // console.log(e.value);
    return setSelectedItemQR(e.value);
  };

  // on hit of search button
  const handleItemQrVerification = async (e) => {
    // validate the scanned item
    if (selectedItemQr) {
      const doItemExists = await ValidateItemQR(qrCode, selectedItemQr);
      if (doItemExists === "No data found") {
        // console.log("the scanned item does not exist");
        return toastDisplayer("error", "Invalid Qr Scan Request");
      } else {
        setDisplayGrid(true);
        return setGridDataSource((previous) => [...previous, ...doItemExists]);
      }
    } else {
      setDisplayGrid(false);
      return toastDisplayer("error", "Scan the Item Qr first");
    }
  };

  const handleGrpoSaving = async () => {
    if (!gridDataSource.length > 0) {
      toastDisplayer("error", " ❌ Request not allowed");
      return toastDisplayer("error", " ❌ Scan items to proceed");
    } else {
      setLoading(true);
      const doGrpo = await generateGrpo(gridDataSource, comments);
      console.log("doGrpo", doGrpo.isSaved);
      if (doGrpo.isSaved === "Y") {
        console.log("saved");
        setLoading(false);
        return toastDisplayer("succes", `${doGrpo.statusMsg}`);
      } else {
        console.log("error in save");
        setLoading(false);
        return toastDisplayer("error", `${doGrpo.statusMsg}`);
      }
    }
  };

  const onRowRemoved = async () => {
    const newGridData = await gridDataSource;
    if (newGridData.length === 0) {
      return setDisplayGrid(false);
    }
  };

  const handleComments = async (data) => {
    return await setComments(data);
  };
  const handleCancel = async (data) => {
    return navigate("/purchases/grpo");
  };

  return (
    <div className="content-block dx-card responsive-paddings grpo-content-wrapper">
      {loading && <LoadPanel visible={true} />}
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
      {displayGrid && (
        <>
          <DataGrid
            dataSource={gridDataSource}
            keyExpr="detailQRCodeID"
            showBorders={false}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onRowRemoving={onRowRemoved}
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
          {gridDataSource.length > 0 && (
            <>
              <div
                className="text-area-container"
                style={{ marginTop: "1rem" }}
              >
                <TextArea
                  height={40}
                  autoResizeEnabled={true}
                  defaultValue={""}
                  stylingMode="outlined"
                  placeholder="Add decscriptive comments(OPTIONAL..)"
                  onValueChange={handleComments}
                />
              </div>
              <div
                className="cta-section"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <Button
                  text="cancel"
                  className="grpo-cancel"
                  onClick={handleCancel}
                  width={120}
                  height={40}
                ></Button>
                <Button
                  text="Save"
                  type="default"
                  onClick={handleGrpoSaving}
                  className="grpo-save"
                  width={120}
                  height={40}
                ></Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GrpoItems;
