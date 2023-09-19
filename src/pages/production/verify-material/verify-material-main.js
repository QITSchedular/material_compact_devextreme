import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { Button, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import Tabs, { Item } from "devextreme-react/tabs";

import IssuedTabContent from "./tabs-content/ApprovedTabContent";
import PendingTabContent from "./tabs-content/PendingTabContent";

import "./verify-material.styles.scss";

const VerifyMaterialMain = () => {
  const [activeTab, setActiveTab] = useState("Pending"); // Set default active tab

  const tabsItemClickHandler = (e) => {
    const selectedTab = e.itemData.text;
    setActiveTab(selectedTab);
  };
  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Pending":
        return <PendingTabContent />;
      case "Issued":
        return <IssuedTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="content-block dx-card responsive-paddings verify-material-container">
      <div className="header-section">
        <PopupHeaderText text={"Verify Material"} />
        <PopupSubText text={"Search the production number to verify"} />
      </div>

      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Type the production number"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={() => { }}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={() => console.log("Text")}
        />
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={() => console.log("first")}
        />
      </div>

      <div className="verify-material-main-section verify-materials-tabs">
        <Tabs
          width={300}
          selectedIndex={0}
          id="selectTab"
          onItemClick={tabsItemClickHandler}
        >
          <Item text="Pending"></Item>
          <Item text="Issued"></Item>
        </Tabs>
      </div>

      <div className="verify-material-tabs-content">{renderTabContent()}</div>
    </div>
  );
};

export default VerifyMaterialMain;
