import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Button, LoadPanel, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
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

  const navigate = useNavigate();

  const helpOptions = {
    icon: HelpIcons,
    onClick: () => {
      showPopupHandler();
    },
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
      setIsSearchButtonDisabled(false);
      setInputQrValue(value);
      console.log(selectedPoToReceive);
    } else if (!value) {
      setInputQrValue("");
      setIsSearchButtonDisabled(false);
    }

  };

  const handleSearch = async () => {
    /* ----------- validator --------- */
    setLoading(true);
    if (!inputQrValue) {
      setLoading(false);
      return toastDisplayer("error", "Search value cannot be empty");
    }
    /* ----------- validator --------- */

    /* ----------- hit api --------- */
    const listData = await testGetDetailsByProductionNumber(inputQrValue);
    // console.log(listData);
    if (listData.hasError) {
      setInputQrValue("");
      setLoading(false);
      return toastDisplayer("error", listData.data);
    }
    // Check if the item already exists in the listingDataSource
    const existingIndex = listingDataSource.findIndex(
      (item) => item[0].batchSerialNo === listData.data[0].batchSerialNo
    );
    if (existingIndex === -1) {
      // Item doesn't exist, add it to the listingDataSource
      setLoading(false);
      setListingDataSource([...listingDataSource, listData.data]);
    } else {
      // Item already exists, show a message or handle as needed
      setLoading(false);
      return toastDisplayer("error", "Duplicate PO entry");
    }
    // setListingDataSource([...listingDataSource, listData.data]);
    // console.log("This is listing data", listData.data);
    //setInputQrValue(""); // Clear input after search
    /* ----------- hit api --------- */
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
    const apiRes = await saveProductionDraftReceipt(gridData, comments);
    if (apiRes.hasError) {
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Something went wrong, please try again later"
      );
    }
    return SwalDisplayer("success", apiRes.responseData.statusMsg);
  };
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner receive-material-container ">
      {loading && <LoadPanel visible={true} />}
      {/*----header Section ------*/}

      <div className="header-section">
        <PopupHeaderText text={"Draft Receipt-PRO"} />
        <PopupSubText text={"Choose a Production Order to proceed.."} />
      </div>

      {/*----Input Textbox search/ scan section ------*/}
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
        {/* <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={handleSearch}
          disabled={isSearchButtonDisabled}
          value={inputQrValue}
        /> */}
        {/* <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={() => console.log("You have cliced the scanner")}
        /> */}
      </div>

      {/*------- LISTING SECTION -----*/}
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
    </div>
  );
};

export default ReceiveMaterialMain;
