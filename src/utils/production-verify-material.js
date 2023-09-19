import axios from "axios";
import { API_URL } from "./items-master-data";

// ------------------ purchase order help ------------------ //

export const getProductionOrder = async () => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/GetDraftIssueList`
    );
    const data = response.data;
    // console.log("This is from gerSeriesPo api", data);
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    const { statusMsg } = error.response.data;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

// ------------------ Validate Item ------------------ //

export const validatePoListsVerifyMaterial = async (detailQRCodeID) => {
  const requestBody = {
    // "proDocEntry": 1,
    proDocEntry: 59,
    detailQRCodeID: detailQRCodeID,
  };

  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/ValidateItemQR`,
      // `${API_URL}/Production/ValidateDraftIssueItemQR`,
      requestBody
    );
    const data = response.data;
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    const { statusMsg } = error.response.data;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

export const productionVarifyIssueSaveItems = async (payload, comments) => {
  const constructedPayload = await productionIssuePayloadConstructor(
    payload,
    comments
  );
  console.log(constructedPayload)
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    // const response = await axios.post(
    //   `${API_URL}/Production/ProductionIssue`,
    //   constructedPayload
    // );
    // responseBody.responseData = response.data;
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

export const productionIssuePayloadConstructor = (payload, comments) => {
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
