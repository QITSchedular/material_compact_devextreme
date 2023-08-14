import React from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import { bell, home, setting } from "../../assets/icon";
import { TextBox, Button as NormalButton } from "devextreme-react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
  const location = useLocation();

  return (
    <header className={"header-component"}>
      <Toolbar className={"header-toolbar"}>
        <Item
          visible={menuToggleEnabled}
          location={"before"}
          widget={"dxButton"}
          cssClass={"menu-button"}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item>

        <Item
          location={"before"}
          cssClass={"header-title"}
          text={title}
          // visible={!!title}
        >
          <nav className="breadcrumb">
            <Button icon={home} />
            <Link
              to="/masters"
              className={
                location.pathname === "/masters"
                  ? "breadcrumb-item active"
                  : "breadcrumb-item"
              }
            >
              Master
            </Link>
            <Link
              to="/masters/items"
              className={
                location.pathname.startsWith("/masters")
                  ? "breadcrumb-item active"
                  : "breadcrumb-item"
              }
            >
              Items
            </Link>
          </nav>
        </Item>

        <Item locateInMenu={"auto"} cssClass={"dx-toolbar-items-container"}>
          <div className="search-section">
            <TextBox
              className="dx-field-value"
              stylingMode="outlined"
              placeholder="Search by purchase order"
              width={250}
              showClearButton={true}
            >
              {/* <NormalButton
                                width={33}
                                height={33}
                                type="normal"
                                stylingMode="outlined"
                                icon="search"
                            /> */}
            </TextBox>
          </div>
        </Item>

        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
          cssClass={"nav-icons"}
        >
          <Button icon={bell} />
          <Button icon={setting} />

          <Button
            className={"user-button authorization"}
            width={210}
            height={"100%"}
            stylingMode={"text"}
          >
            <UserPanel menuMode={"context"} />
          </Button>
        </Item>

        <Template name={"userPanelTemplate"}>
          <UserPanel menuMode={"list"} />
        </Template>
      </Toolbar>
    </header>
  );
}
