import {
  Button,
  DropDownButton,
  LoadIndicator,
  LoadPanel,
  Popup,
  TextBox,
} from "devextreme-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ValidateItemQR,
  binLocationController,
  generateGrpo,
  wareHouseList,
} from "../../../utils/grpo-saver";
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
import { GRPOScanner } from "../../../assets/icon";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

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
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState([]);

  const [qcWareHouseData, setQcWareHouseData] = useState("");
  const [qcWareHouseSelectedData, setQcWareHouseSelectedData] = useState("");
  const [defaultChoosenQcWareHouse, setDefaultChoosenQcWarehouse] = useState(
    []
  );
  const [choosenQcWareHouseBinData, setChoosenQcWareHouseBinData] =
    useState("");
  const [qcBinIsNotActivated, setQcBinIsNotActivated] = useState(false); // default is true is activated

  //Non qc details

  const [nonQcWareHouseData, setNonQcWareHouseData] = useState("");
  const [defaultChoosenNonQcWareHouse, setDefaultChoosenNonQcWarehouse] =
    useState([]);
  const [nonqcWareHouseSelectedData, setnonQcWareHouseSelectedData] =
    useState("");
  const [qcWareHouseBinData, setQcWareHouseBinData] = useState("");
  const [nonQcBinIsNotActivated, setNonQcBinIsNotActivated] = useState(false);

  const [nonQcWareHouseBinData, setNonQcWareHouseBinData] = useState("");
  const [choosenNonQcWareHouseBinData, setChoosenNonQcWareHouseBinData] =
    useState("");

  const [refNo, setRefNo] = useState("");

  const navigate = useNavigate();
  const handleTextValueChange = async (e) => {
    return await setSelectedItemQR(e.value);
  };

  // on hit of search button
  const handleItemQrVerification = async (dataScanFromScanner) => {
    console.log("At handleItemQrVerification");
    console.log("The selectedItemQr is:", selectedItemQr);
    if (
      typeof dataScanFromScanner !== "object" &&
      dataScanFromScanner !== null
    ) {
      const doItemExists = await ValidateItemQR(qrCode, dataScanFromScanner);
      if (doItemExists.hasError) {
        return toastDisplayer("error", doItemExists.errorMessage.statusMsg);
      }

      // Filter out duplicate detailQRCodeID values
      const validatecheck = doItemExists.responseData;
      const newItems = validatecheck.filter((item) => {
        if (uniqueIds.has(item.detailQRCodeID)) {
          console.log(`Duplicate data arrived: ${item.detailQRCodeID}`);
          toastDisplayer(
            "error",
            `${item.detailQRCodeID} Item already available`
          );
          return false; // Filter out duplicates
        }
        return true; // Keep unique items
      });
      setDisplayGrid(true);

      // Update uniqueIds with the new item IDs
      newItems.forEach((item) => {
        uniqueIds.add(item.detailQRCodeID);
      });

      setGridDataSource((previous) => [...previous, ...newItems]);
    } else if (selectedItemQr) {
      const doItemExists = await ValidateItemQR(qrCode, selectedItemQr);
      if (doItemExists.hasError) {
        return toastDisplayer("error", doItemExists.errorMessage.statusMsg);
      }

      // Filter out duplicate detailQRCodeID values
      const validatecheck = doItemExists.responseData;
      const newItems = validatecheck.filter((item) => {
        if (uniqueIds.has(item.detailQRCodeID)) {
          console.log(`Duplicate data arrived: ${item.detailQRCodeID}`);
          toastDisplayer(
            "error",
            `${item.detailQRCodeID} Item already available`
          );
          return false; // Filter out duplicates
        }
        return true; // Keep unique items
      });

      setDisplayGrid(true);

      // Update uniqueIds with the new item IDs
      newItems.forEach((item) => {
        uniqueIds.add(item.detailQRCodeID);
      });
      setGridDataSource((previous) => [...previous, ...newItems]);
    } else {
      setDisplayGrid(false);
      return toastDisplayer("error", "Scan the Item Qr first");
    }
  };

  const handleGrpoSaving = async () => {
    if (!gridDataSource.length > 0) {
      return toastDisplayer("error", " ❌ Please Scan items to proceed");
    }
    if (
      selectedRowsData.length > 0 &&
      choosenWarehouseName !== selectedRowsData[0].whsCode
    ) {
      await setSelectedRowsData([]);
      return toastDisplayer(
        "error",
        "Invalid warehouse name, select one from the dropdown"
      );
    } else {
      if (selectedRowsData.length == 0) {
        return toastDisplayer("error", "Choose warehouse to save the grpo");
      }
      setLoading(true);
      const series = "102";
      const numAtCard = "8985698";
      const doGrpo = await generateGrpo(
        gridDataSource,
        comments,
        choosenWarehouseName,
        series,
        numAtCard,
        defaultChoosenQcWareHouse,
        choosenQcWareHouseBinData,
        defaultChoosenNonQcWareHouse,
        choosenNonQcWareHouseBinData
      );
      if (doGrpo.isSaved === "Y") {
        // console.log("saved");
        setLoading(false);
        setGridDataSource([]);
        toastDisplayer("succes", `${doGrpo.statusMsg}`);
        navigate("/purchases/grpo");
      } else {
        // console.log("error in save");
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
      return setShowWareHousePopupHelp(false);
    } else {
      return toastDisplayer("error", "Please select a PO to save and proceed");
    }
  };
  const handleCancelNoSelection = () => {
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
    return await setShowWareHousePopupHelp(true);
  };
  const popupCloseHandler = async () => {
    return await setShowWareHousePopupHelp(false);
  };
  const handleGrpoPoSelection = (params) => {
    if (params.length > 0) {
      return setSelectedRowsData(params);
    }
  };
  const handleChoosenWareHouseChange = async (data) => {
    await setChoosenWarehouseName(data.value);
  };

  // scanner handlers
  const handleScan = () => {
    setShowScanner(true);
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };

  const HandleDecodedData1 = (data1) => {
    if (scannedData.includes(data1)) {
      console.log(`${data1} is already available.`);
    } else {
      setScannedData([...scannedData, data1]);
    }
    // setShowScanner(false);
  };

  const scanAndSearchFromScanner = () => {
    return handleItemQrVerification();
  };

  const HandleSaveDecodedScannedData = async () => {
    console.log("From HandleSaveDecodedScannedData", scannedData);
    setShowScanner(false);

    scannedData.forEach(async (scannedItem) => {
      await handleItemQrVerification(scannedItem);
    });
  };

  useEffect(() => {
    if (showScanner && selectedItemQr) {
      console.log("Inside the use effect");
      handleItemQrVerification();
    }
  }, [selectedItemQr]);

  useEffect(() => {
    if (gridDataSource.length > 0) {
      const getAllWarehouses = async () => {
        const response = await wareHouseList();

        setQcWareHouseData(response);
        setNonQcWareHouseData(response);

        const choosenQcWarehouse = response.find(
          (item) => item.whsCode === "VD-QA"
        );
        console.log("choosenQcWarehouse is ", choosenQcWarehouse);

        const choosenNonQcWarehouse = response.find(
          (item) => item.whsCode === "VD-Maint"
        );
        console.log("choosenNonQcWarehouse is ", choosenNonQcWarehouse);

        // choosen qc warehouse things
        if (choosenQcWarehouse) {
          setDefaultChoosenQcWarehouse([choosenQcWarehouse]);
          if (choosenQcWarehouse.binActivat === "No") {
            console.log(
              "Bin for this choosenQcWarehouse has not been activated"
            );
            await setQcBinIsNotActivated(true);
          }
          if (choosenQcWarehouse.binActivat === "Yes") {
            console.log("Bin for this choosenQcWarehouse has been activated");
            setQcBinIsNotActivated(false);
            const bindata = await getBinForQcWareHouse(choosenQcWarehouse);
            console.log("Choosen QcWarehouse has been activated", bindata);
          }
        }

        // choosen no qc warehouse
        if (choosenNonQcWarehouse) {
          const nonQcConfiguartion = await nonQcConfigurationController(
            choosenNonQcWarehouse
          );
        }
      };
      getAllWarehouses();
    }
  }, [gridDataSource]);

  const nonQcConfigurationController = async (choosenNonQcWarehouse) => {
    setDefaultChoosenNonQcWarehouse([choosenNonQcWarehouse]);
    if (choosenNonQcWarehouse.binActivat === "No") {
      console.log("No qc ware bin has noot been activated");
      setNonQcBinIsNotActivated(true);
    }
    if (choosenNonQcWarehouse.binActivat === "Yes") {
      console.log("No qc ware bin has been activated");
      setNonQcBinIsNotActivated(false);
      await getBinForNonQcWareHouse(choosenNonQcWarehouse);
    }
  };

  const getBinForQcWareHouse = async (choosenQcWarehouse) => {
    const binLocationDetailsResp = await binLocationController(
      choosenQcWarehouse
    );
    if (!binLocationDetailsResp.hasError) {
      const { responseData } = binLocationDetailsResp;
      setQcWareHouseBinData(responseData);
    }
  };
  const getBinForNonQcWareHouse = async (choosenQcWarehouse) => {
    const binLocationDetailsResp = await binLocationController(
      choosenQcWarehouse
    );
    if (!binLocationDetailsResp.hasError) {
      const { responseData } = binLocationDetailsResp;
      setNonQcWareHouseBinData(responseData);
    }
  };

  const qcWarehouseItemsClick = async ({ itemData }) => {
    await setQcWareHouseSelectedData(itemData);
  };
  const qcWareHouseBinItemClick = async ({ itemData }) => {
    return await setChoosenQcWareHouseBinData(itemData);
  };

  const nonqcWarehouseItemsClick = async ({ itemData }) => {
    await setnonQcWareHouseSelectedData(itemData);
  };
  const nonQcWareHouseBinItemClick = async ({ itemData }) => {
    console.log("nonQcWareHouseBinItemClick", itemData);
    await setChoosenNonQcWareHouseBinData(itemData);
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
              handleCloseButton={popupCloseHandler}
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

      {showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="container"
            showScan={showScanner}
            HandleCloseQrScanner1={HandleCloseQrScanner}
            HandleDecodedData={HandleDecodedData1}
            HandleSaveDecodedData={HandleSaveDecodedScannedData}
          ></TransparentContainer>
        </div>
      )}

      <div className="title-section">
        <PopupHeaderText text={"Grpo"} />
        <PopupSubText text={"Type or scan the item code to make an entry"} />
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
            width={40}
            height={40}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={handleItemQrVerification}
          />

          <Button
            width={40}
            height={40}
            type="normal"
            stylingMode="outlined"
            icon={GRPOScanner}
            onClick={handleScan}
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
            height={40}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
              height={40}
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
          {gridDataSource.length > 0 &&
            defaultChoosenQcWareHouse.length > 0 && (
              <>
                <div className="grpo-config-section">
                  <div className="single-config">
                    <span className="config-label">Qc Warehouse: </span>
                    <DropDownButton
                      text={
                        defaultChoosenQcWareHouse
                          ? defaultChoosenQcWareHouse[0].whsName
                          : "Select Warehouse"
                      }
                      width={"100%"}
                      items={defaultChoosenQcWareHouse}
                      keyExpr={"whsCode"}
                      displayExpr={"whsName"}
                      className="config-dropdown"
                      onItemClick={qcWarehouseItemsClick}
                      height={40}
                      disabled={true}
                    />
                  </div>
                  <div className="single-config">
                    <span className="config-label">Qc Bin: </span>
                    <DropDownButton
                      text={
                        choosenQcWareHouseBinData
                          ? choosenQcWareHouseBinData.binCode
                          : "Choose Bin"
                      }
                      keyExpr={"absEntry"}
                      displayExpr={"binCode"}
                      items={qcWareHouseBinData}
                      width={"100%"}
                      className="config-dropdown"
                      height={40}
                      disabled={true}
                      onItemClick={qcWareHouseBinItemClick}
                    ></DropDownButton>
                  </div>
                  <div className="single-config">
                    <span className="config-label">Non Qc Warehouse: </span>
                    <DropDownButton
                      text={
                        defaultChoosenNonQcWareHouse
                          ? defaultChoosenNonQcWareHouse[0].whsName
                          : "No warehouse selected"
                      }
                      items={defaultChoosenNonQcWareHouse}
                      width={"100%"}
                      keyExpr={"whsCode"}
                      displayExpr={"whsName"}
                      className="config-dropdown"
                      onItemClick={nonqcWarehouseItemsClick}
                      height={40}
                      id="non-qcWarehouse"
                      disabled={true}
                    />
                  </div>
                  <div className="single-config">
                    <span className="config-label">Non Qc Bin: </span>
                    <DropDownButton
                      text={
                        choosenNonQcWareHouseBinData
                          ? choosenNonQcWareHouseBinData.binCode
                          : "Choose Bin"
                      }
                      width={"100%"}
                      className="config-dropdown"
                      height={40}
                      items={nonQcWareHouseBinData}
                      keyExpr={"absEntry"}
                      displayExpr={"binCode"}
                      disabled={
                        nonQcBinIsNotActivated ? nonQcBinIsNotActivated : false
                      }
                      onItemClick={nonQcWareHouseBinItemClick}
                    />
                  </div>
                  <div className="single-config">
                    <span className="config-label">Ref No: </span>
                    <TextArea
                      height={40}
                      width={"100%"}
                      autoResizeEnabled={true}
                      value={"969696"}
                      stylingMode="outlined"
                      disabled={true}
                    />
                    {/* <DropDownButton
                text={"Select Period"
                }
                width={"100%"}
                className="config-dropdown"
                height={40}
              /> */}
                  </div>
                </div>

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
