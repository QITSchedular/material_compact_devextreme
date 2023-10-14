import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { SwalDisplayer } from "../../../utils/showToastsNotifications";
import { Button, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import SelectedItemsListings from "./selected-items-listings";
import { useNavigate, useParams } from "react-router-dom";
import { toastDisplayer } from "../../../api/qrgenerators";
import {
  productionIssueSaveItems,
  productionValidateItemQr,
} from "../../../api/production.api";
import { BackBtn } from "../../../components";
import './issue-material-main.styles.scss';
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

const IssueMaterialScanItems = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  // const [showListDataGrid, setShowListDataGrid] = useState(false);
  const [showListDataGrid, setShowListDataGrid] = useState(false);
  const [scannedQrString, setScannedQrString] = useState("");
  const [scannedItemsData, setScannedItemsData] = useState([]);
  const [showScanner, setShowScanner] = useState(false); 
  const [scannedData, setScannedData] = useState([]);
  const inputQrValueChangedCallback = (data) => {
    // console.log(data.value);
    if (data.value) {
      setScannedQrString(data.value);
    }
  };

  const searchItemsClickHandler = async () => {
    if (!scannedQrString) {
      return toastDisplayer(
        "error",
        "Operation not allowed for empty search value !!!"
      );
    }

    const fetchValidatedItemsQrData = await productionValidateItemQr(
      id,
      scannedQrString
    );
    console.log(fetchValidatedItemsQrData);
    // if error display toast
    if (fetchValidatedItemsQrData.hasError) {
      return toastDisplayer(
        "error",
        fetchValidatedItemsQrData.errorMessage
          ? fetchValidatedItemsQrData.errorMessage
          : "Something went wrong, please try again later."
      );
    }
    // if no error check for duplicate entry in scannedItemsData
    await duplicatedScannedItemsChecker(fetchValidatedItemsQrData);
    console.log("Current scanned items data", scannedItemsData);
    await setShowListDataGrid(true);
  };

  const duplicatedScannedItemsChecker = (dataSource) => {
    const newItem = dataSource.responseData[0]; // Access the first item in the array
    if (!newItem) {
      // Handle the case where newItem is undefined or empty
      toastDisplayer("error", "Invalid Item Data");
      return;
    }

    const isDuplicate = scannedItemsData.some(
      (item) => item.detailQRCodeID?.trim() === newItem.detailQRCodeID?.trim()
    );

    if (isDuplicate) {
      toastDisplayer("error", "Duplicate Item: This item is already scanned.");
    } else {
      // No duplicate found, add the new item to scannedItemsData
      setScannedItemsData([...scannedItemsData, newItem]);
    }
  };

  const productionIssueSaver = async (dataToSave, comments) => {
    /*Hit the api to save this*/
    // console.log("Data to save : ",dataToSave,comments);
    console.log("scannedItemsData : ",scannedItemsData);
    const apiRes = await productionIssueSaveItems(dataToSave, comments);
    if (apiRes.hasError && apiRes.errorMessage.includes("Error code:")) {
      return toastDisplayer(
        "error",
        "Something went wrong, Please try again later"
      );
    }
    if (apiRes.hasError) {
      return toastDisplayer("error", apiRes.errorMessage);
    }
    SwalDisplayer("success", "Operation Successful");
    return navigate("/production/issue-material");
  };

  useEffect(() => {
    if (!id) {
      return navigate("/production/issue-material");
    }
  }, []);

  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };
  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  const HandleDecodedData1 = (data1)=>{
    // console.log("Scanned Data : ",data1);
    if (scannedData.includes(data1)) {
      console.log(`${data1} is already available.`);
    } else {
      setScannedData([...scannedData, data1]);
    }
    // setShowScanner(false);
  }
  const HandleSaveDecodedScannedData = async()=>{
    console.log("From HandleSaveDecodedScannedData",scannedData)
    setShowScanner(false);
    // scannedData.forEach(async(scannedItem)=>{
    //   await handleItemQrVerification(scannedItem);
    // })
  }
  return (

    <div className="content-block dx-card responsive-paddings default-main-conatiner issue-material-scanItems-container ">
     {showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="container"
            showScan={showScanner}
            HandleCloseQrScanner1={HandleCloseQrScanner}
            HandleDecodedData={HandleDecodedData1}
            HandleSaveDecodedData={HandleSaveDecodedScannedData}
          ></TransparentContainer>
        </div>
      )}
      <div className="header-section">
        <PopupHeaderText text={"Issue Material"} />
        <PopupSubText text={"Type or scan the item code to make an entry"} />
      </div>

      <div className="search-section">
        <TextBox
          className="dx-field-value"
          stylingMode="outlined"
          placeholder="Scan/Type the item QR code"
          width={250}
          showClearButton={true}
          valueChangeEvent="keyup"
          onValueChanged={inputQrValueChangedCallback}
          value={scannedQrString ? scannedQrString : ""}
        ></TextBox>
        <Button
          width={33}
          height={33}
          type="normal"
          stylingMode="outlined"
          icon="search"
          onClick={searchItemsClickHandler}
        // disabled={isSearchButtonDisabled}
        // value={inputQrValue}
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
      {showListDataGrid && (
        <>
          <div className="scanned-items-grid-section">
            <SelectedItemsListings
              scannedItemsData={scannedItemsData}
              productionIssueSaver={productionIssueSaver}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IssueMaterialScanItems;
