import React, { useEffect, useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import HeaderSection from "./inner-components/header-section";
import PopupInputs from "./inner-components/popup-opener-inputs-sections";
import "./inventory-transfer.styles.scss";
import { getAllWarehouseData } from "../../../utils/items-master-data";
import { getAllTransportersList } from "../../../utils/gate-in-purchase";
import { toastDisplayer } from "../../../api/qrgenerators";
import { verifyProdcutionQrInput } from "../../../api/inventory.transfer.api";
import ItemsGrid from "./inner-components/items-grid";
import { Button, Switch, TextBox } from "devextreme-react";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { binLocationController } from "../../../utils/grpo-saver";
import PopupComponent from "./inner-components/popup-component";

const InventorytransferMain = () => {
  const [showToWarehousePopup, setShowToWarehousePopup] = useState(false);
  const [showFromWarehousePopup, setShowFromWarehousePopup] = useState(false);
  const [showFromBinPopup, setFromBinPopup] = useState(false);
  const [showToBinPopup, setToBinPopup] = useState(false);
  const [showBPPopup, setShowBPPopup] = useState(false);

  const [toWarehouseList, setToWarehouseList] = useState("");
  const [fromWarehouseList, setFromWarehouseList] = useState("");
  const [qcWareHouseBinList, setQcWareHouseBinList] = useState("");
  const [bpDetailList, setBpDetailList] = useState("");

  const [selectedToWarehouse, setSelectedToWarehouse] = useState("");
  const [selectedFromWarehouse, setSelectedFromWarehouse] = useState([]);
  const [selectedFromBin, setSelectedFromBin] = useState("");
  const [selectedToBin, setSelectedToBin] = useState("");
  const [selectedBPDetail, setSelectedBPDetail] = useState("");

  const [productionNumberInput, setProductionNumberInput] = useState("");
  const [innerWidth, setInnerWidth] = useState("");

  const [dataGridDataSource, setDataGridDataSource] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const [fromBinList, setFromBinList] = useState("");
  const [fromBinVisible, setFromBinVisible] = useState(true);

  const getBinList = async (whsCode) => {
    console.log("whsCode", whsCode);
    const binLocationDetailsResp = await binLocationController({ whsCode });
    console.log(binLocationDetailsResp);

    if (!binLocationDetailsResp.hasError) {
      const { responseData } = binLocationDetailsResp;
      console.log(responseData);
      setQcWareHouseBinList(responseData);
    }
  };

  // close from bin popup
  const popUpOutsideClickHandlerFromBin = () => {
    setFromBinVisible(false);
  };

  useEffect(() => {
    console.log("in use effect");
    if (selectedFromWarehouse.length > 0) {
      console.log("in use effect selectedFromWarehouse", selectedFromWarehouse);
      if (selectedFromWarehouse[0].binActivat === "No") {
        console.log("in use effect selectedFromWarehouse no ");
        setSelectedFromBin("none");
      }
    }
    if (selectedToWarehouse.length > 0) {
      console.log("in use effect selectedToWarehouse", selectedToWarehouse);
      if (selectedToWarehouse[0].binActivat === "No") {
        console.log("in use effect selectedToWarehouse no ");
        setSelectedToBin("none");
      }
    }
  }, [selectedFromWarehouse, selectedToWarehouse]);

  const fromBinChooser = async () => {
    if (selectedFromWarehouse.length > 0) {
      if (selectedFromWarehouse[0].binActivat === "Yes") {
        setFromBinPopup(true);
        getBinList(selectedFromWarehouse[0].whsCode);
      }
    }
  };

  const toBinChooser = async () => {
    if (selectedToWarehouse.length > 0) {
      if (selectedToWarehouse[0].binActivat === "Yes") {
        setToBinPopup(true);
        getBinList(selectedToWarehouse[0].whsCode);
      }
    }
  };

  const toWarehouseChooser = async () => {
    console.log("ToWarehouseChooser");
    const allwarehouses = await getWareHouseList();
    setToWarehouseList(allwarehouses);
    setShowToWarehousePopup(true);
  };

  const fromWarehouseChooser = async () => {
    // console.log("FromWarehouseChooser");
    const allwarehouses = await getWareHouseList();
    setFromWarehouseList(allwarehouses);
    setShowFromWarehousePopup(true);
  };

  const bpDetailsChooser = async () => {
    // console.log("BPDetailsChooser");
    const allbpdetails = await getBPDetailsList();
    setBpDetailList(allbpdetails);
    setShowBPPopup(true);
  };

  const getWareHouseList = async () => {
    return await getAllWarehouseData();
  };

  const getBPDetailsList = async () => {
    return await getAllTransportersList();
  };

  const productionNumberInputHandler = (data) => {
    setProductionNumberInput(data.value);
  };

  const productionNumberInputSearchHandler = async () => {
    // console.log(
    //   "selectedToWarehouse : ",
    //   selectedToWarehouse[0].whsCode,
    //   "\n\n selectedFromWarehouse : ",
    //   selectedFromWarehouse[0].whsCode
    // );
    if (!productionNumberInput) {
      return toastDisplayer("error", "Search field cannot be empty");
    }
    if (!selectedToWarehouse) {
      return toastDisplayer("error", "Please select To Warehouse !");
    }
    if (!selectedFromWarehouse) {
      return toastDisplayer("error", "Please select From Warehouse !");
    }

    /* check dupliacte entries*/
    // Check for duplicate entries before updating dataGridDataSource
    const isDuplicateEntry = dataGridDataSource.some(
      (item) => item.detailQRCodeID === productionNumberInput
    );
    if (isDuplicateEntry) {
      return toastDisplayer(
        "error",
        "You have scanned duplicate items, please scan unique items"
      );
    }
    /*
      hit the api
    */
    try {
      const apiRes = await verifyProdcutionQrInput(
        productionNumberInput,
        selectedFromWarehouse
      );

      const { hasError, errorMessage, responseData } = await apiRes;

      if (hasError === true) {
        console.log("The api fetch error", hasError);
        toastDisplayer("error", errorMessage);
        return toastDisplayer("error", "Invalid item scan");
      } else {
        // console.log("The api fetch success", apiRes);
        return setDataGridDataSource([...dataGridDataSource, responseData]);
      }
    } catch (error) {
      // console.log(error);
      // console.log(dataGridDataSource);
      return toastDisplayer(
        "error",
        "Something went wrong, please try again later.."
      );
    }
  };

  const fromWarehouseRef = useRef("");
  const toWarehouseRef = useRef("");
  const fromBinRef = useRef("");
  const toBinRef = useRef("");
  const getBPref = useRef("");
  const txtBoxRef = useRef("");
  const [countRef, setCountRef] = useState(false);

  const handleRefresh = () => {
    setCountRef(true);
    if (fromWarehouseRef.current) {
      fromWarehouseRef.current.instance.reset();
    }
    if (toWarehouseRef.current) {
      toWarehouseRef.current.instance.reset();
    }
    if (getBPref.current) {
      getBPref.current.instance.reset();
    }
    if (txtBoxRef.current) {
      txtBoxRef.current.instance.reset();
    }
  };

  useEffect(() => {
    const selectedToWarehouseResolver = async () => {
      const data = await selectedToWarehouse;
      // console.log("Choosen To Warehouse", data);
      setSelectedToWarehouse(data);
    };
    selectedToWarehouseResolver();
  }, [selectedToWarehouse]);

  useEffect(() => {
    const selectedFromWarehouseResolver = async () => {
      const data = await selectedFromWarehouse;
      console.log("Choosen From Warehouse", data);
      setSelectedFromWarehouse(data);
    };
    selectedFromWarehouseResolver();
  }, [selectedFromWarehouse]);

  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  const HandleDecodedData1 = (data) => {
    // setSelectedPo(data);
    console.log("data after scanning  : ", data);
    setProductionNumberInput(data);
    // setShowPO(true);
    setShowScanner(false);
  };

  const helpFromBinOptions = {
    icon: HelpIcons,
    onClick: async () => {
      setFromBinPopup(true);
    },
  };

  const popUpOutsideClickHandler = () => {
    setFromBinPopup(false);
  };

  const [isFromWarehouseTxtDisable, setFromWarehouseTxtDisable] =
    useState(false);

  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner inventory-transfer-main-container ">
      {showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="containerInventry"
            showScan={showScanner}
            HandleCloseQrScanner1={HandleCloseQrScanner}
            HandleDecodedData={HandleDecodedData1}
          ></TransparentContainer>
        </div>
      )}
      <div className="header-section">
        <div>
          <PopupHeaderText text={"Inventory Transfer"} />
          <PopupSubText text={"You can transfer the inventories here "} />
        </div>
        <div className="refreshBtnDiv">
          <Button
            text="New"
            width={124}
            height={40}
            icon="refresh"
            onClick={handleRefresh}
            className="refreshBtnIT"
          />
        </div>
      </div>

      <div className="main-content-section">
        <div className="main-content-top">
          <div className="left-section">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div className="warehouse-chooser-section">
                <PopupInputs
                  placeholder={"From Warehouse"}
                  chooser={fromWarehouseChooser}
                  showHelpPopup={showFromWarehousePopup}
                  setShowHelpPopup={setShowFromWarehousePopup}
                  gridDataSourceList={fromWarehouseList}
                  selectedValue={selectedFromWarehouse}
                  setSelectedValue={setSelectedFromWarehouse}
                  txtRef={fromWarehouseRef}
                  countRef={countRef}
                  setCountRef={setCountRef}
                  isDisable={false}
                  // txtDisableHandler={setFromWarehouseTxtDisable}
                />
                <PopupInputs
                  placeholder={"To Warehouse"}
                  chooser={toWarehouseChooser}
                  showHelpPopup={showToWarehousePopup}
                  setShowHelpPopup={setShowToWarehousePopup}
                  gridDataSourceList={toWarehouseList}
                  selectedValue={selectedToWarehouse}
                  setSelectedValue={setSelectedToWarehouse}
                  txtRef={toWarehouseRef}
                  countRef={countRef}
                  setCountRef={setCountRef}
                  isDisable={selectedFromWarehouse.length?false:true}
                />
              </div>

              <div className="warehouse-chooser-section">
                <PopupInputs
                  placeholder={"To Bin"}
                  chooser={toBinChooser}
                  showHelpPopup={showToBinPopup}
                  setShowHelpPopup={setToBinPopup}
                  gridDataSourceList={qcWareHouseBinList}
                  selectedValue={selectedToBin}
                  setSelectedValue={setSelectedToBin}
                  txtRef={toBinRef}
                  isDisable={selectedToWarehouse.length?false:true}
                />
              </div>
            </div>

            <div className="items-scanner-section">
              <HeaderSection
                productionNumberInputHandler={productionNumberInputHandler}
                productionNumberInput={productionNumberInput}
                productionNumberInputSearchHandler={
                  productionNumberInputSearchHandler
                }
                txtBoxRef={txtBoxRef}
                handleScan={handleScan}
                scannedData={productionNumberInput}
              />
            </div>
          </div>

          <div className="right-section">
            <PopupInputs
              placeholder={"Get BP Details"}
              chooser={bpDetailsChooser}
              showHelpPopup={showBPPopup}
              setShowHelpPopup={setShowBPPopup}
              gridDataSourceList={bpDetailList}
              selectedValue={selectedBPDetail}
              setSelectedValue={setSelectedBPDetail}
              txtRef={getBPref}
              countRef={countRef}
              setCountRef={setCountRef}
            />
          </div>
        </div>
        {dataGridDataSource.length > 0 && (
          <div className="main-content-datagrid-section">
            <ItemsGrid
              dataGridDataSource={dataGridDataSource}
              selectedToWarehouse={selectedToWarehouse}
              selectedFromWarehouse={selectedFromWarehouse}
              selectedFromBin={selectedFromBin}
              selectedToBin={selectedToBin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorytransferMain;
