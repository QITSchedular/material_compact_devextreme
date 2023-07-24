import React, { useContext, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import PopupForm from "../../../components/popup-form/PopupForm";
import { AppContext } from "../../../contexts/dataContext";

export default function ItemGroupMaster() {
  const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
  const { openCommonPopup, closeCommonPopup } = useContext(AppContext);

  const showItemGroupMaster = () => {
    setShowItemGroupMasterBox(true);
    openCommonPopup();
  };
  const dataArray = [
    { feildType: "dxTextBox", label: 'Item Group Name', isValidate: true },
    { feildType: "dxSelectBox", label: 'QR Managed By', isValidate: false },
    { feildType: "dxCheckBox", label: 'Locked', isValidate: false },
  ];
  return (
    <React.Fragment>
      <div className="content-block dx-card responsive-paddings">
        <div className="content-blocks">
          <MastersHeaderContent
            title={"Items Group Master"}
            subtitle={"You are viewing the total number of item groups"}
            handleAddClick={showItemGroupMaster}
          />
        </div>
      </div>
      {showItemGroupMasterBox && <PopupForm
        title={"Item Group Master"}
        field={dataArray}
      />
      }
    </React.Fragment>
  );
}
