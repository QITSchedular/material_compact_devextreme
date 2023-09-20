import React, { useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { Button, Popup, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import Tabs, { Item } from "devextreme-react/tabs";

import IssuedTabContent from "./tabs-content/ApprovedTabContent";
import PendingTabContent from "./tabs-content/PendingTabContent";

import "./verify-material.styles.scss";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import HelperPopUp from "./helperPopUp";
import { toastDisplayer } from "../../../api/qrgenerators";
import VerifyMaterialOrderList from "./varifyMaterial-OrderList";

const VerifyMaterialMain = () => {
  const [activeTab, setActiveTab] = useState("Pending"); // Set default active tab
  const [showTransporterHelp, setShowTransporterHelp] = useState(false); //show helper popUp
  const [selectedRowKeysOnChange, setSelectedRowKeysOnChange] = useState([]); // State to store the selected row data
  const [selectedRowData, setSelectedRowData] = useState(""); // State to store the selected row data (current)
  const [selectedRowsData, setSelectedRowsData] = useState([]); // State to store the selected row data (prev + current)
  const [txtValueOfTypeVerifyMaterial, settxtValueOfTypeVerifyMaterial] =
    useState(""); // State to store the selection indicator
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [VerifyMaterialList, setVerifyMaterialList] = useState(new Set()); // State to store the selected row data
  const dataGridRef = useRef();

  const tabsItemClickHandler = (e) => {
    const selectedTab = e.itemData.text;
    setActiveTab(selectedTab);
  };

  /* ---------------- Save purchase order handler ----------------------*/
  const handleSave = async (params) => {
    handleSaveSelectedPo();
  };

  const handleSaveSelectedPo = () => {
    setSelectedRowKeys(selectedRowKeysOnChange);
    if (selectedRowsData.length > 0) {
      return setShowTransporterHelp(false);
    } else {
      return toastDisplayer(
        "error",
        "Please select a Purchase order to save and proceed"
      );
    }
  };



  /* ---------------- Data Grid issue handler ----------------------*/
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };

  const showPopupHandler = () => {
    return setShowTransporterHelp(true);
  };

  const handleCancel = async () => {
    return setShowTransporterHelp(false);
  };

  /* ---------------- Data Grid change value handler ----------------------*/

  const handleDataGridRowSelection = async ({ selectedRowKeys }) => {
    setSelectedRowKeysOnChange(selectedRowKeys);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetter(value);
    }
  };

  const selectedRowSetter = async (params) => {
    // setSelectedRowData(params);
    if (params.length > 0) {
      return setSelectedRowsData(params);
    }
  };

  /* ---------------- Search handler ----------------------*/
  const SearchHandler = async () => {
    if (txtValueOfTypeVerifyMaterial) {
      var doProuctExist;

      if (txtValueOfTypeVerifyMaterial.length > 0) {
        doProuctExist = false;
        VerifyMaterialList.forEach((value) => {
          doProuctExist = true;
          return;
        });
      } else {
        doProuctExist = false;
      }
      if (doProuctExist == false) {
        setVerifyMaterialList((prevIQCList) => {
          const updatedSet = new Set(prevIQCList); // Create a new Set based on the previous Set
          updatedSet.add(selectedRowsData[0]); // Add each object 
          return updatedSet; // Return the updated Set
        });
      } else {
        return toastDisplayer("error", "Product alredy exist..!!");
      }
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };

  /* ---------------- Search values change handler ----------------------*/
  const handleTextValueChange = (e) => {
    return settxtValueOfTypeVerifyMaterial(e.value);
  };

  /* ---------------- Remove item from list ----------------------*/
  const deleteItem = (id) => {
    console.log(id);
    // setVerifyMaterialList((prevData) => {
    //   console.log(prevData)
    //   const newData = [...prevData].filter((item) => item.docEntry !== id);
    //   return new Set(newData);
    // });
  }

  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Pending":
        return <PendingTabContent VerifyMaterialList={VerifyMaterialList} deleteItem={deleteItem} />;
      case "Issued":
        return <IssuedTabContent />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="content-block dx-card responsive-paddings verify-material-container">
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
            value={
              selectedRowsData.length > 0 ? selectedRowsData[0].itemCode : ""
            }
            onValueChanged={handleTextValueChange}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>
          <Button
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={SearchHandler}
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

        <div className="verify-material-main-section issue-materials-tabs">
          <Tabs
            width={300}
            selectedIndex={0}
            id="selectTab"
            onItemClick={tabsItemClickHandler}
          >
            <Item text="Pending"></Item>
            <Item text="Issued"></Item>
          </Tabs>
        </div>

        <div className="verify-material-tabs-content">{renderTabContent()}</div>
      </div>
      {showTransporterHelp && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={true}
          // hideOnOutsideClick={outsideClickHandler}
          className="purchaseOrderList"
          contentRender={() => (
            <HelperPopUp
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleDataGridRowSelection={handleDataGridRowSelection}
              dataGridRef={dataGridRef}
              selectedRowKeys={selectedRowKeys}
            />
          )}
        ></Popup>
      )}
    </>
  );
};

export default VerifyMaterialMain;
