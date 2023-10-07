import React, { useEffect, useState } from "react";
import "./generate-receipt.styles.scss";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../../components/typographyTexts/TypographyComponents";
import GenerateReceiptSelectors from "./generate-receipt-selectors";
import { getPeriodIndicator } from "../../../../utils/gate-in-purchase";
import {
  getProductionOrderItemDetails,
  getSeriesDataForPro,
  productionGetDraftReceiptList,
} from "../../../../api/production.generate.api";
import { toastDisplayer } from "../../../../api/qrgenerators";
import GenerateReceiptProPopup from "./generate-receipt-pro-popup";
import { LoadPanel } from "devextreme-react";
import GeneratePrintDataGrid from "./generate-receipt-print-datagrid";

const GenerateReceiptMain = () => {
  const [loading, setLoading] = useState(false);
  const [periodIndicators, setPeriodIndicators] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [seriesIndicator, setSeriesIndicator] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");

  const [isProPopupVisible, setIsProPopupVisible] = useState(false);
  const [poGridDataSource, setPoGridDataSource] = useState([]);
  const [userSelectedGridRow, setUserSelectedGridRow] = useState([]);
  const [selectedProductionOrder, setSelectedProductionOrder] = useState("");

  const [isGeneratePrintDataGridVisible, setIsGeneratePrintDataGridVisible] =
    useState(false);
  const [generateGridDataSource, setGenerateGridDataSource] = useState([]);

  const seriesSetter = (choosenSeries) => {
    const { series, seriesName } = choosenSeries;
    return setSelectedSeries(seriesName);
  };
  //CHOOSE A PERIOD INDICATOR
  useEffect(() => {
    const fetchPeriodIndicator = async () => {
      const apiRes = await getPeriodIndicator();
      setPeriodIndicators(apiRes);
    };
    fetchPeriodIndicator();
  }, []);
  //choose period based on the series
  useEffect(() => {
    const fetchSeriesIndicator = async () => {
      if (selectedPeriod) {
        const apiRes = await getSeriesDataForPro(selectedPeriod);
        if (!apiRes.hasError) {
          return setSeriesIndicator(apiRes.responseData);
        }
        setSeriesIndicator([]);
        return toastDisplayer(
          "error",
          apiRes.errorMessage
            ? apiRes.errorMessage
            : "Unable to get series data"
        );
      }
    };
    fetchSeriesIndicator();
  }, [selectedPeriod]);

  const proHelpOpener = async () => {
    if (!selectedPeriod || !selectedSeries) {
      return toastDisplayer(
        "error",
        "Please choose both Period and Series to proceed"
      );
    }
    await fetchPoHelpDataSource(seriesIndicator);
    setIsProPopupVisible(true);
  };
  const proHelpCloser = () => {
    setIsProPopupVisible(false);
  };
  const fetchPoHelpDataSource = async (seriesIndicator) => {
    const { series } = seriesIndicator[0];
    const apiRes = await productionGetDraftReceiptList(series);
    if (apiRes.hasError) {
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Something went wrong, please try again later"
      );
    }
    return setPoGridDataSource(apiRes.responseData);
  };

  const gridRowSelectSaveHandler = (userSelection) => {
    if (userSelection.length > 0) {
      const { proOrdDocNum } = userSelection[0];
      setSelectedProductionOrder(proOrdDocNum);
    }
  };

  const handleSearchProductionOrder = async () => {
    /* Validations*/
    if (!selectedProductionOrder) {
      return toastDisplayer("error", "Please select a production order first");
    }
    setLoading(true);
    const apiRes = await getProductionOrderItemDetails(userSelectedGridRow);
    if (apiRes.hasError) {
      setLoading(false);
      setGenerateGridDataSource([]);
      setIsGeneratePrintDataGridVisible(false);
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Production data not available, please try again later..."
      );
    }
    setGenerateGridDataSource(apiRes.responseData);
    setIsGeneratePrintDataGridVisible(true);
    // console.log("Api hit and data is available");
    // console.log(apiRes);
    setLoading(false);
  };
  const allItemsQrDisplayHandler = () => {};
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div
        className="content-block dx-card responsive-paddings default-main-conatiner"
        id="generate-receipt-container"
      >
        <div className="header-section">
          <PopupHeaderText text={"Generate Receipt - QR"} />
          <PopupSubText
            text={"Please select all necessary values to proceed.."}
          />
        </div>
        <GenerateReceiptSelectors
          periodIndicators={periodIndicators}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          seriesIndicator={seriesIndicator}
          seriesSetter={seriesSetter}
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
          proHelpOpener={proHelpOpener}
          selectedProductionOrder={selectedProductionOrder}
          handleSearchProductionOrder={handleSearchProductionOrder}
        />
        {isGeneratePrintDataGridVisible && (
          <div className="grenerate-print-pro-receipt-container">
            <GeneratePrintDataGrid
              generateGridDataSource={generateGridDataSource}
            />
          </div>
        )}
      </div>
      {isProPopupVisible === true && poGridDataSource.length > 0 ? (
        <GenerateReceiptProPopup
          poGridDataSource={poGridDataSource}
          setUserSelectedGridRow={setUserSelectedGridRow}
          userSelectedGridRow={userSelectedGridRow}
          gridRowSelectSaveHandler={gridRowSelectSaveHandler}
          proHelpCloser={proHelpCloser}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default GenerateReceiptMain;
