import { TextBox, Button as NormalButton } from "devextreme-react";
import React from "react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import "./incomingQC.scss";
import { GRPOScanner, dateStartToEnd } from "../../../assets/icon";


function IncomingQCComponent() {
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      //   showPopupHandler();
    },
  };
  const dateOptions = {
    icon: dateStartToEnd,
    onClick: async () => {
      //   showPopupHandler();
    },
  };
  return (
    <>
      <div className="main-section">
        <div className="date-section">
        <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Doc start to end date"
            width={220}
            showClearButton={true}
            valueChangeEvent="keyup"
          >
            <TextBoxButton
              name="currency"
              location="before"
              options={dateOptions}
            />
          </TextBox>
          <TextBox
            className="dx-field-value purchaseQRField"
            stylingMode="outlined"
            placeholder="Type the purchase QR code"
            width={230}
            showClearButton={true}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>
         

        </div>
        <div className="btnSection">
          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
          />

          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon={GRPOScanner}
          />
        </div>
        
      </div>
    </>
  );
}

export default IncomingQCComponent;
