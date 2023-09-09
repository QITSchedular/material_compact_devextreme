import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Button, LoadPanel, Popup, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import { toastDisplayer } from "../../../api/qrgenerators";
import { testGetDetailsByProductionNumber } from "../../../api/test-apis";
import RecievematerialListing from "./recieve-material.listing";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import HelperPopUp from "./helperPopUp";

const ReceiveMaterialMain = () => {
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [inputQrValue, setInputQrValue] = useState("");
  const [listingDataSource, setListingDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTransporterHelp, setShowTransporterHelp] = useState(false);

  const navigate = useNavigate();

  const inputQrValueChangedCallback = ({ value }) => {
    if (value) {
      setIsSearchButtonDisabled(false);
      setInputQrValue(value);
      console.log(value);
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

  const showPopupHandler = () => {
    // console.log("it is true to show");
    return setShowTransporterHelp(true);
  };

  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };

  const handleCancel = async () => {
    return setShowTransporterHelp(false);
  };

  return (
    <>
    {showTransporterHelp && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={true}
          // hideOnOutsideClick={outsideClickHandler}
          className="purchaseOrderList"
          contentRender={() => (
            <HelperPopUp  handleCancel={handleCancel} />
          )}
        ></Popup>
      )}
    <div className="content-block dx-card responsive-paddings default-main-conatiner receive-material-container ">
      {loading && <LoadPanel visible={true} />}
      {/*----header Section ------*/}

      <div className="header-section">
        <PopupHeaderText text={"Receive Material"} />
        <PopupSubText text={"Create the qr code of receive "} />
      </div>

      {/*----Input Textbox search/ scan section ------*/}
      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Type the production number"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={inputQrValueChangedCallback}
        ><TextBoxButton
        name="currency"
        location="after"
        options={helpOptions}
      /></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={handleSearch}
          disabled={isSearchButtonDisabled}
          value={inputQrValue}
        />
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={() => console.log("You have cliced the scanner")}
        />
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
    </div>
    </>
  );
};

export default ReceiveMaterialMain;
