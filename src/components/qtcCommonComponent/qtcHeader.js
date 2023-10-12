import React from "react";
import Button from "devextreme-react/button";
import {
  TextBox,
  Button as NormalButton,
  Button as TextBoxButton,
} from "devextreme-react/text-box";

const QtcHeader = ({
  title,
  subtitle,
  optionFunc,
  keyArray, // Search element array passes
  grpoList, // list of showed element which conatin like procced
  handleShowPoDropDetails, // handle function which shows grid which shows after click of down arrow
  handleProceed, // proceed button click function
}) => {
  return (
    <div className="content-block dx-card responsive-paddings grpo-content-wrapper">
      <div className="title-section">
        <h3 className="title-name">{title}</h3>
        <span className="title-description">{subtitle}</span>
      </div>

      <div className="actions-section">
        <div className="search-section">
          {keyArray &&
            keyArray.map((item, index) => {
              const key = item.feildType;
              const handlefunc = item.handlefunc;
              const selectedData = item.selectedRowsData;
              const placeholder = item.placeholder;
              const btnIcon = item.btnIcon;
              if (key === "textBox") {
                return (
                  <TextBox
                    className="dx-field-value"
                    stylingMode="outlined"
                    placeholder={placeholder}
                    width={250}
                    showClearButton={true}
                    onValueChanged={handlefunc}
                    value={
                      selectedData.length > 0 ? selectedData[0].qrCodeID : ""
                    }
                  >
                    <TextBoxButton
                      name="currency"
                      location="after"
                      options={optionFunc}
                    />
                  </TextBox>
                );
              } else if (key === "button") {
                return (
                  <Button
                    width={33}
                    height={33}
                    type="normal"
                    stylingMode="outlined"
                    icon="search"
                    onClick={handlefunc}
                  />
                );
              }
            })}
        </div>
      </div>

      {grpoList.size > 0 && (
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
                  onClick={handleShowPoDropDetails}
                ></Button>
              </div>
              <div className="single-po-proceed">
                <Button
                  text="Proceed"
                  onClick={() => handleProceed(qrCode)}
                ></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QtcHeader;