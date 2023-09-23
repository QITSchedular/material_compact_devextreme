import axios from "axios";
import { API_URL } from "../utils/items-master-data";

export const getSeriesDataForPro = async (indicator) => {
  const ObjType = 202;
  const BranchID = 1;

  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.get(
      `${API_URL}/Commons/Series?Indicator=${indicator}&ObjType=${ObjType}&BranchID=${BranchID}`
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

export const productionGetDraftReceiptList = async (Series) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.post(
      `${API_URL}/Production/GetDraftReceiptList?Series=${Series}`
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

export const getProductionOrderItemDetails = async (userSelectedGridRow) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const data = await userSelectedGridRow;
  const { proOrdDocEntry } = data[0];

  try {
    const response = await axios.post(
      `${API_URL}/Production/GetDraftReceiptDetail?ProductionOrderEntry=${proOrdDocEntry}`
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

/*------------------------------------------QR GENERATION AND PRINITING LOGIC------------------------------------------------------*/
export const qrGenerationController = async (selectedRowData, addedBatches) => {
  console.log(
    "Selected Row Data from the qrGenerationController",
    selectedRowData
  );
  const branchID = "1";
  const objType = "202";
  const {
    proOrdDocDate,
    proOrdDocEntry,
    proOrdDocNum,
    series,
    itemCode,
    recNo,
    qrMngBy,
    receiptQty,
  } = selectedRowData;
  const doHeaderExists = await checkHeaderProductionQrExistence(
    selectedRowData
  );
  console.log("====", doHeaderExists);
  /*-------------The Header Qr Does Not Exists ------------------*/
  if (doHeaderExists.hasError) {
    const reqBody = {
      "branchID": branchID,
      "docEntry": proOrdDocEntry,
      "docNum": proOrdDocNum,
      "series": series,
      "objType": objType
    }
    const getHeaderQr = await getHeaderQR(reqBody);
    if (!getHeaderQr.hasError) {
      const headerSaverPayload = {
        "branchID": branchID,
        "qrCodeID": getHeaderQr.responseData.qrCode,
        "docEntry": proOrdDocEntry,
        "docNum": proOrdDocNum,
        "series": series,
        "docDate": proOrdDocDate,
        "objType": objType,
        "incNo": getHeaderQr.responseData.incNo
      }
      const saveGeneratedHeaderQr = await SaveHeaderQR(headerSaverPayload);
      console.log(saveGeneratedHeaderQr);
      if (!saveGeneratedHeaderQr.hasError) {
        /***Check for details qr existence**/
        console.log(
          "The Generated Header Code has been saved:",
          saveGeneratedHeaderQr.responseData
        );
        const doDetailsQrExists = await checkProductionDetailsQrExistence(
          proOrdDocEntry,
          proOrdDocNum,
          series,
          itemCode,
          recNo
        );
        console.log(doDetailsQrExists)
        if (doDetailsQrExists.hasError) {
          console.log("Header Exists but the details does not exist");
          console.log(
            "Will find the items' inc number and then generate the Items QR Code"
          );
          console.log("Extract header from the Header Existence", doHeaderExists);
          const { qrCode } = doHeaderExists.responseData;
          const itemQrGenerationResult = await productionItemsQrGeneratorAndSaver(
            qrCode,
            itemCode,
            qrMngBy,
            recNo,
            receiptQty,
            addedBatches
          );
          console.log("The Final Generation result is: ", itemQrGenerationResult);
        }
      }
    }
  } else {
    const doDetailsQrExists = await checkProductionDetailsQrExistence(
      proOrdDocEntry,
      proOrdDocNum,
      series,
      itemCode,
      recNo
    );
    console.log(doDetailsQrExists)
    if (doDetailsQrExists.hasError) {
      console.log("Header Exists but the details does not exist");
      console.log(
        "Will find the items' inc number and then generate the Items QR Code"
      );
      console.log("Extract header from the Header Existence", doHeaderExists);
      const { qrCode } = doHeaderExists.responseData;
      const itemQrGenerationResult = await productionItemsQrGeneratorAndSaver(
        qrCode,
        itemCode,
        qrMngBy,
        recNo,
        receiptQty,
        addedBatches
      );
      console.log("The Final Generation result is: ", itemQrGenerationResult);
    } else {
      console.log("header and detail qr both exists");
    }
  }
};

export const checkHeaderProductionQrExistence = async (selectedRowData) => {
  const { proOrdDocEntry, proOrdDocNum, series } = selectedRowData;
  const branchID = "1";
  const objType = "202";

  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    branchID,
    docEntry: proOrdDocEntry,
    docNum: proOrdDocNum,
    series: series,
    objType,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsHeaderProductionQRExist`,
      requestBody
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    if (error.response.data) {
      responseBody.responseData = error.response.data;
    }
    return responseBody;
  }
};

export const checkProductionDetailsQrExistence = async (
  proOrdDocEntry,
  proOrdDocNum,
  series,
  itemCode,
  recNo
) => {
  const branchID = "1";
  const objType = "202";
  const requestBody = {
    branchID: branchID,
    docEntry: proOrdDocEntry,
    docNum: proOrdDocNum,
    series: series,
    objType: objType,
    itemCode: itemCode,
    recNo: recNo,
  };
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsDetailProductionQRExist`,
      requestBody
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    if (error.response.data) {
      responseBody.responseData = error.response.data;
    }
    return responseBody;
  }
};

export const getHeaderQR = async (reqBody) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const QrGeneResponse = await axios.post(
      `${API_URL}/Commons/GetProductionHeaderQR`,
      reqBody
    );
    responseBody.responseData = QrGeneResponse.data;
    if (responseBody.responseData) {
      console.log("qr id generated");
    }
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

export const SaveHeaderQR = async (payload) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveHeaderProductionQR`,
      payload
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    if (error.response.data) {
      responseBody.responseData = error.response.data;
    }
    return responseBody;
  }
};
export const getProductionItemsMaxIncNumber = async (qrCode) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetProductionDetailQR?HeaderQR=${qrCode}`
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    if (error.response.data) {
      responseBody.responseData = error.response.data;
    }
    return responseBody;
  }
};
export const productionItemsQrGeneratorAndSaver = async (
  headerQRCodeID,
  itemCode,
  qrMngBy,
  recNo,
  receiptQty,
  addedBatches
) => {
  console.log("This is productionItemsQrGeneratorAndSaver");
  // function for generate item detail Qr and save 
  const counterArray = [];
  const item_detail_qr_common = async (qty) => {
    const itemIncNumApiRes = await getProductionItemsMaxIncNumber(
      headerQRCodeID
    );
    const itemIncNumber = itemIncNumApiRes.responseData;
    const generateItemQr = headerQRCodeID + " " + itemIncNumber;
    const itemsGeneratedQr = generateItemQr;
    const isSavedItemQr = await saveProductionDetailsQr(
      headerQRCodeID,
      itemsGeneratedQr,
      itemIncNumber,
      itemCode,
      qrMngBy,
      qty,
      recNo
    );

    if (!isSavedItemQr.hasError) {
      console.log("Qr Generated and saved", c + 1, itemsGeneratedQr);
      counterArray.push(1);
    } else {
      console.log("Qr Generation for Serial" + ++c + "failed");
      console.log(
        "Failed details",
        headerQRCodeID,
        itemsGeneratedQr,
        itemIncNumber,
        itemCode,
        qrMngBy,
        receiptQty,
        recNo
      );
      counterArray.push(0);
    }
  }

  // check for serial
  if (qrMngBy === "S") {
    var c = 0;
    console.log(`Since the qr is managed by Serial Numbers: 
    The quantity for each Qr will be one  `);
    const loopLength = receiptQty;
    counterArray = [];
    const qty = "1";
    for (let i = 0; i < loopLength; i++) {
      item_detail_qr_common(qty);
    }
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  }
  // check for batch
  else if (qrMngBy === "B") {
    // To generate you need receipt qty
    // You need how may batches should be made
    // const loopLength = addedBatchNum;
    console.log("The Qr is Managed By Batches");
    console.log("No of Batches provided by user is: " + addedBatches);
    console.log("Total Receipt quantity is: ", receiptQty);

    const loopLength = addedBatches;

    const eachBatchQty = receiptQty / addedBatches;
    console.log("No of Qty In Each Batch is: " + eachBatchQty);
    counterArray = [];

    for (let i = 0; i < loopLength; i++) {
      item_detail_qr_common(eachBatchQty);
    }
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  }
  //------------------------ Qr Is Managed By None----------------------------------------//
  else {
    item_detail_qr_common(receiptQty);
    counterArray = [];
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  }


};


export const saveProductionDetailsQr = async (
  headerQRCodeID,
  detailQRCodeID,
  incNo,
  itemCode,
  qrMngBy,
  qty,
  recNo
) => {
  const branchID = "1";
  const remark = "Test";
  const batchSerialNo = "";

  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    branchID,
    headerQRCodeID,
    detailQRCodeID,
    incNo,
    itemCode,
    qrMngBy,
    qty: `${qty}`,
    recNo,
    remark,
    batchSerialNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveDetailProductionQR`,
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
/*------------------------------------------QR GENERATION AND PRINITING LOGIC------------------------------------------------------*/
/*------------------------------------------All Qr Displayer------------------------------------------------------*/

export const getDetailDataProductionQR = async (detailsPayload) => {
  console.log("detailsPayload", detailsPayload);
  const { proOrdDocEntry, proOrdDocNum, series, itemCode, recNo } =
    detailsPayload;
  const objType = "202";
  const branchID = "1";

  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    branchID,
    docEntry: proOrdDocEntry,
    docNum: proOrdDocNum,
    series: series,
    objType,
    itemCode: itemCode,
    recNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetDetailDataProductionQR`,
      requestBody
    );
    responseBody.responseData = response.data;
    console.log("The api From getDetailDataPROQR: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log(
      "Error while fetching the data, from controller",
      error.response
    );
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

//---------------------------To Display all the qrS-------------------------------------//
export const getAllProductionDetailsQr = async (payload) => {
  const { proOrdDocEntry, proOrdDocNum, series, itemCode, recNo } = payload;
  const ObjType = 202;
  const branchID = 1;

  const requestBody = {
    branchID: `${branchID}`,
    docEntry: proOrdDocEntry,
    docNum: proOrdDocNum,
    series: series,
    objType: `${ObjType}`,
    itemCode,
    recNo,
  };
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetDetailDataProductionQR`,
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
