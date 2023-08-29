import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Button, LoadPanel, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import IssueMaterialListing from "./issue-material-listings";
import { useNavigate } from "react-router-dom";
import { toastDisplayer } from "../../../api/qrgenerators";
import { testGetDetailsByProductionNumber } from "../../../api/test-apis";

const IssueMaterialMain = () => {
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [inputQrValue, setInputQrValue] = useState("");
  const [listingDataSource, setListingDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

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
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner issue-material-container ">
      {loading && <LoadPanel visible={true} />}
      {/*----header Section ------*/}

      <div className="header-section">
        <PopupHeaderText text={"Issue Material"} />
        <PopupSubText text={"Search the production number to proceed"} />
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
        ></TextBox>
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
        <IssueMaterialListing
          listingDataSource={listingDataSource}
          onDeleteItem={handleDeleteItem}
          onProceed={handleProceed}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default IssueMaterialMain;
