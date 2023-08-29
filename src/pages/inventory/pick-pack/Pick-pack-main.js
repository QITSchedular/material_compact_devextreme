import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import PopupInputs from "../inventory-transfer/inner-components/popup-opener-inputs-sections";
import HeaderSection from "./inner-components/header-section";

// import "./inventory-transfer.styles.scss";

const PickPackMain = () => {
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner inventory-transfer-main-container ">
      <div className="header-section">
        <PopupHeaderText text={"Pick & Packer"} />
        <PopupSubText text={"Search the sales order to pick the items "} />
      </div>

      <div className="main-content-section">
        <div className="main-content-top">
          <div className="left-section">
            <div className="warehouse-chooser-section">
              <PopupInputs
                placeholder={"Type the sales order"}
                // chooser={toWarehouseChooser}
                // showHelpPopup={showToWarehousePopup}
                // setShowHelpPopup={setShowToWarehousePopup}
                // gridDataSourceList={toWarehouseList}
                // selectedValue={selectedToWarehouse}
                // setSelectedValue={setSelectedToWarehouse}
              />
            </div>

            <div className="items-scanner-section">
              <HeaderSection
              // productionNumberInputHandler={productionNumberInputHandler}
              // productionNumberInput={productionNumberInput}
              // productionNumberInputSearchHandler={
              //   productionNumberInputSearchHandler
              // }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickPackMain;
