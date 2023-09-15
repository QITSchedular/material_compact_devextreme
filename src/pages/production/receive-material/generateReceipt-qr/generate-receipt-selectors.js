import React from "react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import {
  DropDownButton,
  TextBox,
  Button as NormalButton,
} from "devextreme-react";
import { HelpIcons } from "../../../purchases/grpo/icons-exporter";

// const buttonDropDownOptions = { width: 250 };

const GenerateReceiptSelectors = ({
  periodIndicators,
  selectedPeriod,
  setSelectedPeriod,
  seriesIndicator,
  seriesSetter,
  selectedSeries,
  setSelectedSeries,
  proHelpOpener,
  selectedProductionOrder,
  handleSearchProductionOrder,
}) => {
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      proHelpOpener();
    },
  };

  const periodItemsClick = async ({ itemData }) => {
    await setSelectedPeriod(itemData.indicator);
    await setSelectedSeries("");
  };
  const seriesItemsClick = async ({ itemData }) => {
    // console.log(itemData);
    await seriesSetter(itemData);
  };
  return (
    <div className="actions-section">
      <div className="action-before-section">
        <div className="buttons-section">
          <DropDownButton
            id="period-indicator-dropdown"
            className="period-indicator-dropdown"
            text={selectedPeriod ? selectedPeriod : "Select Period"}
            keyExpr="indicator"
            displayExpr={"indicator"}
            items={periodIndicators}
            onItemClick={periodItemsClick}
          />
          <DropDownButton
            id="series-indicator-dropdown"
            className="series-indicator-dropdown"
            text={selectedSeries ? selectedSeries : "Select Series"}
            items={seriesIndicator}
            keyExpr={"series"}
            displayExpr={"seriesName"}
            onItemClick={seriesItemsClick}
          />
        </div>
        <div className="search-section">
          <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Choose Production Order"
            width={250}
            showClearButton={true}
            valueChangeEvent="keyup"
            // onValueChanged={handlePurchaseOrderEntry}
            value={selectedProductionOrder ? `${selectedProductionOrder}` : ""}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>

          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={handleSearchProductionOrder}
            disabled={selectedProductionOrder > 0 ? false : true}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateReceiptSelectors;
