import React, { useState, useMemo, useCallback } from "react";
import { Drawer } from "devextreme-react/drawer";
import { Toolbar, Item } from "devextreme-react/toolbar";
import List from "devextreme-react/list.js";
import { navigation } from "./data.js";
// import NavigationList from "./NavigationList";

class NavigationList extends React.PureComponent {
  render() {
    return (
      <div className="list" style={{ width: "500px" }}>
        <List
          dataSource={navigation}
          hoverStateEnabled={false}
          activeStateEnabled={false}
          focusStateEnabled={false}
          className="panel-list dx-theme-accent-as-background-color"
        />
      </div>
    );
  }
}
const SettingsDrawerMain = () => {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState("right");

  const onOutsideClick = () => {
    alert("Oaky you clicked outside");
    setOpened(!opened);
  };

  const buttonOptions = useMemo(() => {
    return {
      icon: "menu",
      onClick: () => {
        setOpened(!opened);
      },
    };
  }, [opened]);
  return (
    <div>
      <Toolbar id="toolbar">
        <Item widget="dxButton" options={buttonOptions} location="after" />
      </Toolbar>
      {/* <div style={{ float: "right", marginTop: "30px" }}> */}
      <div>
        <Drawer
          opened={opened}
          closeOnOutsideClick={onOutsideClick}
          openedStateMode={"overlap"}
          position={"top"}
          component={NavigationList}
          height={"100vh"}
          width={200}
        ></Drawer>
      </div>
    </div>
  );
};

export default SettingsDrawerMain;
