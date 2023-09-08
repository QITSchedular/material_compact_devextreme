import React, { useState } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import { Search, bell, setting } from "../../assets/icon";
import { TextBox } from "devextreme-react";
import { Link, useLocation } from "react-router-dom";

import SettingDropdown from "../setting-dropdown/SettingDropdown";
import NotificationDropdown from "../notification-dropdown/NotificationDropdown";
import { SearchPanel } from "devextreme-react/data-grid";
import SettingsDrawerMain from "../settings-drawer/SettingsDrawer.main";

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
    const location = useLocation();
    let path = location.pathname.split('/');

    const [isSettingDropdownOpen, setisSettingDropdownOpen] = useState(false);
    const [isNotifyDropdownOpen, setisNotifyDropdownOpen] = useState(false);


    const toggleSettingDropdown = () => {
        setisNotifyDropdownOpen(false);
        setisSettingDropdownOpen(!isSettingDropdownOpen);
    };

    const toggleNotifyDropdown = () => {
        setisSettingDropdownOpen(false);
        setisNotifyDropdownOpen(!isNotifyDropdownOpen);
    };

    return (
        <>
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
                    >
                        <nav className="breadcrumb">
                            {
                                path.slice(0, 3).map((value, key, array) => (
                                    (value !== "") ? (
                                        (key !== array.length - 1) ? (
                                            <>
                                                <Link to={value} className={"breadcrumb-item active"}>
                                                    {value}
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <div className={"breadcrumb-item active"}>
                                                    {value}
                                                </div>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Link to={"/home"}>
                                                <div className="breadcrumb-item breadcrumb-home">K</div>
                                            </Link>
                                        </>
                                    )
                                ))
                            }
                        </nav>
                    </Item>

                    <Item
                        location={"after"}
                        locateInMenu={"auto"}
                        menuItemTemplate={"userPanelTemplate"}
                        cssClass={"nav-icons"}
                    >
                        <div className="search-container">
                            <TextBox
                                className="search-input"
                                stylingMode="outlined"
                                placeholder="Search the menu"
                                // width={389}
                                showClearButton={true}
                            />
                            <Button icon={Search} className="search-icon" id="in-search-icon" />
                        </div>

                        <Button icon={bell} onClick={toggleNotifyDropdown} className="bell-icon" />

                        <Button icon={setting} onClick={toggleSettingDropdown} className="setting-icon" />
                        {/* <span className="material-icons">home</span>

                        <span class="material-icons-outlined">
                            settings
                        </span> */}
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
            </header >

            {isSettingDropdownOpen && <SettingDropdown />}
            {isNotifyDropdownOpen && <NotificationDropdown />}
        </>
    );
}
