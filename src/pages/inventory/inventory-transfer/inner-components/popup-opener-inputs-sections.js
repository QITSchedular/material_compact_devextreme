import React, { useState } from "react";
import { TextBox } from "devextreme-react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../../../purchases/grpo/icons-exporter";
import PopupComponent from "./popup-component";

const PopupInputs = ({
  placeholder,
  chooser,
  showHelpPopup,
  setShowHelpPopup,
  gridDataSourceList,
  selectedValue,
  setSelectedValue,
}) => {
  const [textBoxValue, setTextBoxValue] = useState("");
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      chooser();
    },
  };
  const popUpOutsideClickHandler = () => {
    setShowHelpPopup(false);
  };
  const selectedValueDisplayHandler = async (selectedValue) => {
    const data = await selectedValue;
    if (data[0].whsCode) {
      return setTextBoxValue(data[0].whsName);
    }
    if (data[0].cardCode) {
      return setTextBoxValue(data[0].cardName);
    }
  };
  return (
    <>
      {showHelpPopup && (
        <PopupComponent
          popUpOutsideClickHandler={popUpOutsideClickHandler}
          placeholder={placeholder}
          gridDataSourceList={gridDataSourceList}
          onSelectAndClose={(selectedValue) => {
            setSelectedValue(selectedValue);
            selectedValueDisplayHandler(selectedValue);
            popUpOutsideClickHandler();
          }}
        />
      )}
      <TextBox
        className="dx-field-value"
        stylingMode="outlined"
        placeholder={placeholder}
        width={160}
        showClearButton={true}
        value={textBoxValue || ""}
      >
        <TextBoxButton name="currency" location="after" options={helpOptions} />
      </TextBox>
    </>
  );
};

export default PopupInputs;
