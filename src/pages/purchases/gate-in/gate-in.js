import { TextBox, Button as NormalButton, LoadPanel } from "devextreme-react";
import React, { useCallback, useEffect, useState } from "react";
import DropDownButton from "devextreme-react/drop-down-button";
import NodataImg from "../../../assets/images/no-data-po.svg";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  Editing,
  AsyncRule,
} from "devextreme-react/data-grid";
import "./gate-in-styles.scss";
//sample data Things
import {
  getPeriodIndicator,
  getPurchaseOrder,
  getSeriesPo,
  callUpdatePoApi,
} from "../../../utils/gate-in-purchase";
import notify from "devextreme/ui/notify";

// const columns = [
//   "Item Code",
//   "item Name",
//   "Ordered By",
//   "Received Qty",
//   "Project",
// ];
const buttonDropDownOptions = { width: 230 };

const GateInComponent = () => {
  const [scrollingMode, setScrollingMode] = React.useState("standard");
  const [periodIndicators, setPeriodIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodIndicator, setSelectedPeriodIndicator] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [poNumber, setPoNumber] = useState("");
  const [poData, setPoData] = useState(null);
  const [objType, setobjType] = useState(null);
  const [docEntry, setDocEntry] = useState(null);
  const [selectedValue, setSelectedValue] = useState({
    periodIsSelected: false,
    seriesIsSelected: false,
    poIsEntered: false,
  });
  const [updatedItems, setUpdatedItems] = useState([]);
  const handleSearchPurchasedOrder = async () => {
    const { periodIsSelected, seriesIsSelected, poIsEntered } = selectedValue;
    // if (!periodIsSelected || seriesIsSelected || poIsEntered) {
    //   return notify("Select and Fill all the Fields", "error", 1500);
    // }
    setLoading(true);
    const poResponse = await getPurchaseOrder(poNumber, selectedSeries.series);
    const poDetArrayWithRecQty = await poResponse[0].poDet.map((item) => ({
      ...item,
      recQty: 0,
    }));
    console.log(poDetArrayWithRecQty);
    await setPoData(poDetArrayWithRecQty);
    setLoading(false);
  };

  // handle dropdown items click
  const periodItemsClick = async (e) => {
    await setSelectedPeriodIndicator(e.itemData.indicator || e.itemData);
    const seriesData = await getSeriesPo(e.itemData.indicator, 1);
    // the dropdown should be series name
    setSeriesList(seriesData);
    setSelectedValue({ periodIsSelected: true });
    console.log("This is series data", seriesData);
  };

  const handleSeriesSelectionClick = async (e) => {
    await setSelectedSeries(e.itemData);
    // await setSelectedSeries(e.itemData.seriesNum);
    setSelectedValue({ seriesIsSelected: true });
  };

  const handlePurchaseOrderEntry = async (enteredPoNum) => {
    await setPoNumber(enteredPoNum.value);
    setSelectedValue({ poIsEntered: true });
  };

  // Handle the editing of the cell recieved qty
  const asyncValidation = (params) => {
    return new Promise((resolve, reject) => {
      const { qty, recQty, openQty } = params.data;
      if (recQty > openQty) {
        reject("Received Quantity should Not be greater than open quantity");
      } else {
        resolve(recQty);
      }
    });
  };

  const handleGateIn = async () => {
    const callLoop = callUpdatePoApi(updatedItems);
  };

  const handleGridSaving = useCallback((e) => {
    console.log(e.changes[0]);
    const newData = {
      key: e.changes[0].key,
      recQty: e.changes[0].data.recQty,
    };

    setUpdatedItems((prevData) => [...prevData, newData]);
  });

  //fetch the searches data
  useEffect(() => {
    const getSeriesData = async () => {
      const data = await getPeriodIndicator();
      // console.log(data);
      await setPeriodIndicators(data);
    };
    getSeriesData();
  }, []);

  return (
    <div className="content-block dx-card responsive-paddings main-container">
      <div className="title-section">
        <h3>Gate IN: Purchase Order</h3>
      </div>

      <div className="actions-section">
        <div className="buttons-section">
          <DropDownButton
            text={
              selectedPeriodIndicator
                ? selectedPeriodIndicator
                : "Select Period"
            }
            dropDownOptions={buttonDropDownOptions}
            keyExpr="indicator"
            displayExpr={"indicator"}
            items={periodIndicators}
            onItemClick={periodItemsClick}
            className="period-indicator"
          />
          <DropDownButton
            text={selectedSeries ? selectedSeries.seriesName : "Select Series"}
            dropDownOptions={buttonDropDownOptions}
            items={seriesList}
            keyExpr={"series"}
            displayExpr={"seriesName"}
            onItemClick={handleSeriesSelectionClick}
            className="series-indicator"
          />
        </div>
        <div className="search-section">
          <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Search by purchase order"
            width={250}
            showClearButton={true}
            onValueChanged={handlePurchaseOrderEntry}
          />

          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={handleSearchPurchasedOrder}
          />
        </div>
      </div>
      <div className="data-grid-section">
        {loading && <LoadPanel />}
        {poData ? (
          <>
            <DataGrid
              id="data-grid-container-local"
              dataSource={poData}
              keyExpr={"itemCode"}
              showBorders={false}
              focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              columnAutoWidth={true}
              columnHidingEnabled={false}
              remoteOperations={true}
              onSaving={handleGridSaving}
            >
              <Scrolling mode={scrollingMode} />
              <Paging defaultPageSize={10} />
              <Selection mode="multiple" />

              <Editing mode="row" allowDeleting allowUpdating />
              <Column
                dataField={"itemCode"}
                caption={"Item Code"}
                allowEditing={false}
              />
              <Column
                dataField={"itemName"}
                caption={"Item Name"}
                allowEditing={false}
              />
              <Column
                dataField={"qty"}
                caption={"Ordered Qty."}
                allowEditing={false}
              />
              <Column
                dataField={"openQty"}
                caption={"Open Qty."}
                allowEditing={false}
              />
              <Column
                dataField={"recQty"}
                type={"number"}
                caption={"Received Qty"}
                allowEditing={true}
              >
                <AsyncRule
                  message="Email address is not unique"
                  validationCallback={asyncValidation}
                />
              </Column>
              {/* <Column type="buttons" caption={"Actions"}>
                <Button
                  name="qrcode"
                  icon={"fa-solid fa-qrcode"}
                  visible={true}
                />
                <Button
                  name="printqr"
                  icon={"print"}
                  visible={true}
                  onClick={handlePrintClick}
                />
              </Column> */}
            </DataGrid>
            <div
              className="content-block-save"
              style={{ justifyContent: "flex-end", marginTop: "10rem" }}
            >
              <NormalButton
                type="default"
                text="Gate In"
                icon="fa-solid fa-right-to-bracket"
                className="gate-in-button"
                onClick={handleGateIn}
              />
            </div>
          </>
        ) : (
          <div className="no-po-section">
            <h3>Nothing to Display</h3>
            <img src={NodataImg} alt="No Data Found" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GateInComponent;
