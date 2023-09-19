import {
  TextBox,
  Button as NormalButton,
  LoadPanel,
  Button,
  CheckBox,
  RadioGroup,
  ScrollView,
} from "devextreme-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DropDownButton from "devextreme-react/drop-down-button";
import NodataImg from "../../../assets/images/no-data-po.svg";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  Editing,
  AsyncRule,
  SearchPanel,
  ColumnFixing,
} from "devextreme-react/data-grid";
import "./gate-in-styles.scss";
//sample data Things
import {
  getPeriodIndicator,
  getPurchaseOrder,
  getSeriesPo,
  callUpdatePoApi,
  getAllTransportersList,
} from "../../../utils/gate-in-purchase";
import notify from "devextreme/ui/notify";
import { toast } from "react-toastify";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../grpo/icons-exporter";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { toastDisplayer } from "../../../api/qrgenerators";

const buttonDropDownOptions = { width: 230 };

// Childern componet Transporter
const TransporterHelpComponent = ({
  selectedTransporterDetail,
  handleSaver,
  outsideClickHandler,
}) => {
  const [transporterDataSource, setTransporterDataSource] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dataGridRef = useRef();

  const handleTransporterSelection = async ({
    selectedRowKeys,
    selectedRowsData,
  }) => {
    // var selectedRowKeyIs = "";
    // if (selectedRowKeys.length > 1) {
    //   console.log("Length is greater than 1");
    //   // selectedRowKeyIs = await selectedRowKeys[1];
    //   selectedRowKeyIs = await dataGridRef.current.instance.selectRows(
    //     selectedRowKeys[1]
    //   );
    // } else {
    //   console.log("Length is less than 1");
    //   selectedRowKeyIs = await dataGridRef.current.instance.selectRows(
    //     selectedRowKeys
    //   );
    // }
    // return await selectedRowSetter(selectedRowKeyIs);
    // console.log(selectedRowKeys.length);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      // clear selection
      // console.log("Greater");
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetter(value);
    }
  };

  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
    console.log(params);
  };

  const handleCancel = async () => {
    return await outsideClickHandler();
  };
  const handleSave = async () => {
    if (!selectedRowData) {
      return toastDisplayer("error", "Please select a row, to save changes");
      // return outsideClickHandler(true);
    } else {
      return await handleSaver(selectedRowData);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getTransporterDataSource = async () => {
      const transPortersData = await getAllTransportersList();
      if (transPortersData.length > 0) {
        setTransporterDataSource(transPortersData);
        console.log(transPortersData);
        return setLoading(false);
      } else {
        setError(true);
        setLoading(false);
        return toastDisplayer("error","Network Error");
      }
      setLoading(false);
    };
    getTransporterDataSource();
  }, []);

  return (
    <>
      {error ? (
        <h1>Error Loading the data....</h1>
      ) : (
        <>
          {/* <ScrollView width="100%" height="100%"> */}
          {/* <div
            className="purchaseOrderList-title-section responsive-paddings"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={"Purchase Order List"} />
            <PopupSubText text={"Search the purchase order"} />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancel} />
          </div> */}
          <div className="gateIn-header">
          <div
            className="title-section responsive-paddings"
            style={{
              // padding: "5px 20px !important",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={"Choose a Vendor.."} />
            <PopupSubText
              text={"Scroll through the list or type in the search box.."}
            />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancel} />
          </div>
          </div>
          <div
            className="dx-card responsive-paddings transporter-content-datagrid-container dx-saveBtn"
            style={{ margin: "8px 24px", height: "100% !important" }}
          >
            <DataGrid
              height={window.innerHeight - 250}
              dataSource={transporterDataSource}
              keyExpr="cardCode"
              showBorders={false}
              columnAutoWidth={true}
              hoverStateEnabled={true}
              className="transporter-data-grid testGrid"
              onSelectionChanged={handleTransporterSelection}
              selectedRowKeys={selectedRowKeys}
              ref={dataGridRef}
            >
              <SearchPanel
                visible={true}
                width={190}
                highlightCaseSensitive={true}
                className={"search-panel"}
              />
              <Selection mode="multiple" />
              <Scrolling columnRenderingMode="virtual" mode="infinite" />
              <Paging defaultPageSize={20} />
            </DataGrid>
          </div>
          <div
            className="buttons-section-save responsive-paddings "
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              text="Cancel"
              width={124}
              height={35}
              onClick={handleCancel}
            />
            <Button
              text="OK"
              type="default"
              className="dx-saveBtn"
              width={124}
              height={35}
              onClick={handleSave}
              disabled={selectedRowKeys.length > 0 ? false : true}
            />
          </div>
          {/* </ScrollView> */}
        </>
      )}
    </>
  );
};

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
  const [docEntry, setDocEntry] = useState("");
  const [docNum, setDocNum] = useState("");
  const [dataLineNum, setDataLineNum] = useState([]);

  const [selectedValue, setSelectedValue] = useState({
    periodIsSelected: false,
    seriesIsSelected: false,
    poIsEntered: false,
  });

  // help section of the transporter
  const [showTransporterHelp, setShowTransporterHelp] = useState(false);
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };
  const showPopupHandler = () => {
    // console.log("it is true to show");
    return setShowTransporterHelp(true);
  };

  const [updatedItems, setUpdatedItems] = useState([]);
  const handleSearchPurchasedOrder = async () => {
    const { periodIsSelected, seriesIsSelected, poIsEntered } = selectedValue;
    setLoading(true);
    const poResponse = await getPurchaseOrder(poNumber, selectedSeries.series);
    console.log("poResponse : ",poResponse.hasError);
    if (poResponse.hasError) {
      // alert();
      return toastDisplayer("error", poResponse.errorText);
      // return toast.error(poResponse.errorText, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false, 
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
    }
    // alert();
    const poDetArrayWithRecQty = await poResponse[0].poDet.map((item) => ({
      ...item,
      recQty: 0,
    }));

    await setDocEntry(poResponse[0].docEntry);
    await setDocNum(poResponse[0].docNum);
    // console.log("This is the whole P.O  data for gate In", poResponse);
    await setDataLineNum(poDetArrayWithRecQty.map((item) => item.lineNum));
    await setPoData(poDetArrayWithRecQty);

    // console.log(poDetArrayWithRecQty);

    setLoading(false);
  };

  // handle dropdown items click
  const periodItemsClick = async (e) => {
    await setSelectedPeriodIndicator(e.itemData.indicator || e.itemData);
    const seriesData = await getSeriesPo(e.itemData.indicator, 1);
    // console.log(seriesData);
    if (seriesData.hasError) {
      return toast.error(seriesData.errorText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    // the dropdown should be series name
    await setSeriesList(seriesData);
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
    console.log(params);
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
    console.log("Updated item from HandleGateIn", updatedItems);
    if (!vehicleName) {
      return toastDisplayer("error", "Enter vehicle number");
    }
    if (!transporterName) {
      return toastDisplayer("error", "Choose transporter");
    }
    if (updatedItems.length <= 0) {
      return toastDisplayer(
        "error",
        "Please recieve some item, to proceed with gate in.."
      );
    }
    console.log(updatedItems.map((items) => items));
    // console.log(vehicleName, selectedTransporterData);
    const callLoop = await callUpdatePoApi(
      updatedItems,
      docNum,
      docEntry,
      vehicleName,
      selectedTransporterData
    );
    console.log(callLoop);
    const allResponses = await Promise.all(
      callLoop.map(async (item) => {
        if (item.statusCode === "200") {
          return "success";
        } else {
          const errorResponse = await item.statusMsg;
          return `Error: ${errorResponse}`;
        }
      })
    );
    const isSuccess = allResponses.every((response) => response === "success");
    if (isSuccess) {
      await setUpdatedItems([]);
      await handleSearchPurchasedOrder();
      return toast.success("Items Taken in, add more?", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const errorMessage = allResponses.join("\n");
      await setUpdatedItems([]);
      return toast.error("Something went wrong:\n${errorMessage}", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    // if (callLoop.statusCode === "200") {
    //   await handleSearchPurchasedOrder();
    //   return toast.success("Items Taken in, add more?", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // } else {
    // return toast.error("Something went wrong, try again later", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });
    // }
  };

  const handleGridSaving = async (e) => {
    console.log(updatedItems);
    if (!e.changes[0]) {
      return toastDisplayer(
        "error",
        "Please, receive the quantity first to proceed"
      );
    }
    if (e.changes[0].data.recQty === 0) {
      console.log("Zero recQty");
      // return toastDisplayer("error", "Enter a valid quantity");
    }
    if (!e.changes[0].data.recQty) {
      toastDisplayer("error", "Enter a valid quantity");
    }

    const { key } = e.changes[0];
    const lineNumConstruct = poData.filter((item) => item.itemCode === key);

    const newData = {
      key: key,
      recQty: e.changes[0].data.recQty,
      lineNum: lineNumConstruct.length > 0 ? lineNumConstruct[0].lineNum : null,
    };

    setUpdatedItems((prevData) => {
      // const existingItemIndex = prevData.findIndex((item) => item.key === key);
      if (newData.recQty === 0) {
        const filteredData = prevData.filter((item) => item.key !== key);
        console.log("update items :", filteredData);
        return [...filteredData];
      }

      const existingItemIndex = prevData.findIndex((item) => item.key === key);

      console.log(
        "prevData:",
        prevData.findIndex((item) => item.key === key)
      ); // Add this line for debugging
      // console.log("newData:", newData); // Add this line for debugging
      if (existingItemIndex !== -1) {
        // Update the existing item with new recQty and lineNum
        console.log("prev : ", prevData[existingItemIndex].recQty);
        prevData[existingItemIndex] = newData;
        console.log("curr : ", prevData[existingItemIndex].recQty);
      } else {
        // Add the new data if no existing item with the same key
        prevData.push(newData);
      }

      return [...prevData];
    });
  };

  // handle it
  //fetch the searches data
  const getSeriesData = async () => {
    const data = await getPeriodIndicator();
    // console.log(data);
    if (data.hasError) {
      return toast.error(data.errorText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }); 
    }
    await setPeriodIndicators(data);
  };
  // Transporter handlers
  const [selectedTransporterData, setSelectedTransporterData] = useState([]);
  const [transporterName, setTransporterName] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  const handleTransporterRowSelection = (selectedTransporterDetail) => {
    // return outsideClickHandler();
    console.log(selectedTransporterDetail);
  };
  const outsideClickHandler = async () => {
    return setShowTransporterHelp(false);
  };
  const handleVehicleEntry = async (enteredVehicleNum) => {
    // console.log(enteredVehicleNum.value);
    return setVehicleName(enteredVehicleNum.value);
  };

  const handleSaver = async (transporterSelectionDetails) => {
    console.log("From saver", transporterSelectionDetails);
    await setSelectedTransporterData(transporterSelectionDetails);
    await setTransporterName(transporterSelectionDetails[0].cardName);
    return outsideClickHandler();
  };
  useEffect(() => {
    setShowTransporterHelp(false);
    getSeriesData();
  }, []);
  return (
    <>
      {showTransporterHelp && (
        <Popup
          visible={true}
          height={window.innerHeight - 20}
          contentRender={() => (
            <TransporterHelpComponent
              onSelectRow={handleTransporterRowSelection}
              handleSaver={handleSaver}
              outsideClickHandler={outsideClickHandler}
            />
          )}
          showCloseButton={true}
          hideOnOutsideClick={outsideClickHandler}
        ></Popup>
      )}
      <div className="main-container">
        {/* <div className="title-section">
        <h5 className="title-name">Gate IN: PO</h5>
        <span className="title-description">
          Select and Enter field values to get P.O
        </span>
      </div> */}

        <div className="actions-section">
          <div className="action-before-section">
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
                text={
                  selectedSeries ? selectedSeries.seriesName : "Select Series"
                }
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
                valueChangeEvent="keyup"
                onValueChanged={handlePurchaseOrderEntry}
              />

              <NormalButton
                width={33}
                height={33}
                type="normal"
                stylingMode="outlined"
                icon="search"
                onClick={handleSearchPurchasedOrder}
                disabled={poNumber.length > 0 ? false : true}
              />
            </div>
          </div>

          <div className="action-after-section">
            <div className="search-section bp-search-details">
              <TextBox
                className="dx-field-value"
                stylingMode="outlined"
                placeholder="Enter vehicle number"
                width={176}
                showClearButton={true}
                onValueChanged={handleVehicleEntry}
              />
              <TextBox
                className="dx-field-value"
                stylingMode="outlined"
                placeholder="Transporter"
                width={131}
                showClearButton={true}
                value={transporterName ? transporterName : ""}
              >
                <TextBoxButton
                  name="currency"
                  location="after"
                  options={helpOptions}
                />
              </TextBox>
            </div>
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
                <ColumnFixing enabled={true} />

                <Editing
                  mode="row"
                  allowDeleting
                  allowUpdating
                  selectTextOnEditStart={true}
                />
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
                  // allowEditing={
                  //   poData && parseInt(poData.openQty) > 0 ? true : false
                  // }
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
              {/* <h3>Nothing to Display</h3>
            <img src={NodataImg} alt="No Data Found" /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GateInComponent;
