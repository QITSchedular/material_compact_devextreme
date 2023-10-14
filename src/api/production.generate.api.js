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
  console.log("The selected row data from the Production Qr Generation Controller is:", selectedRowData);
  const returnObject = {
    hasError: false,
    data: []
  }


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
    itemMngBy,
    whsCode,
    project,
    recComment
  } = selectedRowData;

  const doHeaderExists = await checkHeaderProductionQrExistence(
    selectedRowData
  );

  /*-------------The Header Qr Does Not Exists ------------------*/
  if (doHeaderExists.hasError) {
    console.log("Header Qr Does not exists !!")
    console.log("Header Qr Needs to be generated !!")
    const reqBody = {
      "branchID": branchID,
      "docEntry": proOrdDocEntry,
      "docNum": proOrdDocNum,
      "series": series,
      "objType": objType
    }
    const getHeaderQr = await getHeaderQR(reqBody);
    console.log("Got the header qrCode response as:=>", getHeaderQr);
    if (!getHeaderQr.hasError) {
      console.log("Save the header qr please..")
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

        if (doDetailsQrExists.hasError) {
          console.log(`Detail Qr Code do not exist, but header qr Code has been generated and saved`)

          const { qrCode } = getHeaderQr.responseData;
          console.log("The header qr code is: ", qrCode);

          const itemQrGenerationResult = await productionItemsQrGeneratorAndSaver(
            branchID,
            qrCode,
            itemCode,
            qrMngBy,
            recNo,
            receiptQty,
            addedBatches);
          console.log("Result of saving the detail qr Codes..", itemQrGenerationResult);
          // console.log("The Final Generation result is: ", itemQrGenerationResult);
          if (itemQrGenerationResult.includes(0)) {
            // returnObject.hasError = false;
            // returnObject.data.push("Qr, generation successfull...")

            // return returnObject;
            /* Get all the detal qr Data */
            const detailDataProductionQRPayload = {
              proOrdDocEntry, proOrdDocNum, series, itemCode, recNo, whsCode, project, receiptQty, recComment
            }
            const allDetailDataProductionRes = await getAllProductionDetailsQr(detailDataProductionQRPayload);
            console.log("allDetailDataProductionRes", allDetailDataProductionRes);
            const { responseData: detailOfAllQr, hasError: detailOfAllQrHasError } = allDetailDataProductionRes;
            if (!detailOfAllQrHasError) {
              const payloadFinalSap = await productionReceiptSapSaverPayloadConstructor(branchID, detailDataProductionQRPayload, detailOfAllQr)
            }
          }
        }
      }
    }
  }
  /*-------------The Header Qr Does Exists ------------------*/
  else {
    const doDetailsQrExists = await checkProductionDetailsQrExistence(
      proOrdDocEntry,
      proOrdDocNum,
      series,
      itemCode,
      recNo
    );

    if (doDetailsQrExists.hasError) {
      console.log("Header Exists but the details qr does not exist");
      console.log(
        "Will find the items' inc number and then generate the Items QR Code"
      );
      console.log("Extract header from the Header Existence", doHeaderExists);
      const { qrCode } = doHeaderExists.responseData;
      const itemQrGenerationResult = await productionItemsQrGeneratorAndSaver(
        branchID,
        qrCode,
        itemCode,
        qrMngBy,
        recNo,
        receiptQty,
        addedBatches
      );
      console.log("The Final Generation result is: ", itemQrGenerationResult);
      // now save the thing in the code 
      if (itemQrGenerationResult.includes(0)) {
        //  get the data for the production's detail qr
        const productionDetailQrData = await getDetailDataProductionQRHandler(branchID, proOrdDocEntry, proOrdDocNum, series, objType, itemCode, recNo);
        console.log("All productionDetailQrData")
        console.log(productionDetailQrData);
        /* No all the details has been take move the flow*/
        const detailDataProductionQRPayload = {
          proOrdDocEntry, proOrdDocNum, series, itemCode, recNo, whsCode, project, receiptQty, recComment
        }
        const allDetailDataProductionRes = await getAllProductionDetailsQr(detailDataProductionQRPayload);
        console.log("allDetailDataProductionRes", allDetailDataProductionRes);
        const { responseData: detailOfAllQr, hasError: detailOfAllQrHasError } = allDetailDataProductionRes;
        if (!detailOfAllQrHasError) {
          const payloadFinalSap = await productionReceiptSapSaverPayloadConstructor(branchID, detailDataProductionQRPayload, detailOfAllQr)
          console.log("Is the data been saved to SAP ???")
          console.log(payloadFinalSap);
        }
      }
      return itemQrGenerationResult;
    } else {
      returnObject.hasError = false;
      returnObject.data.push("Qr has alreadey been generated");

      return returnObject;
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
  branchID,
  qrCode,
  itemCode,
  qrMngBy,
  recNo,
  receiptQty,
  addedBatches
) => {
  console.log("This is productionItemsQrGeneratorAndSaver");

  if (qrMngBy === "B") {
    console.log('Qr is managed by batches')
    const isSavedQr = await batchWiseLooper(
      branchID,
      qrCode,
      itemCode,
      qrMngBy,
      recNo,
      receiptQty,
      addedBatches,);

    // return the counter array
    return isSavedQr;
  } else if (qrMngBy === "S") {
    console.log('Qr is managed by serialwise')
    const isSavedQr = await serialWiseLooper(
      branchID,
      qrCode,
      itemCode,
      qrMngBy,
      recNo,
      receiptQty,
      //addedBatches,
    );

    return isSavedQr;
  }
  else if (qrMngBy === "N") {
    console.log('Qr is managed by Numwise')
    const isSavedQr = await NumWise(branchID,
      qrCode,
      itemCode,
      qrMngBy,
      recNo,
      //receiptQty,
      //addedBatches,
    );

    return isSavedQr;
  }
};

const batchWiseLooper = async (branchID,
  qrCode,
  itemCode,
  qrMngBy,
  recNo,
  receiptQty,
  addedBatches) => {
  // first need to get the increment number for each item and save it
  console.log("THIS IS BATCH WISE LOOPER");
  const loopLength = addedBatches;
  const eachBatchQty = receiptQty / addedBatches;
  console.log("No of Qty In Each Batch is: " + eachBatchQty);
  const counterArray = [];
  for (let i = 0; i < loopLength; i++) {
    // generate the qr code and then get other things for it  
    const getProductionDetailQR = await getProductionItemsMaxIncNumber(qrCode);
    const { responseData: getAllProductionDetailsQrResponse, hasError: getProductionDetailQRHasError } = getProductionDetailQR;
    if (!getProductionDetailQRHasError) {
      const { qrCode: detailQRCodeID, incNo } = getAllProductionDetailsQrResponse;
      const isSavedDetailQrCode = await saveProductionDetailsQr(
        branchID,
        qrCode,
        detailQRCodeID,
        incNo,
        itemCode,
        qrMngBy,
        `${eachBatchQty}`,
        recNo,
      );
      if (isSavedDetailQrCode.hasError) {
        counterArray.push(1);
        console.log("Error while saving the Detail QR: ", detailQRCodeID);
      } else {
        counterArray.push(0);
        console.log("Detail qr Code has been saved", detailQRCodeID);
      }

    }
  }
  return counterArray;
};

const serialWiseLooper = async (branchID,
  qrCode,
  itemCode,
  qrMngBy,
  recNo,
  receiptQty,
  addedBatches,
) => {
  // first need to get the increment number for each item and save it
  console.log("THIS IS SERIAL WISE LOOPER");
  //const loopLength = addedBatches;
  //const eachBatchQty = receiptQty;
  //console.log("No of Qty In Each Batch is: " + eachBatchQty);
  const counterArray = [];
  for (let i = 0; i < receiptQty; i++) {
    // generate the qr code and then get other things for it  
    const getProductionDetailQR = await getProductionItemsMaxIncNumber(qrCode);
    const { responseData: getAllProductionDetailsQrResponse, hasError: getProductionDetailQRHasError } = getProductionDetailQR;
    if (!getProductionDetailQRHasError) {
      const { qrCode: detailQRCodeID, incNo } = getAllProductionDetailsQrResponse;
      const isSavedDetailQrCode = await saveProductionDetailsQr(
        branchID,
        qrCode,
        detailQRCodeID,
        incNo,
        itemCode,
        qrMngBy,
        //`${eachBatchQty}`,
        recNo,
      );
      if (isSavedDetailQrCode.hasError) {
        counterArray.push(1);
        console.log("Error while saving the Detail QR: ", detailQRCodeID);
      } else {
        counterArray.push(0);
        console.log("Detail qr Code has been saved", detailQRCodeID);
      }

    }
  }
  return counterArray;
};

const NumWise = async (branchID,
  qrCode,
  itemCode,
  qrMngBy,
  recNo,
  receiptQty,
  addedBatches
) => {
  // first need to get the increment number for each item and save it
  console.log("THIS IS NUM WISE");
  //const loopLength = addedBatches;
  const eachBatchQty = qrCode;
  //console.log("No of Qty In Each Batch is: " + eachBatchQty);
  const counterArray = [];
  // generate the qr code and then get other things for it  
  const getProductionDetailQR = await getProductionItemsMaxIncNumber(qrCode);
  const { responseData: getAllProductionDetailsQrResponse, hasError: getProductionDetailQRHasError } = getProductionDetailQR;
  if (!getProductionDetailQRHasError) {
    const { qrCode: detailQRCodeID, incNo } = getAllProductionDetailsQrResponse;
    const isSavedDetailQrCode = await saveProductionDetailsQr(
      branchID,
      qrCode,
      detailQRCodeID,
      incNo,
      itemCode,
      qrMngBy,
      `${eachBatchQty}`,
      recNo,
    );
    if (isSavedDetailQrCode.hasError) {
      counterArray.push(1);
      console.log("Error while saving the Detail QR: ", detailQRCodeID);
    } else {
      counterArray.push(0);
      console.log("Detail qr Code has been saved", detailQRCodeID);
    }

  }
  return counterArray;
};

export const saveProductionDetailsQr = async (
  branchID,
  headerQRCodeID,
  detailQRCodeID,
  incNo,
  itemCode,
  qrMngBy,
  qty,
  recNo
) => {
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
    console.log("The api res of SaveDetailProductionQR is: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from SaveDetailProductionQR controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

const getDetailDataProductionQRHandler = async (branchID, proOrdDocEntry, proOrdDocNum, series, objType, itemCode, recNo) => {
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
}
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

//--------------------------- To save the things in the SAP -------------------------------------//

const productionReceiptSapSaverPayloadConstructor = async (branchID, detailDataProductionQRPayload, detailOfAllQr) => {
  console.log("From productionReceiptSapSaverPayloadConstructor")
  console.log(detailDataProductionQRPayload, detailOfAllQr);
  const { proOrdDocEntry, proOrdDocNum, series, itemCode, recNo, whsCode, project, itemMngBy, receiptQty, recComment } = detailDataProductionQRPayload;

  const recDetails = detailOfAllQr.map(item => ({
    detailQRCodeID: item.detailQRCodeID || '',
    batchSerialNo: item.batchSerialNo || '',
    qty: item.qty || ''
  }));
  const sapSaverPayload = {
    branchID: parseInt(branchID),
    proOrdDocEntry,
    series,
    recNo,
    itemCode,
    itemMngBy,
    whsCode,
    binAbsEntry: 0,
    receiptQty,
    project: "null",
    comment: recComment,
    recDetails
  };

  const isProductionReceiptSaved = await productionReceiptSapSaver(sapSaverPayload);
  console.log("isProductionReceiptSaved", isProductionReceiptSaved);
  return isProductionReceiptSaved;
};

const productionReceiptSapSaver = async (payload) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.post(
      `${API_URL}/Production/ProductionReceipt`,
      payload
    );
    responseBody.responseData = response.data;
    console.log("The api res is from productionReceiptSapSaver: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller productionReceiptSapSaver", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};