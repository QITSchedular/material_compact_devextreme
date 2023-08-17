import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { Button, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import Tabs, { Item } from "devextreme-react/tabs";

import ApprovedTabContent from "./tabs-content/ApprovedTabContent";
import PendingTabContent from "./tabs-content/PendingTabContent";
import RejectedTabContent from "./tabs-content/RejectedTabContent";

import "./issue-material.styles.scss";

const IssueMaterialMain = () => {
  const [activeTab, setActiveTab] = useState("Approved"); // Set default active tab

  const tabsItemClickHandler = (e) => {
    const selectedTab = e.itemData.text;
    setActiveTab(selectedTab);
  };
  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Approved":
        return <ApprovedTabContent />;
      case "Pending":
        return <PendingTabContent />;
      case "Rejected":
        return <RejectedTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="content-block dx-card responsive-paddings issue-material-container">
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
          onValueChanged={() => {}}
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

      <div className="issue-material-main-section">
        <Tabs
          width={300}
          selectedIndex={0}
          id="selectTab"
          onItemClick={tabsItemClickHandler}
        >
          <Item text="Pending"></Item>
          <Item text="Approved"></Item>
          <Item text="Rejected"></Item>
        </Tabs>
      </div>

      <div className="issue-material-tabs-content">{renderTabContent()}</div>
    </div>
  );
};

export default IssueMaterialMain;
