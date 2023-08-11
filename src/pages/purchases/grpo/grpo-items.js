import { Button, LoadPanel, Popup, TextBox } from "devextreme-react";
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
import { HelpIcons } from "./icons-exporter";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { ToolbarItem } from "devextreme-react/popup";
import GrpoWarehouseChooserComponent, {
  WarehouseChooserTitle,
} from "./grpo-warehouse-chooser";

const GrpoItems = () => {
  const { qrCode } = useParams();
  const [selectedItemQr, setSelectedItemQR] = useState(null);
  const [gridDataSource, setGridDataSource] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [displayGrid, setDisplayGrid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [showWareHousePopupHelp, setShowWareHousePopupHelp] = useState(false);
  const [uniqueIds, setUniqueIds] = useState(new Set());
  const [choosenWarehouseName, setChoosenWarehouseName] = useState("");
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
        return toastDisplayer(
          "error",
          "The scanned item does not belong to this P.O"
        );
      } else {
        // Filter out duplicate detailQRCodeID values
        const newData = doItemExists.filter(
          (item) => !uniqueIds.has(item.detailQRCodeID)
        );
        setDisplayGrid(true);
        return setGridDataSource((previous) => [...previous, ...doItemExists]);
      }
    } else {
      setDisplayGrid(false);
      return toastDisplayer("error", "Scan the Item Qr first");
    }
  };

  const handleGrpoSaving = async () => {
    // return null;
    if (!gridDataSource.length > 0) {
      toastDisplayer(
        "error",
        " ❌ This request not allowed..Please Scan items to proceed"
      );
      return toastDisplayer("error", " ❌ Please Scan items to proceed");
    }
    if (
      selectedRowsData[0].length > 0 &&
      choosenWarehouseName !== selectedRowsData[0].whsCode
    ) {
      await setSelectedRowsData([]);
      return toastDisplayer(
        "error",
        "Invalid warehouse name, select one from the dropdown"
      );
    } else {
      if (selectedRowsData.length <= 0) {
        return toastDisplayer("error", "Choose warehouse to save the grpo");
        await setSelectedRowsData([]);
      }
      setLoading(true);
      const doGrpo = await generateGrpo(
        gridDataSource,
        comments,
        choosenWarehouseName
      );
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
  const helpOptions = {
    icon: HelpIcons,
    onClick: () => {
      warehousePopUpHandler();
    },
  };
  const saveButtonOptions = {
    width: 120,
    height: 40,
    text: "OK",
    type: "default",
    stylingMode: "contained",
    onClick: () => handleSaveSelectedPo(),
  };
  const handleSaveSelectedPo = () => {
    if (selectedRowsData.length > 0) {
      console.log("Current selected row data", selectedRowsData);
      console.log("Close the popup window");
      return setShowWareHousePopupHelp(false);
    } else {
      return toastDisplayer("error", "Please select a PO to save and proceed");
    }
  };
  const handleCancelNoSelection = () => {
    console.log("User have clicked the cancel buttpn, clear the selection");
    // setSelectedRowsData([]);
    return setShowWareHousePopupHelp(false);
  };
  const cancelButtonOptions = {
    width: 120,
    height: 40,
    text: "Cancel",
    type: "error",
    stylingMode: "contained",
    onClick: () => handleCancelNoSelection(),
  };
  const warehousePopUpHandler = async () => {
    console.log("Open pop up");
    return await setShowWareHousePopupHelp(true);
  };
  const popupCloseHandler = async () => {
    console.log("Open pop up");
    return await setShowWareHousePopupHelp(false);
  };
  const handleGrpoPoSelection = (params) => {
    console.log("from the handleGrpoPoSelection shbchjasbs", params);
    if (params.length > 0) {
      return setSelectedRowsData(params);
    }
  };
  const handleChoosenWareHouseChange = async (data) => {
    // if (selectedRowsData.length > 0) {
    //   return setChoosenWarehouseName(selectedRowsData[0].whsCode);
    // } else {
    //   setChoosenWarehouseName(data);

    // }
    console.log(data);
    await setChoosenWarehouseName(data.value);
  };
  return (
    <div className="content-block dx-card responsive-paddings grpo-content-wrapper grpo-items-wrapper">
      {loading && <LoadPanel visible={true} />}
      {showWareHousePopupHelp && (
        <Popup
          visible={true}
          showCloseButton={true}
          hideOnOutsideClick={popupCloseHandler}
          // contentRender={() => <GrpoWarehouseChooserComponent />}
          contentRender={() => (
            <GrpoWarehouseChooserComponent
              handleSaveSelectedWarehouse={handleGrpoPoSelection}
            />
          )}
          // hideOnOutsideClick={outSideHandler}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={cancelButtonOptions}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={saveButtonOptions}
            cssClass={"tootlbar-save-button"}
          />
        </Popup>
      )}

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
        <div className="warehouse-help-section">
          <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Warehouse"
            width={150}
            showClearButton={true}
            onValueChanged={handleChoosenWareHouseChange}
            value={
              selectedRowsData.length > 0 ? selectedRowsData[0].whsCode : ""
            }
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>
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
