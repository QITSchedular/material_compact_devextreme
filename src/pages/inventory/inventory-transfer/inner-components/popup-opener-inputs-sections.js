import React, { useEffect, useState } from "react";
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
  txtRef,
  countRef,
  setCountRef,
  isDisable,
}) => {
  const [textBoxValue, setTextBoxValue] = useState("");
  // // setTextBoxValue(isDisabled);
  // if(isDisabled){
  //   setTextBoxValue(true);
  // }else{
  //   // setTextBoxValue(false);
  // }
  useEffect(() => {
    if (countRef) {
      setTextBoxValue("");
      setCountRef(false);
    }
  }, [countRef]);
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
    console.log("data", data);
    if (data[0].whsCode) {
      return setTextBoxValue(data[0].whsName);
    }
    if (data[0].cardCode) {
      return setTextBoxValue(data[0].cardName);
    }
    if (data[0].absEntry) {
      console.log("----------");
      return setTextBoxValue(data[0].binCode);
    }
  };
  return (
    <>
      {showHelpPopup && (
        <PopupComponent
          popUpOutsideClickHandler={popUpOutsideClickHandler}
          placeholder={placeholder}
          gridDataSourceList={gridDataSourceList}
          onSelectAndClose={async (selectedValue) => {
            setSelectedValue(await selectedValue);
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
        height={40}
        showClearButton={true}
        value={textBoxValue || ""}
        disabled={isDisable ? true : textBoxValue ? true : false}
        // disabled={textBoxValue ? true : false}
        ref={txtRef}
      >
        <TextBoxButton name="currency" location="after" options={helpOptions} />
      </TextBox>
    </>
  );
};

export default PopupInputs;
