import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { Button, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import Tabs, { Item } from "devextreme-react/tabs";

import ApprovedTabContent from "./tabs-content/ApprovedTabContent";
import PendingTabContent from "./tabs-content/PendingTabContent";
import RejectedTabContent from "./tabs-content/RejectedTabContent";

import "./issue-material.styles.scss";
import QtcSearchColumn from "../../../components/qtcCommonComponent/qtcSearchColumn";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { getPoLists } from "../../../utils/gate-in-purchase";

const IssueMaterialMain = () => {
  const [grpoList, setGrpoList] = useState(new Set()); 
  const [activeTab, setActiveTab] = useState("Pending"); // Set default active tab
  const [selectedPo, setSelectedPo] = useState("");

  const tabsItemClickHandler = (e) => {
    const selectedTab = e.itemData.text;
    setActiveTab(selectedTab);
  };
  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Approved":
        return <ApprovedTabContent />;
      case "Pending":
        return <PendingTabContent selectedPo={grpoList}/>;
      case "Rejected":
        return <RejectedTabContent />;
      default:
        return null;
    }
  };
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      // showPopupHandler();
      alert();
    },
  };
  const dataGridDataHandler = async (qrCode) => {
    // setLoading(true);
    // alert(qrCode);
    try {
      const poListData = await getPoLists();
      if (poListData.length > 0) {
        const qrCodeIds = poListData.map((item) => item.qrCodeID);
        const doPoExists = qrCodeIds.includes(qrCode[0].qrCodeID);
        // setLoading(false);
        return doPoExists;
      } else {
        alert("else");
        // setError("No data found");
        // setLoading(false);
        // toastDisplayer("error", "No matching P.O found, try again");
        return false;
      }
    } catch (error) {
      // setError("Error fetching data");
      // setLoading(false);
      return false;
    }
  };
  const handlePoVerification = async (param) => {
    console.log("param : ",param)
    // return setSelectedPo(param);
    if (param) {
      setSelectedPo(param);
      console.log("selectedPo : ",param );
      const doPoExists = await dataGridDataHandler(param);
      if (doPoExists && grpoList.has(param[0].qrCodeID)) {
        // Show an alert or a message to inform the user about the duplicate value
        
        alert("QR Code already exists in the list!");
        // return toastDisplayer("error", "QR Code already exists in the list!");
      } else if (doPoExists && !grpoList.has(param[0].qrCodeID)) {
        // Add the selectedPo to the grpoList using the Set's add method
        // return setGrpoList((prevGrpoList) =>
        //   new Set(prevGrpoList).add(param)
        // );
        console.log("grpoList : ",grpoList);
        return setGrpoList((prevGrpoList) =>
          new Set(prevGrpoList).add(param[0].qrCodeID)
        );
      } else if (!doPoExists) {
        return alert("Invalid Grpo, please select a valid Grpo")
        // return toastDisplayer(
        //   "error",
        //   "Invalid Grpo, please select a valid Grpo"
        // );
      }
    } else {
      return alert("Please type/scan P.O");
      // return toastDisplayer("error", "Please type/scan P.O");
    }
  };
  // const getparamFunc = (param)=>{
  //   console.log("param : ",param)
  //   return setSelectedPo(param);
  // }
  const keyArray1 = [
  { feildType: "textBox", handlefunc: "handleTextValueChange",placeholder : "Search by purchase order" ,selectedRowsData : "selectedRowsData"},
  { feildType: "button", handlefunc: handlePoVerification ,btnIcon : "search"},
  // { feildType: "button", handlefunc: "handlePoVerification" ,btnIcon : GRPOScanner},
];
  return (
    <div className="content-block dx-card responsive-paddings issue-material-container">
      <div className="header-section">
        <PopupHeaderText text={"Issue Material"} />
        <PopupSubText text={"Search the production number to verify"} />
      </div>

      {/* <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Type the production number"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={() => {}}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={() => console.log("Text")}
        />
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={() => console.log("first")}
        />
      </div> */}
      <QtcSearchColumn optionFunc={helpOptions} keyArray={keyArray1} PopUpContent={getPoLists()} getparamFunc={handlePoVerification}/>

      <div className="issue-material-main-section">
        <Tabs
          width={300}
          selectedIndex={0}
          id="selectTab"
          onItemClick={tabsItemClickHandler}
        >
          <Item text="Pending"></Item>
          <Item text="Approved"></Item>
          <Item text="Rejected"></Item>
        </Tabs>
          {/* {grpoList.size > 0 && (
          <div className="po-list-section">
            {[...grpoList].map((qrCode, index) => (
              <div key={index} className="single-po">
                <div className="single-po-delete">
                  <Button icon="trash"></Button>
                </div>
                <div className="single-po-name">
                  <span className="po-name">{qrCode}</span>
                  <Button
                    icon="custom-chevron-down-icon"
                    // onClick={handleShowPoDropDetails}
                  ></Button>
                </div>
                <div className="single-po-proceed">
                  <Button
                    text="Proceed"
                    // onClick={() => handleProceed(qrCode)}
                  ></Button>
                </div>
              </div>
            ))}
          </div>
        )} */}
      </div>

      <div className="issue-material-tabs-content">{renderTabContent()}</div>
    </div>
  );
};

export default IssueMaterialMain;
