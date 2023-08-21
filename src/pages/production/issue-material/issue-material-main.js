import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import { Button, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import Tabs, { Item } from "devextreme-react/tabs";
import { toastDisplayer } from "../../../api/qrgenerators";
import ApprovedTabContent from "./tabs-content/ApprovedTabContent";
import PendingTabContent from "./tabs-content/PendingTabContent";
import RejectedTabContent from "./tabs-content/RejectedTabContent";

import "./issue-material.styles.scss";
import QtcSearchColumn from "../../../components/qtcCommonComponent/qtcSearchColumn";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { getPoLists, searchPoListsIQC } from "../../../utils/gate-in-purchase";

const IssueMaterialMain = () => {
  const [grpoList, setGrpoList] = useState(new Set());
  const [activeTab, setActiveTab] = useState("Pending"); // Set default active tab
  const [selectedPo, setSelectedPo] = useState("");
  const [loading, setLoading] = useState(false);
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


  const handlePoVerification = async (param) => {
    console.log("param : ",param);
    if (param.length>0 && param) {
      setSelectedPo(param);
      console.log("selectedPo : ",param );
      const doPoExists = await searchPoListsIQC(param[0].qrCodeID);
      console.log(doPoExists);
      var doProuctExist;
      if (grpoList.size > 0) {
        doProuctExist = false;
        grpoList.forEach((value) => {

          if (value.headerQRCodeID == param[0].qrCodeID) {
            doProuctExist = true;
            return;
          }
        });
      } else {
        doProuctExist = false;
      }
      if (doProuctExist && doPoExists) {
        // Show an alert or a message to inform the user about the duplicate value

        return toastDisplayer("error", "QR Code already exists in the list!");
      } else if (doPoExists && !doProuctExist) {
        // Add the selectedPo to the grpoList using the Set's add method

        // console.log("grpoList : ",grpoList);
         setGrpoList((prevGrpoList) =>{
          const updatedSet = new Set(prevGrpoList); // Create a new Set based on the previous Set

          doPoExists.forEach((response) => {
            updatedSet.add(response); // Add each object from prodResponse to the updatedSet
          });

          return updatedSet;
         }

        );
      } else if (doProuctExist === "No data found") {
        // console.log("the scanned item does not exist");
        return toastDisplayer(
          "error",
          "The scanned item does not belong to this P.O"
        );
      }
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };
  // const getparamFunc = (param)=>{
  //   console.log("param : ",param)
  //   return setSelectedPo(param);
  // }
  const keyArray1 = [
  { feildType: "textBox", handlefunc: "handleTextValueChange",placeholder : "Search by purchase order" ,selectedRowsData : "selectedRowsData" ,TextWithIcon:true},
  { feildType: "button", handlefunc: handlePoVerification ,btnIcon : "search"},
];
  return (
    <div className="content-block dx-card responsive-paddings issue-material-container">
      <div className="header-section">
        <PopupHeaderText text={"Issue Material"} />
        <PopupSubText text={"Search the production number to verify"} />
      </div>

      <QtcSearchColumn popupHeaderText="Purchase Order List" popupSubHeaderText="Search the purchase order" keyArray={keyArray1} PopUpContent={getPoLists()} getparamFunc={handlePoVerification}/>

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
