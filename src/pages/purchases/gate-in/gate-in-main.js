import React, { useState } from "react";
import Tabs, { Item } from "devextreme-react/tabs";
import "./gatein-main.styles.scss";
import notify from "devextreme/ui/notify";
import GateInComponent from "./gate-in";
import OldEntryComponent from "./old-entry";
const HeaderContent = () => {
  return (
    <div className="title-section">
      <div className="title-name">Gate IN - PO</div>
      <div className="title-description">
        Type or scan the purchase order to make an entry
      </div>
    </div>
  );
};
const TabsContent = ({ setSelectedTab }) => {
  const showMessage = (id) => {
    // notify(
    //   {
    //     message: `Tab ${id} has been clicked!`,
    //     width: 250,
    //   },
    //   "info",
    //   500
    // );
  };

  const onItemClick = (e) => {
    // showMessage(e.itemIndex + 1);
    setSelectedTab(e.itemIndex);
  };

  return (
    <Tabs
      width={300}
      selectedIndex={0}
      onItemClick={onItemClick}
      id="selectTab"
    >
      <Item text="New Entry"></Item>
      <Item text="Old Entry"></Item>
    </Tabs>
  );
};

const GateInMain = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div
      className="content-block dx-card responsive-paddings"
      id="gate-in-main-container"
    >
      <div className="navigation-header-gatein">
        <HeaderContent />
        <TabsContent setSelectedTab={setSelectedTab} />
      </div>
      <div className="tabs-selection-content">
        {selectedTab === 0 ? <GateInComponent /> : <OldEntryComponent />}
      </div>
    </div>
  );
};

export default GateInMain;
