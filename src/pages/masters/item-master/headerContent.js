import React, { useContext, useState } from "react";
import Button from "devextreme-react/button";
import "./headerContent.scss";
import { AppContext } from "../../../contexts/dataContext";
import ItemMasterForm from "../../../components/masters/item-master";
import Template_PopUp from "../../../components/masters/Template_PopUp";

const HeaderContent = ({ handleFileUploaded, handlesaveImportedFileData, data, key, heading }) => {
  const { isPopupVisible, openPopup, closePopUp } = useContext(AppContext);
  const [showItemMasterBox, setShowItemMasterBox] = useState(false);
  const [TemplatePopupBox, setTemplatePopupBox] = useState(false);
  const showItemMasterPopup = () => {
    setShowItemMasterBox(true);
    openPopup();
  };

  const showTemplatePopup = () => {
    setTemplatePopupBox(true);
  };
  const handleClosePopUp = () => {
    setTemplatePopupBox(false);
  };

  return (
    <>
      <div className="content-block-wrapper">
        <div className="content-block-1">
          <div className="content-text">
            <div className="content-text-header">Items Master</div>
            <div className="content-text-info">
              You are viewing the total number of items
            </div>
          </div>
          <div className="button-groups">
            {/* <Button text="Export Data" icon="chevrondown" height={32} /> */}
            <Button
              text="Template"
              icon="chevrondown"
              height={32}
              onClick={showTemplatePopup}
            />
            <Button
              text="New Item"
              type="default"
              icon="add"
              height={32}
              className="item-btn"
              onClick={showItemMasterPopup}
            />
          </div>
        </div>
      </div>
      {showItemMasterBox && <ItemMasterForm />}
      {TemplatePopupBox && (
        <Template_PopUp
          isPopupVisible={TemplatePopupBox}
          handleClosePopUp={handleClosePopUp}
          filefunction={handleFileUploaded}
          handlesaveImportedFileData={handlesaveImportedFileData}
          dataSource={data}
          keyExpr={key}
          heading={heading}
        />
      )}
    </>
  );
};

export default HeaderContent;