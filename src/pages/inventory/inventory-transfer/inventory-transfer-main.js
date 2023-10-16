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
import {
  Button,
  LoadIndicator,
  LoadPanel,
  Switch,
  TextBox,
} from "devextreme-react";
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
  const [selectedFromWarehouse, setSelectedFromWarehouse] = useState("");
  const [selectedFromBin, setSelectedFromBin] = useState("");
  const [selectedToBin, setSelectedToBin] = useState("");
  const [selectedBPDetail, setSelectedBPDetail] = useState("");

  const [productionNumberInput, setProductionNumberInput] = useState("");
  const [innerWidth, setInnerWidth] = useState("");

  const [dataGridDataSource, setDataGridDataSource] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const [fromBinList, setFromBinList] = useState("");
  const [fromBinVisible, setFromBinVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const topRefTest = useRef();

  const getBinList = async (whsCode) => {
    const binLocationDetailsResp = await binLocationController({ whsCode });

    if (!binLocationDetailsResp.hasError) {
      const { responseData } = binLocationDetailsResp;
      setQcWareHouseBinList(responseData);
    }
  };

  // close from bin popup
  const popUpOutsideClickHandlerFromBin = () => {
    setFromBinVisible(false);
  };

  useEffect(() => {
    if (selectedFromWarehouse.length > 0) {
      if (selectedFromWarehouse[0].binActivat === "No") {
        setSelectedFromBin("none");
      }
    }
    if (selectedToWarehouse.length > 0) {
      if (selectedToWarehouse[0].binActivat === "No") {
        setSelectedToBin("none");
      }
    }
  }, [selectedFromWarehouse, selectedToWarehouse]);

  const toBinChooser = async () => {
    if (selectedToWarehouse.length > 0) {
      if (selectedToWarehouse[0].binActivat === "Yes") {
        setToBinPopup(true);
        getBinList(selectedToWarehouse[0].whsCode);
      }
    }
  };

  const toWarehouseChooser = async () => {
    const allwarehouses = await getWareHouseList();
    setToWarehouseList(allwarehouses);
    setShowToWarehousePopup(true);
  };

  const fromWarehouseChooser = async () => {
    const allwarehouses = await getWareHouseList();
    setFromWarehouseList(allwarehouses);
    setShowFromWarehousePopup(true);
  };

  const bpDetailsChooser = async () => {
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
      // const responseDataNew = await responseData.map((item) => ({
      //   ...item,
      //   qty_edit: 0,
      // }));
      console.log("response dta : ", responseData);

      if (hasError === true) {
        toastDisplayer("error", errorMessage);
        return toastDisplayer("error", "Invalid item scan");
      } else {
      responseData.qty_edit = 0;
      return setDataGridDataSource([...dataGridDataSource, responseData]);
      }
    } catch (error) {
      console.log(error)
      return toastDisplayer(
        "error",
        error
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

  const handleRefresh = async () => {
    setCountRef(true);
    setDataGridDataSource([]);
    if (toBinRef.current) {
      toBinRef.current.instance.reset();
      setSelectedToBin("");
      setSelectedBPDetail("");
    }
    if (fromWarehouseRef.current) {
      fromWarehouseRef.current.instance.reset();
      setSelectedFromWarehouse("");
    }
    if (toWarehouseRef.current) {
      toWarehouseRef.current.instance.reset();
      setSelectedToWarehouse("");
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
      setSelectedToWarehouse(data);
    };
    selectedToWarehouseResolver();
  }, [selectedToWarehouse]);

  useEffect(() => {
    const selectedFromWarehouseResolver = async () => {
      const data = await selectedFromWarehouse;
      setSelectedFromWarehouse(data);
    };
    selectedFromWarehouseResolver();
  }, [selectedFromWarehouse]);

  const handleScan = () => {
    setShowScanner(true);
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  const HandleDecodedData1 = (data) => {
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
    <>
      {loading && <LoadPanel visible={true} />}
      <div
        className="content-block dx-card responsive-paddings default-main-conatiner inventory-transfer-main-container "
        ref={topRefTest}
      >
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
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
                    isDisable={selectedFromWarehouse.length ? false : true}
                  />
                  <PopupInputs
                    placeholder={"To Bin"}
                    chooser={toBinChooser}
                    showHelpPopup={showToBinPopup}
                    setShowHelpPopup={setToBinPopup}
                    gridDataSourceList={qcWareHouseBinList}
                    selectedValue={selectedToBin}
                    setSelectedValue={setSelectedToBin}
                    txtRef={toBinRef}
                    countRef={countRef}
                    setCountRef={setCountRef}
                    isDisable={
                      selectedToWarehouse.length
                        ? selectedToWarehouse[0].binActivat === "No"
                          ? true
                          : false
                        : true
                    }
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
                setDataGridDataSource={setDataGridDataSource}
                selectedToWarehouse={selectedToWarehouse}
                selectedFromWarehouse={selectedFromWarehouse}
                selectedToBin={selectedToBin}
                productionNumberInput={productionNumberInput}
                handleRefresh={handleRefresh}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InventorytransferMain;
