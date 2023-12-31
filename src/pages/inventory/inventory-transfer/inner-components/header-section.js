import React from "react";
import { GRPOScanner } from "../../../../assets/icon";
import { Button, TextBox } from "devextreme-react";
const HeaderSection = ({
  productionNumberInputHandler,
  productionNumberInput,
  productionNumberInputSearchHandler,
  txtBoxRef,
handleScan,
scannedData
}) => {
  return (
    <div className="inventrory-transfer-inner-header-wrapper">
      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Type the production number"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={(data) => productionNumberInputHandler(data)}
          ref={txtBoxRef}
          value={scannedData}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={productionNumberInputSearchHandler}
          disabled={!productionNumberInput ? true : false}
        //   value={inputQrValue}
        />
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon={GRPOScanner}
          onClick={handleScan}
        />
      </div>
    </div>
  );
};

export default HeaderSection;
