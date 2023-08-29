import React, { useState } from "react";
import { Button, TextBox } from "devextreme-react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { GRPOScanner } from "../../../assets/icon";
import SelectedItemsListings from "./selected-items-listings";

import "./receive-material.styles.scss";
import { SwalDisplayer } from "../../../utils/showToastsNotifications";
import { useNavigate } from "react-router-dom";

const ReceiveMaterialScanItems = () => {
  const [showListDataGrid, setShowListDataGrid] = useState(false);
  const searchItemsClickHandler = async () => {
    console.log("searchItemsClickHandler");
    await setShowListDataGrid(true);
  };

  const handleIssue = () => {
    SwalDisplayer("success", "Operation Successful");
  };
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner receive-material-scanItems-container ">
      <div className="header-section">
        <PopupHeaderText text={"Receive Material"} />
        <PopupSubText text={"Type or scan the item code to make an entry"} />
      </div>

      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Scan/Type the item QR code"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          // onValueChanged={inputQrValueChangedCallback}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={searchItemsClickHandler}
          // disabled={isSearchButtonDisabled}
          // value={inputQrValue}
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
      {showListDataGrid && (
        <>
          <div className="scanned-items-grid-section">
            <SelectedItemsListings />
          </div>
          <div
            className="action-button"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              bottom: "0px !important",
            }}
          >
            <Button
              type="default"
              text="Issue"
              width={124}
              height={35}
              className="default-button"
              onClick={handleIssue}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiveMaterialScanItems;
