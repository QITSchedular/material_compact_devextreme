import React from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import { Search, bell, home, setting } from "../../assets/icon";
import { TextBox } from "devextreme-react";
import { Link, useLocation } from "react-router-dom";

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

                            path.slice(0, 2).map((value, key) => (
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
                                            <Button icon={home} style={{ "margin": "0px" }} />
                                        </Link>
                                    </>
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
