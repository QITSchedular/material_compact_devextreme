// import React from "react";
// import Button from "devextreme-react/button";
// const MastersHeaderContent = ({ title, subtitle, handleAddClick }) => {
//   return (
//     <div className="content-blocks">
//       <div className="content-block-wrapper">
//         <div className="content-block-1">
//           <div className="content-text">
//             <div className="content-text-header">{title}</div>
//             <div className="content-text-info">{subtitle}</div>
//           </div>
//           <div className="button-groups">
//             {/* <Button text="Export Data" icon="chevrondown" height={32} /> */}
//             <Button text="Template" icon="chevrondown" height={32} />
//             <Button
//               text="New Item"
//               type="default"
//               icon="add"
//               height={32}
//               className="item-btn"
//               onClick={handleAddClick}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MastersHeaderContent;

import React, { useContext, useEffect, useState } from "react";
import Button from "devextreme-react/button";
import MasterGrid from "../master-grid/MasterGrid";
import { AppContext } from "../../contexts/dataContext";
import Template_PopUp from "../masters/Template_PopUp";

const MastersHeaderContent = ({ title, subtitle, handleAddClick, columns, masterType, keyExpr, handleFileUploaded, handlesaveImportedFileData, data, key, heading }) => {
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
    <div className="content-blocks">
      <div className="content-block-wrapper">
        <div className="content-block-1">
          <div className="content-text">
            <div className="content-text-header">{title}</div>
            <div className="content-text-info">{subtitle}</div>
          </div>
          <div className="button-groups">
            {/* <Button text="Export Data" icon="chevrondown" height={32} /> */}
            <Button text="Template" icon="chevrondown" height={32} onClick={showTemplatePopup} />
            <Button
              text="New Item"
              type="default"
              icon="add"
              height={32}
              className="item-btn"
              onClick={handleAddClick}
            />
          </div>
        </div>
      </div>
      <MasterGrid columns={columns} masterType={masterType} keyExpr={keyExpr} />
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
    </div>
  );
};

export default MastersHeaderContent;