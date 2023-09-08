import React, { useEffect, useState } from "react";
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
import { Button } from "devextreme-react";

const InventorytransferMain = () => {
  const [showToWarehousePopup, setShowToWarehousePopup] = useState(false);
  const [showFromWarehousePopup, setShowFromWarehousePopup] = useState(false);
  const [showBPPopup, setShowBPPopup] = useState(false);

  const [toWarehouseList, setToWarehouseList] = useState("");
  const [fromWarehouseList, setFromWarehouseList] = useState("");
  const [bpDetailList, setBpDetailList] = useState("");

  const [selectedToWarehouse, setSelectedToWarehouse] = useState("");
  const [selectedFromWarehouse, setSelectedFromWarehouse] = useState("");
  const [selectedBPDetail, setSelectedBPDetail] = useState("");

  const [productionNumberInput, setProductionNumberInput] = useState("");
  const [innerWidth, setInnerWidth] = useState("");

  const [dataGridDataSource, setDataGridDataSource] = useState([]);

  const toWarehouseChooser = async () => {
    console.log("ToWarehouseChooser");
    const allwarehouses = await getWareHouseList();
    setToWarehouseList(allwarehouses);
    setShowToWarehousePopup(true);
  };

  const fromWarehouseChooser = async () => {
    console.log("FromWarehouseChooser");
    const allwarehouses = await getWareHouseList();
    setFromWarehouseList(allwarehouses);
    setShowFromWarehousePopup(true);
  };

  const bpDetailsChooser = async () => {
    console.log("BPDetailsChooser");
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
    if (!selectedToWarehouse || !selectedFromWarehouse) {
      return toastDisplayer("error", "Choose both To and From warehouses");
    }

    /* check dupliacte entries*/
    // Check for duplicate entries before updating dataGridDataSource
    const isDuplicateEntry = dataGridDataSource.some(
      (item) => item.detailQRCodeID === productionNumberInput
    );
    if (isDuplicateEntry) {
      return toastDisplayer("error", "Duplicate Item scan");
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
        console.log("The api fetch success", apiRes);
        return setDataGridDataSource([...dataGridDataSource, responseData]);
      }
    } catch (error) {
      console.log(error);
      console.log(dataGridDataSource);
      return toastDisplayer(
        "error",
        "Something went wrong, please try again later.."
      );
    }
  };

  useEffect(() => {
    const selectedToWarehouseResolver = async () => {
      const data = await selectedToWarehouse;
      console.log("Choosen To Warehouse", data);
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

  const refreshPage = ()=>{
    // on click button reset the states of selected warehouse 
  }
  
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner inventory-transfer-main-container ">
      {/* <div className="header-section">
        <PopupHeaderText text={"Inventory Transfer"} />
        <PopupSubText text={"You can transfer the inventories here "} />
      </div> */}
       <div className="content-block-wrapper">
        <div className="content-block-1">
          <div className="content-text">
          <PopupHeaderText text={"Inventory Transfer"} />
          <PopupSubText text={"You can transfer the inventories here "} />
          </div>
          <div className="button-groups">
            <Button
              text="New Item"
              type="default"
              icon="add"
              height={32}
              className="item-btn"
              onClick={refreshPage}
            />
          </div>
        </div>
      </div>
      

      <div className="main-content-section">
        <div className="main-content-top">
          <div className="left-section">
            <div className="warehouse-chooser-section">
              <PopupInputs
                placeholder={"To Warehouse"}
                chooser={toWarehouseChooser}
                showHelpPopup={showToWarehousePopup}
                setShowHelpPopup={setShowToWarehousePopup}
                gridDataSourceList={toWarehouseList}
                selectedValue={selectedToWarehouse}
                setSelectedValue={setSelectedToWarehouse}
              />
              <PopupInputs
                placeholder={"From Warehouse"}
                chooser={fromWarehouseChooser}
                showHelpPopup={showFromWarehousePopup}
                setShowHelpPopup={setShowFromWarehousePopup}
                gridDataSourceList={fromWarehouseList}
                selectedValue={selectedFromWarehouse}
                setSelectedValue={setSelectedFromWarehouse}
              />
            </div>

            <div className="items-scanner-section">
              <HeaderSection
                productionNumberInputHandler={productionNumberInputHandler}
                productionNumberInput={productionNumberInput}
                productionNumberInputSearchHandler={
                  productionNumberInputSearchHandler
                }
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
            />
          </div>
        </div>
        {dataGridDataSource.length > 0 && (
          <div className="main-content-datagrid-section">
            <ItemsGrid dataGridDataSource={dataGridDataSource} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorytransferMain;
