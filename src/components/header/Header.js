import React from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import { Search, bell, home, setting } from "../../assets/icon";
import { TextBox, Button as NormalButton } from "devextreme-react";
import { Link, useLocation } from "react-router-dom";
import { SearchPanel } from "devextreme-react/data-grid";

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
  const location = useLocation();
  let path = location.pathname.split('/');

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
            {

              path.map((value, key) => (
                (value !== "")
                  ?
                  <>
                    <Link to={value}
                      className={location.pathname.startsWith(path[0]) ? "breadcrumb-item active" : "breadcrumb-item"}
                    >
                      {value}
                    </Link>
                  </>
                  :
                  <>
                    <Link to={"/home"}>
                      Home
                    </Link>
                    {/* <Button icon={home} /> */}
                  </>
              ))
            }
          </nav>
        </Item>

        <Item
          locateInMenu={"auto"}
          cssClass={'dx-toolbar-items-container'}
        >
          <div class="search-container">
            <TextBox
              className="search-input"
              stylingMode="outlined"
              placeholder="Search the menu"
              width={389}
              showClearButton={true}
            />
            <Button icon={Search} className="search-icon" />
          </div>
          {/* <div className="search-section">
            <SearchPanel visible={true} highlightCaseSensitive={true} />
             <TextBox
              className="dx-field-value"
              stylingMode="outlined"
              placeholder="Search by purchase order"
              width={250}
              showClearButton={true}
            >
              <NormalButton
                width={33}
                height={33}
                icon={Search}
              />
            </TextBox>
          </div> */}
        </Item>

        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
          cssClass={'nav-icons'}
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