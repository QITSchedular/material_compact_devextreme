// import React from "react";
// import Toolbar, { Item } from "devextreme-react/toolbar";
// import Button from "devextreme-react/button";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
// import { Template } from "devextreme-react/core/template";

// export default function Header({ menuToggleEnabled, title, toggleMenu }) {
//   return (
//     <header className={"header-component"}>
//       <Toolbar className={"header-toolbar"}>
//         <Item
//           visible={menuToggleEnabled}
//           location={"before"}
//           widget={"dxButton"}
//           cssClass={"menu-button"}
//         >
//           <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
//         </Item>
//         <Item
//           location={"before"}
//           cssClass={"header-title"}
//           text={title}
//           visible={!!title}
//         />
//         <Item
//           location={"after"}
//           locateInMenu={"auto"}
//           menuItemTemplate={"userPanelTemplate"}
//         >
//           <Button
//             className={"user-button authorization"}
//             width={210}
//             height={"100%"}
//             stylingMode={"text"}
//           >
//             <UserPanel menuMode={"context"} />
//           </Button>
//         </Item>
//         <Template name={"userPanelTemplate"}>
//           <UserPanel menuMode={"list"} />
//         </Template>
//       </Toolbar>
//     </header>
//   );
// }
import React, { useState } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Menu from "devextreme-react/menu";
import TextBox from "devextreme-react/text-box";
import { Button, Template } from "devextreme-react";
// import "./Navbar.scss"; // You can define your own CSS styles in this file

const Navbar = () => {
  const [searchText, setSearchText] = useState("");


  return (
    <header className="navbar">
      <Toolbar>
       
        <Item location="center">
          <TextBox
            value={searchText}
            onValueChanged={(e) => setSearchText(e.value)}
            placeholder="Search..."
            showClearButton={true}
            stylingMode="outlined"
            width={210}
          />
        </Item>
        {/* <Item location="after">
          <Menu
            items={menuItems}
            displayExpr="text"
            onItemClick={(e) => {
              // Handle navigation to the clicked menu item's URL
              window.location.href = e.itemData.url;
            }}
          />
        </Item> */}
        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
        >
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
};

export default Navbar;
