import axios from "axios";
import { API_URL } from "../utils/items-master-data";

/*------------Production Issue ---------------------------------*/
export const getProductionOrderList = async () => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/GetProductionOrderList`
    );
    responseBody.responseData = response.data;
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

export const getProductionOrderItemList = async (docEntry) => {
  console.log("From APi", docEntry);
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    proOrderItem: [
      {
        DocEntry: docEntry,
      },
    ],
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/GetProductionOrderItemList`,
      requestBody
    );
    responseBody.responseData = response.data;
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

export const productionValidateItemQr = async (proDocEntry, detailQRCodeID) => {
  // console.log("From APi", proDocEntry, detailQRCodeID);
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    proDocEntry,
    detailQRCodeID,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/ValidateItemQR`,
      requestBody
    );
    responseBody.responseData = response.data;
    // console.log("The api res is: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

export const productionIssueSaveItems = async (payload, comments) => {
  const constructedPayload = await productionIssuePayloadConstructor(
    payload,
    comments
  );
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/ProductionIssue`,
      constructedPayload
    );
    responseBody.responseData = response.data;
    // console.log("The api res is: ", responseBody);

    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

const productionIssuePayloadConstructor = (payload, comments) => {
  // PART1: Static values
  const BranchID = 1;
  const PART1 = {
    BranchID,
    proOrdDocEntry: payload[0].docEntry,
    Comment: comments ? comments : "",
  };

  // PART2: Process piItems and piBatchSerial
  const piItems = [];
  const itemCodeMap = {}; // To group items by itemCode

  payload.forEach((entry) => {
    const { itemCode, lineNum, itemMngBy, proWhsCode, issQty, batchSerialNo } =
      entry;

    if (!itemCodeMap[itemCode]) {
      // Create a new item object if it doesn't exist
      const newItem = {
        itemCode,
        lineNum,
        itemMngBy,
        WhsCode: proWhsCode,
        qty: 0, // Initialize qty to 0
        piBatchSerial: [],
      };

      itemCodeMap[itemCode] = newItem;
      piItems.push(newItem);
    }

    // Update the qty by adding issQty
    // itemCodeMap[itemCode].qty += parseFloat(issQty);
    const cummulativeQty = itemCodeMap[itemCode].qty + parseFloat(issQty);
    itemCodeMap[itemCode].qty = `${cummulativeQty}`;

    // Add data to piBatchSerial
    itemCodeMap[itemCode].piBatchSerial.push({
      gateInNo: entry.gateInNo,
      itemCode,
      detailQRCodeID: entry.detailQRCodeID,
      batchSerialNo,
      qty: `${issQty}`,
    });
  });

  // Construct the final API response
  const apiResponse = {
    ...PART1,
    piItems,
  };

  return apiResponse;
};
/*------------Production Issue ---------------------------------*/
