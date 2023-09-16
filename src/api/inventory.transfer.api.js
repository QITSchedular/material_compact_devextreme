import axios from "axios";
import { API_URL } from "../utils/items-master-data";

export const verifyProdcutionQrInput = async (
  productionNumberInput,
  selectedFromWarehouse
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  console.log("Entered api caller");
  console.log("Scanned item qr is: ", productionNumberInput);
  console.log("Selected from warehouse data is: ", selectedFromWarehouse);
  const requestBody = {
    branchID: 1,
    fromWhs: `${selectedFromWarehouse[0].whsCode}`,
    detailQRCodeID: `${productionNumberInput}`,
  };
  console.log("The request body is", requestBody);
  try {
    const response = await axios.post(
      `${API_URL}/InventoryTransfer/ItemDataInWhs`,
      requestBody
    );
    responseBody.responseData = response.data[0];
    console.log("The api res is: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

export const inventoryTransferSaver = async (
  payload,
  selectedFromWarehouse,
  selectedToWarehouse
) => {
  const requestBody = await inventoryTransferPayloadConstructor(
    payload,
    selectedFromWarehouse,
    selectedToWarehouse
  );
  // console.log(JSON.stringify(requestBody));
  const PayloadData = JSON.stringify(requestBody);
  console.log("PayloadData: " + PayloadData);
  try {
    // const response = await axios.post(
    //   `${API_URL}/InventoryTransfer/InventoryTransfer`,
    //   PayloadData
    // );

    // Set the 'Content-Type' header to 'application/json'
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send the POST request with the JSON payload and the config object
    const response = await axios.post(
      `${API_URL}/InventoryTransfer/InventoryTransfer`,
      PayloadData,
      config
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const inventoryTransferPayloadConstructor = (
  payload,
  selectedFromWarehouse,
  selectedToWarehouse
) => {
  console.log("The payload is: " + JSON.stringify(payload));
  const itDetailsMap = {};

  payload.forEach((item) => {
    const {
      itemCode,
      itemMngBy,
      itemName,
      itemStock,
      itemWhsStock,
      project,
      qty,
      transQty,
      uoMCode,
      whs,
    } = item;
    const detailQRCodeID = item.detailQRCodeID;
    const batchSerialNo = item.batchSerialNo;
    const gateInNo = item.gateInNo;

    if (!itDetailsMap[itemCode]) {
      itDetailsMap[itemCode] = {
        itemCode,
        totalItemQty: qty,
        project,
        itemMngBy,
        itQRDetails: [],
      };
    } else {
      itDetailsMap[itemCode].totalItemQty = (
        +itDetailsMap[itemCode].totalItemQty + +qty
      ).toFixed(3);
    }

    itDetailsMap[itemCode].itQRDetails.push({
      gateInNo,
      detailQRCodeID,
      batchSerialNo,
      qty,
    });
  });

  const itDetails = Object.values(itDetailsMap);

  const result = {
    branchID: 1,
    cardCode: payload[0].cardCode, // Use the cardCode from the first item
    fromWhsCode: selectedFromWarehouse[0].whsCode, // Use the whs from the first item
    toWhsCode: selectedToWarehouse[0].whsCode, // Use the whs from the first item
    comments: "", // Set as needed
    itDetails,
  };

  return result;
};

// const payload = [
//   {
//     batchSerialNo: "2308B000430",
//     branchID: 1,
//     cardCode: "OS10327",
//     cardName: "AINEE AGRAWAL (BROKER)",
//     detailQRCodeID: "CACDAICC AI 000001 000700",
//     gateInNo: 83,
//     itemCode: "C002",
//     itemMngBy: "B",
//     itemName: "C002",
//     itemStock: "520.640000",
//     itemWhsStock: "502.640000",
//     project: "",
//     qty: "500.000",
//     transQty: "500.000",
//     uoMCode: "NOS",
//     whs: "QC",
//   },
//   {
//     batchSerialNo: "2308B000431",
//     branchID: 1,
//     cardCode: "OS10327",
//     cardName: "AINEE AGRAWAL (BROKER)",
//     detailQRCodeID: "CACDAICC AI 000001 000701",
//     gateInNo: 83,
//     itemCode: "C003",
//     itemMngBy: "B",
//     itemName: "C003",
//     itemStock: "183.910000",
//     itemWhsStock: "173.910000",
//     project: "",
//     qty: "150.000",
//     transQty: "150.000",
//     uoMCode: "NOS",
//     whs: "QC",
//   },
//   {
//     batchSerialNo: "2308B000432",
//     branchID: 1,
//     cardCode: "OS10327",
//     cardName: "AINEE AGRAWAL (BROKER)",
//     detailQRCodeID: "CACDAICC AI 000001 000702",
//     gateInNo: 84,
//     itemCode: "C002",
//     itemMngBy: "B",
//     itemName: "C002",
//     itemStock: "520.640000",
//     itemWhsStock: "502.640000",
//     project: "",
//     qty: "4.000",
//     transQty: "4.000",
//     uoMCode: "NOS",
//     whs: "QC",
//   },
//   {
//     batchSerialNo: "2308B000433",
//     branchID: 1,
//     cardCode: "OS10327",
//     cardName: "AINEE AGRAWAL (BROKER)",
//     detailQRCodeID: "CACDAICC AI 000001 000703",
//     gateInNo: 84,
//     itemCode: "C003",
//     itemMngBy: "B",
//     itemName: "C003",
//     itemStock: "183.910000",
//     itemWhsStock: "173.910000",
//     project: "",
//     qty: "25.000",
//     transQty: "25.000",
//     uoMCode: "NOS",
//     whs: "QC",
//   },
// ];
