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

export const validatePoListsVerifyMaterial = async (
  detailQRCodeID,
  docEntry
) => {
  const requestBody = {
    // "proDocEntry": 1,
    proDocEntry: docEntry,
    detailQRCodeID: detailQRCodeID,
  };

  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      // `${API_URL}/Production/ValidateItemQR`,
      `${API_URL}/Production/ValidateDraftIssueItemQR`,
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

export const productionVarifyIssueSaveItems = async (
  samplePayload,
  comments
) => {
  const constructedPayload = productionIssuePayloadConstructor(
    samplePayload,
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

    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data from the controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

export const productionIssuePayloadConstructor = (samplePayload, comments) => {
  let sampleResponse = {
    BranchID: 1,
    proOrdDocEntry: samplePayload[0].proOrdDocEntry,
    proOrdDocNum: samplePayload[0].docNum,
    series: samplePayload[0].series,
    Comment: samplePayload[0].comment,
    piItems: [],
  };

  let cumulativeQty = 0;

  samplePayload.forEach((payloadItem) => {
    cumulativeQty += payloadItem.issQty;

    let piBatchSerialItem = {
      draftIssNo: payloadItem.issNo,
      itemCode: payloadItem.itemCode,
      detailQRCodeID: payloadItem.qrCodeID,
      fromBinAbsEntry: payloadItem.fromBinAbsEntry,
      project: payloadItem.project,
      batchSerialNo: payloadItem.batchSerialNo,
      qty: payloadItem.issQty.toFixed(2),
    };

    let piItemsIndex = sampleResponse.piItems.findIndex(
      (item) => item.itemCode === payloadItem.itemCode
    );

    if (piItemsIndex === -1) {
      sampleResponse.piItems.push({
        itemCode: payloadItem.itemCode,
        lineNum: payloadItem.lineNum,
        itemMngBy: payloadItem.itemMngBy,
        uoMCode: payloadItem.uomCode,
        whsCode: payloadItem.whsCode,
        qty: cumulativeQty.toFixed(2),
        piBatchSerial: [piBatchSerialItem],
      });
    } else {
      sampleResponse.piItems[piItemsIndex].qty = cumulativeQty.toFixed(2);
      sampleResponse.piItems[piItemsIndex].piBatchSerial.push(
        piBatchSerialItem
      );
    }
  });

  return sampleResponse;
};
