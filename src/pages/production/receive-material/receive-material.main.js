import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import {
  LoadPanel,
  TextBox,
  Popup,
  Button,
  ScrollView,
} from "devextreme-react";
import { ToolbarItem } from "devextreme-react/popup";
import { toastDisplayer } from "../../../api/qrgenerators";
import { testGetDetailsByProductionNumber } from "../../../api/test-apis";
import RecievematerialListing from "./recieve-material.listing";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import DraftReceiptHelpPopup from "./draft-receipt-help-popup";
import {
  getDraftReceiptProList,
  saveProductionDraftReceipt,
} from "../../../api/production.draft.receipt.api";
import SelectedItemsListings from "./selected-items-listings";
import { SwalDisplayer } from "../../../utils/showToastsNotifications";
import "./receive-material.styles.scss";
import { binLocationController } from "../../../utils/grpo-saver";
import DraftBinChooserComponent from "./draft-bin-popup";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  Button as DataGridButton,
  Editing,
} from "devextreme-react/data-grid";
import { getActiveMasterData } from "../../../utils/items-master-data";

const ReceiveMaterialMain = () => {
  const [showDraftReceiptPoHelpPopup, setShowDraftReceiptPoHelpPopup] =
    useState(false);
  const [poHelpDataSource, setPoHelpDataSource] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [inputQrValue, setInputQrValue] = useState("");

  const [listingDataSource, setListingDataSource] = useState([]);
  const [selectedPoToReceive, setSelectedPoToReceive] = useState([]);
  const [searchTextInputValue, setSearchTextInputValue] = useState("");

  const [showReceiverDataGrid, setShowReceiverDataGrid] = useState(false);
  const [receiverDataGridDataSource, setReceiverDataGridDataSource] =
    useState("");
  const [loading, setLoading] = useState(false);

  const [QcWareHouseBinData, setQcWareHouseBinData] = useState("");

  const [binChooser, setBinChooser] = useState(false);
  const [showBinPopupHelp, setShowBinPopupHelp] = useState(false);
  const [chosenBinValue, setChosenBinValue] = useState(""); // State for the chosen bin value

  const [noqcBinData, setnoQcBinData] = useState(false);

  const navigate = useNavigate();

  const helpOptions = {
    icon: HelpIcons,
    onClick: () => {
      showPopupHandler();
    },
  };

  const BinhelpOptions = {
    icon: HelpIcons,
    onClick: () => {
      showBinPopupHandler();
    },
  };

  const showBinPopupHandler = async () => {
    await setShowBinPopupHelp(true);
  };

  const popupCloseHandler = async () => {
    return setShowBinPopupHelp(false);
  };

  const handleDraftBinSelection = (params) => {
    if (params.length > 0) {
      setnoQcBinData(params);
    }
  };

  const cancelButtonOptions = {
    width: 120,
    height: 40,
    text: "Cancel",
    type: "error",
    stylingMode: "contained",
    onClick: () => handleCancelNoSelection(),
  };

  const binsaveButtonOptions = {
    width: 120,
    height: 40,
    text: "OK",
    type: "default",
    stylingMode: "contained",
    onClick: () => handlebinSaveSelectedBin(),
  };

  // const handlebinSaveSelectedBin = () => {
  //   if (noqcBinData.length > 0) {
  //     return setShowBinPopupHelp(false);
  //   } else {
  //     return toastDisplayer("error", "Please select a Bin to save and proceed");
  //   }
  // };

  const handlebinSaveSelectedBin = () => {
    if (noqcBinData.length > 0) {
      setChosenBinValue(noqcBinData[0].binCode); // Update the chosen bin value
      return setShowBinPopupHelp(false);
    } else {
      return toastDisplayer("error", "Please select a Bin to save and proceed");
    }
  };

  const handleCancelNoSelection = () => {
    return setShowBinPopupHelp(false);
  };

  const showPopupHandler = async () => {
    setLoading(true);
    const apiRes = await getDraftReceiptProList();
    if (apiRes.hasError) {
      loading(false);
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Something went wrong, please try again later"
      );
    }
    await setPoHelpDataSource(apiRes.responseData);
    await setShowDraftReceiptPoHelpPopup(!showDraftReceiptPoHelpPopup);
    setLoading(false);
  };

  const inputQrValueChangedCallback = ({ value }) => {
    if (value) {
      checkAndGetBinActivationDetails(selectedPoToReceive);
      setIsSearchButtonDisabled(false);
      setInputQrValue(value);
    } else if (!value) {
      setInputQrValue("");
      setIsSearchButtonDisabled(false);
    }
  };

  // Get the bin details if bin is activated
  const checkAndGetBinActivationDetails = async (selectedPoToReceive) => {
    const isBinActivated = selectedPoToReceive[0].binActivat;
    if (isBinActivated === "Y") {
      const binsList = await getWarehousesListOfAllBins(
        selectedPoToReceive[0].warehouse
      );
      setQcWareHouseBinData(binsList.responseData);
      return setBinChooser(true);
    } else {
      return setBinChooser(false);
    }
  };

  const getWarehousesListOfAllBins = async (whsCode) => {
    const payload = {
      whsCode,
    };
    try {
      const response = await binLocationController(payload);
      if (response) {
        return response;
      } else {
        return toastDisplayer("error", "No Bins data!!!");
      }
    } catch (error) {
      return toastDisplayer("error", "warehouse not found!!!");
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    if (!inputQrValue) {
      setLoading(false);
      return toastDisplayer("error", "Search value cannot be empty");
    }

    const listData = await testGetDetailsByProductionNumber(inputQrValue);

    if (listData.hasError) {
      setInputQrValue("");
      setLoading(false);
      return toastDisplayer("error", listData.data);
    }
    const existingIndex = listingDataSource.findIndex(
      (item) => item[0].batchSerialNo === listData.data[0].batchSerialNo
    );
    if (existingIndex === -1) {
      setLoading(false);
      setListingDataSource([...listingDataSource, listData.data]);
    } else {
      setLoading(false);
      return toastDisplayer("error", "Duplicate PO entry");
    }
    setLoading(false);
  };

  const handleDeleteItem = (index) => {
    const updatedListingData = listingDataSource.filter((_, i) => i !== index);
    setListingDataSource(updatedListingData);
  };

  const handleProceed = (headerQrId) => {
    navigate(`/recieve-material/scanitems/${headerQrId}`); // Use navigate function
  };
  useEffect(() => {
    if (selectedPoToReceive.length > 0) {
      setReceiverDataGridDataSource(selectedPoToReceive);
      setShowReceiverDataGrid(true);
      setSearchTextInputValue(selectedPoToReceive[0].docNum);
    }
  }, [selectedPoToReceive]);

  const draftReceiptSaver = async (gridData, comments) => {
    const apiRes = await saveProductionDraftReceipt(
      gridData,
      selectedProWorkRowData,
      comments
    );
    console.log("saveProductionDraftReceipt:", gridData);
    if (apiRes.hasError) {
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Something went wrong, please try again later"
      );
    }
    setSelectedProWorkRowData([]);
    setSearchTextInputValue("");
    setOKButtonDisabled(true);
    setShowReceiverDataGrid(false);
    return SwalDisplayer("success", apiRes.responseData.statusMsg);
  };

  console.log("chosenBinValue:", chosenBinValue);

  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [departmentData, setdepartmentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call getMasterData with the desired masterType
        const response = await getActiveMasterData("Department");

        const updatedResponse = response.map((item) => ({
          ...item,
          hours: "",
          delay: "",
        }));

        console.log("Updated data:", updatedResponse);

        // Set the updated response with hours and delay keys
        setdepartmentData(updatedResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const showProWorkPopup = () => {
    setPopupVisibility(true);
  };

  const popUpOutsideClickHandler = () => {
    setPopupVisibility(false);
  };
  const dataGridRef = useRef();
  const [isOKButtonDisabled, setOKButtonDisabled] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedProWorkRowData, setSelectedProWorkRowData] = useState([]);

  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
  };

  const handleGridItemSelection = (data) => {
    const { selectedRowKeys, selectedRowsData } = data;
    console.log("This is somethings", selectedRowsData);
    setSelectedProWorkRowData(selectedRowsData);
    // if (selectedRowKeys.length > 1) {
    //   const value = dataGridRef.current.instance.selectRows(
    //     selectedRowKeys[selectedRowKeys.length - 1]
    //   );

    //   selectedRowSetter(value);
    // } else {
    const value = dataGridRef.current.instance.selectRows(selectedRowKeys);
    selectedRowSetter(value);
    // console.log(first)
    // }
    setOKButtonDisabled(selectedRowKeys.length === 0);
  };

  const handleSaveSelection = () => {
    return popUpOutsideClickHandler();
  };
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner receive-material-container ">
      {loading && <LoadPanel visible={true} />}

      <div className="header-section">
        <PopupHeaderText text={"Draft Receipt-PRO"} />
        <PopupSubText text={"Choose a Production Order to proceed.."} />
      </div>
      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Click the Icon to Choose..."
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={inputQrValueChangedCallback}
          value={searchTextInputValue ? `${searchTextInputValue}` : ""}
        >
          <TextBoxButton
            name="currency"
            location="after"
            options={helpOptions}
          />
        </TextBox>
        <Button
          text="Pro Work"
          icon="chevrondown"
          height={40}
          onClick={showProWorkPopup}
        />
        {binChooser && (
          <div className="search-section choose-bin">
            <TextBox
              className="dx-field-value"
              stylingMode="outlined"
              placeholder="Choose Bin"
              width={250}
              showClearButton={true}
              valueChangeEvent="keyup"
              onValueChanged={inputQrValueChangedCallback}
              value={chosenBinValue} // Set the selected bin value here
            >
              <TextBoxButton
                name="currency"
                location="after"
                options={BinhelpOptions}
              />
            </TextBox>
          </div>
        )}
        {showBinPopupHelp && (
          <Popup
            visible={true}
            showCloseButton={true}
            hideOnOutsideClick={popupCloseHandler}
            contentRender={() => (
              <DraftBinChooserComponent
                handleSaveSelectedWarehouse={handleDraftBinSelection}
                handleCloseButton={popupCloseHandler}
                QcWareHouseBinData={
                  QcWareHouseBinData.length > 0 ? QcWareHouseBinData : null
                }
              />
            )}
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
              options={binsaveButtonOptions}
              cssClass={"tootlbar-save-button"}
            />
          </Popup>
        )}
      </div>

      {listingDataSource.length > 0 ? (
        <RecievematerialListing
          listingDataSource={listingDataSource}
          onDeleteItem={handleDeleteItem}
          onProceed={handleProceed}
        />
      ) : (
        ""
      )}

      {showDraftReceiptPoHelpPopup && (
        <DraftReceiptHelpPopup
          poHelpDataSource={poHelpDataSource}
          setShowDraftReceiptPoHelpPopup={setShowDraftReceiptPoHelpPopup}
          setSelectedPoToReceive={setSelectedPoToReceive}
        />
      )}

      {showReceiverDataGrid && (
        <SelectedItemsListings
          receiverDataGridDataSource={receiverDataGridDataSource}
          draftReceiptSaver={draftReceiptSaver}
        />
      )}
      <Popup
        visible={isPopupVisible}
        hideOnOutsideClick={true}
        showTitle={false}
        height={"90vh"}
        width={"90vw"}
      >
        <ScrollView height={"100%"}>
          <div className="title-section responsive-paddings">
            <PopupHeaderText text={"PRO - Rework Reason"} />
            <PopupSubText text={"Please provide the valid Reason"} />
          </div>
          <div className="close-btn">
            <Button icon="close" onClick={popUpOutsideClickHandler} />
          </div>
          <div
            className="responsive-paddings production-content-datagrid-container"
            style={{ margin: "8px 24px", height: "100% !important" }}
          >
            <DataGrid
              height={window.innerHeight - 250}
              dataSource={departmentData}
              keyExpr={"deptId"}
              showBorders={true}
              columnAutoWidth={true}
              hoverStateEnabled={true}
              className="transporter-data-grid issuefrompro__prohelp--data-grid"
              onSelectionChanged={handleGridItemSelection}
              // selectedRowKeys={selectedRowKeys}
              ref={dataGridRef}
            >
              <Editing
                mode="row"
                allowDeleting={true}
                allowUpdating={true}
                useIcons={true}
              />
              <SearchPanel
                visible={true}
                width={190}
                highlightCaseSensitive={true}
                className={"search-panel"}
              />
              <Selection mode="multiple" allowSelectAll={false} />
              <Scrolling columnRenderingMode="virtual" />
              <Paging defaultPageSize={20} />
              <Column
                dataField={"deptName"}
                caption="Department"
                allowEditing={false}
              />
              <Column dataField={"hours"} caption="Rework Hours Consume" />
              <Column dataField={"days"} caption="Delay in Project" />

              <Column type="buttons" caption="Actions">
                <DataGridButton name="edit" icon={"edit"} />
                <DataGridButton name="delete" icon={"delete"} />
              </Column>
            </DataGrid>
          </div>
          <div
            className="btn-section responsive-paddings"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              text="Cancel"
              width={124}
              height={35}
              onClick={popUpOutsideClickHandler}
            />
            <Button
              text="OK"
              type="default"
              width={124}
              height={35}
              className="default-button"
              onClick={handleSaveSelection}
              // disabled={selectedRowKeys.length > 1 ? false : true}
              disabled={isOKButtonDisabled}
            />
          </div>
        </ScrollView>
      </Popup>
    </div>
  );
};

export default ReceiveMaterialMain;
