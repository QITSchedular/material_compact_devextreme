import React, { useState, useMemo, useCallback } from "react";
import { Drawer } from "devextreme-react/drawer";
import List from "devextreme-react/list.js";
import { navigation } from "./data.js";
// import NavigationList from "./NavigationList";
import "./settings.drawer.styles.scss";

class NavigationList extends React.PureComponent {
  render() {
    return (
      <div className="list" style={{ width: "500px" }}>
        <List
          dataSource={navigation}
          hoverStateEnabled={false}
          activeStateEnabled={false}
          focusStateEnabled={false}
          className="the-panel-list"
        />
      </div>
    );
  }
}
const SettingsDrawerMain = ({ ok, setOk }) => {
  return (
    <Drawer
      opened={ok}
      closeOnOutsideClick={setOk}
      openedStateMode={"overlap"}
      position={"right"}
      component={NavigationList}
      height={"100vh"}
      width={200}
      id="mydrawer"
    ></Drawer>
  );
};

export default SettingsDrawerMain;
