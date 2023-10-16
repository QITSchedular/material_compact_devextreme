import React, { useEffect, useRef, useState } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import { TextBox } from "devextreme-react";
import { Link, useLocation } from "react-router-dom";

import SettingDropdown from "../setting-dropdown/SettingDropdown";
import NotificationDropdown from "../notification-dropdown/NotificationDropdown";
import { UseHeaderContext } from "../../contexts/headerContext";
// import { SearchPanel } from "devextreme-react/data-grid";
// import SettingsDrawerMain from "../settings-drawer/SettingsDrawer.main";
import { navigation } from '../../app-navigation';

export default function Header({ menuToggleEnabled, toggleMenu }) {
    const location = useLocation();
    const path = location.pathname.split('/');
    const { isSettingDropdownOpen, toggleSettingDropdown, isNotifyDropdownOpen, toggleNotifyDropdown } = UseHeaderContext();

    const [searchState, setsearchState] = useState(false);

    function flattenNavigation(navigation) {
        const flattened = [];

        function flattenRecursive(items) {
            for (const item of items) {
                flattened.push({
                    path: item.path,
                    icon: item.icon,
                    text: item.text,
                });

                if (item.items) {
                    flattenRecursive(item.items);
                }
            }
        }

        flattenRecursive(navigation);
        return flattened;
    }

    const flattenedNavigation = flattenNavigation(navigation);

    const [filteredItems, setfilteredItems] = useState(flattenedNavigation);
    const [textBoxValue, settextBoxValue] = useState(null);
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchState) {
                if (searchRef.current && !searchRef.current.contains(event.target)) {

                    const isItemClicked = event.target.classList.contains("dx-texteditor-input") ||
                        event.target.classList.contains("search-input") ||
                        event.target.classList.contains("search-icon") ||
                        event.target.classList.contains("dx-textbox");

                    if (!isItemClicked) {
                        setsearchState(false);
                    }
                }
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [searchState]);

    const handleSearch = (event) => {
        if (event.value && event.value.trim() !== null) {

            const result = flattenedNavigation.filter((item) =>
                item.text.toLowerCase().includes(event.value.toLowerCase())
            );
            setfilteredItems(result);
        }
        else {
            setfilteredItems(flattenedNavigation);
        }
    };


    const SearchResultBox = () => (
        <div className="dropdown-background">
            <div className="search-result-box" ref={searchRef}>
                <ul>
                    {filteredItems && filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <Link to={item.path} onClick={() => settextBoxValue(null)} key={index}>
                                <li>
                                    <div className="heading">
                                        <span className="material-symbols-outlined list-icon">{item.icon}</span>
                                        <div className="divider"></div>
                                        <span className="heading-text">
                                            {item.text}
                                            <span className="path">
                                                {item.path.split('/').slice(1).join(' > ').split('/').map((pathPart, index, array) => (
                                                    <div key={index}>
                                                        {pathPart}
                                                        {index < array.length - 1 && ' > '}
                                                    </div>
                                                ))}
                                            </span>
                                        </span>
                                    </div>
                                </li>
                            </Link>
                        ))
                    ) : (
                        <div className="no-data-found">No Data Found</div>
                    )}
                </ul>
            </div>
        </div>
    );


    function findMatchingText(path, navigation) {
        function search(items, path) {
            for (const item of items) {
                if (item.path.split('/').slice(-1)[0] === path) {
                    return item;
                } else if (item.items) {
                    const subItemText = search(item.items, path);
                    if (subItemText) {
                        return subItemText;
                    }
                }
            }
            return null;
        }

        return search(navigation, path);
    }

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

                    <Item location={"before"} cssClass={"header-title"}>
                        <nav className="breadcrumb">

                            {/* {path.map((pathSegment, key) => {
                                console.log("pathSegment", pathSegment);
                                if (pathSegment && pathSegment != null || pathSegment != '') {
                                    const text = findMatchingText(pathSegment, navigation);
                                    return (
                                        <Link key={key} to={text.path}>
                                            <div key={key} className="breadcrumb-item active">
                                                {pathSegment}
                                            </div>
                                        );
                                    }
                                    else {

                                        const text = findMatchingText(pathSegment, navigation);
                                        return (
                                            <Link key={key} to={text.path}>
                                                <div key={key} className="breadcrumb-item active">
                                                    {text.text}
                                                </div>
                                            </Link>
                                        );
                                    }
                                }
                                else {
                                    return (
                                        <Link key={key} to="/home">
                                            <div className="breadcrumb-item breadcrumb-home">K</div>
                                        </Link>
                                    );
                                }
                            })} */}
                        </nav>
                    </Item>

                    {/* <Item
                        location={"center"}
                        locateInMenu={"auto"}
                        menuItemTemplate={"userPanelTemplate"}
                        cssClass={"nav-icons"}
                    >


                    </Item> */}

                    <Item
                        location={"after"}
                        locateInMenu={"auto"}
                        menuItemTemplate={"userPanelTemplate"}
                        cssClass={"nav-icons"}
                    >
                        <div
                            className="search-container"
                            onFocusOut={() => setsearchState(false)}
                            ref={searchBoxRef}
                            style={{ "zIndex": searchState ? "200" : "0" }}
                        >
                            <TextBox
                                className="search-input"
                                stylingMode="outlined"
                                placeholder="Search the menu"
                                showClearButton={true}
                                valueChangeEvent="keyup"
                                onValueChanged={handleSearch}
                                onFocusIn={() => {
                                    setfilteredItems(flattenedNavigation);
                                    setsearchState(true);
                                }}
                                value={textBoxValue}
                            />
                            <span className="material-symbols-outlined search-icon" onClick={() => setsearchState(true)}>
                                search
                            </span>
                        </div>

                        <div className="notification">
                            <span className="material-symbols-outlined bell-icon" onClick={toggleNotifyDropdown}>
                                notifications
                            </span>
                            <span className="notify-badge">
                                {Math.floor(Math.random() * 10)}
                            </span>
                        </div>

                        <span className="material-symbols-outlined setting-icon" onClick={toggleSettingDropdown}>
                            settings
                        </span>

                        <Button
                            className={"user-button authorization"}
                            // width={210}
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
            {searchState && <SearchResultBox />}
            {
                isSettingDropdownOpen &&
                <SettingDropdown />
            }
            {
                isNotifyDropdownOpen &&
                <NotificationDropdown />
            }
        </>
    );
}