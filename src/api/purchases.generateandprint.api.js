import { API_URL } from "../utils/items-master-data";
import axios from "axios";
import { toastDisplayer } from "./qrgenerators";

//First Step
export const qrGenerationController2 = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo,
  poDetailsfull,
  qrMngBy,
  openQty,
  addedRemarks,
  addedBatchNum
) => {
  /*Need to check if the header Exists or not*/
  let headerQr;
  const docDate = dateFormatter(poDetailsfull[0].docDate);

  const doHeaderQrExists = await headerExistenceChecker(
    branchID,
    docEntry,
    docNum,
    series,
    objType
  );
  const { responseData, hasError } = doHeaderQrExists;
  const headerResponseData = responseData;
  console.log("Head Qr existence status", doHeaderQrExists);
  // header Exists
  if (!hasError) {
    headerQr = headerResponseData.qrCode;
    const doDetailQrExists = await detailsQrExistenceChecker(
      branchID,
      docEntry,
      docNum,
      series,
      objType,
      itemCode,
      gateInNo
    );
    const {
      responseData: detailsQrExistenceRespData,
      hasError: detailsQrExistenceRespDataHasError,
    } = doDetailQrExists;
    if (detailsQrExistenceRespDataHasError) {
      console.log(detailsQrExistenceRespData);
      console.log("The Header Qr Exists but , detail do not");
      console.log("Need to get the details QR and then save it");
      console.log(
        "To Get the details Qr you need to run the function for each and every batch serial based item"
      );
      const getAndSave = await detailsQrGetter(
        docEntry,
        docNum,
        objType,
        series,
        branchID,
        itemCode,
        gateInNo,
        poDetailsfull,
        qrMngBy,
        openQty,
        addedRemarks,
        addedBatchNum,
        headerQr
      );
      const { counterArray, responseArray } = getAndSave;
      if (!counterArray.includes(0)) {
        return "Qr Generated";
      } else {
        return "Error: Failed to generate";
      }
    }
    if (!detailsQrExistenceRespDataHasError) {
      console.log("Qr Has already been generated for this entry");

      // return toastDisplayer(
      //   "success",
      //   "Qr Has already been generated for this entry"
      // );
      const responseBody = {
        qrGenerated: "Detail Qr already-generated",
        hasErrorOnGeneration: false,
      };
      return responseBody;
    }
  }

  // header does not exists
  if (hasError) {
    // Get the header QR
    const newHeaderQr = await headerQrGetter(
      branchID,
      docEntry,
      docNum,
      series,
      objType
    );
    const {
      responseData: headerQrGetterResponse,
      hasError: headerQrGetterResponsehasError,
      errorMessage: headerQrGetterResponseErrorMessage,
    } = newHeaderQr;
    console.log("headerQrGetterResponse", headerQrGetterResponse);
    if (!headerQrGetterResponsehasError) {
      const { incNo: headerQrIncNo, qrCode } = headerQrGetterResponse;
      console.log("The header inc No is", headerQrIncNo);
      console.log("The header qrCode is", qrCode);

      const isSavedHeaderQR = await headerQrSaver(
        branchID,
        qrCode,
        docEntry,
        docNum,
        series,
        docDate,
        objType,
        headerQrIncNo
      );
      const {
        responseData: headerSaverResponse,
        hasError: headerSaverResponseHasError,
        errorMessage,
      } = isSavedHeaderQR;
      console.log("Header Qr Response Saver Data: ", headerSaverResponse);
      // if header is saved
      if (!headerSaverResponseHasError) {
        console.log("Header has been saved successfully");
        // Check Items Qr existence
        const doDetailQrExists = await detailsQrExistenceChecker(
          branchID,
          docEntry,
          docNum,
          series,
          objType,
          itemCode,
          gateInNo
        );
        // if item does not exists
        // generate and save it
        const {
          responseData: doDetailQrExistsResponseData,
          hasError: doDetailQrExistsResponseHasError,
          errorMessag: doDetailQrExistsResponseErrorMessag,
        } = doDetailQrExists;
        if (doDetailQrExistsResponseHasError) {
          const getAndSave = detailsQrGetter(
            docEntry,
            docNum,
            objType,
            series,
            branchID,
            itemCode,
            gateInNo,
            poDetailsfull,
            qrMngBy,
            openQty,
            addedRemarks,
            addedBatchNum,
            headerQr
          );
          console.log("Got and saved the data", getAndSave);
        }
      }
    }
  }
};
//Second Step
const headerExistenceChecker = async (
  branchID,
  docEntry,
  docNum,
  series,
  objType
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    branchID,
    docEntry,
    docNum,
    series,
    objType,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsHeaderQRExist`,
      requestBody
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

// STEP 3
const detailsQrExistenceChecker = async (
  branchID,
  docEntry,
  docNum,
  series,
  objType,
  itemCode,
  gateInNo
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    branchID,
    docEntry,
    docNum,
    series,
    objType,
    itemCode,
    gateInNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsDetailQRExist`,
      requestBody
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

// step 4:
const headerQrGetter = async (branchID, docEntry, docNum, series, objType) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    branchID,
    docEntry,
    docNum,
    series,
    objType,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetHeaderQR`,
      requestBody
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

// setp 5:
const headerQrSaver = async (
  branchID,
  qrCodeID,
  docEntry,
  docNum,
  series,
  docDate,
  objType,
  incNo
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    branchID,
    qrCodeID,
    docEntry,
    docNum,
    series,
    docDate,
    objType,
    incNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveHeaderQR`,
      requestBody
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

const detailsQrGetter = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo,
  poDetailsfull,
  qrMngBy,
  openQty,
  addedRemarks,
  addedBatchNum,
  headerQr
) => {
  if (qrMngBy === "B") {
    const isSavedQR = batchWiseLooper(
      docEntry,
      docNum,
      objType,
      series,
      branchID,
      itemCode,
      gateInNo,
      poDetailsfull,
      qrMngBy,
      openQty,
      addedRemarks,
      addedBatchNum,
      headerQr
    );
    return isSavedQR;
  } else if (qrMngBy === "S") {
    const isSavedQR = serialWiseLooper(
      docEntry,
      docNum,
      objType,
      series,
      branchID,
      itemCode,
      gateInNo,
      poDetailsfull,
      qrMngBy,
      openQty,
      addedRemarks,
      headerQr
    );
    return isSavedQR;
  } else {
    const isSavedQR = noneWiseLooper(
      docEntry,
      docNum,
      objType,
      series,
      branchID,
      itemCode,
      gateInNo,
      poDetailsfull,
      qrMngBy,
      openQty,
      addedRemarks,
      addedBatchNum,
      headerQr
    );
    return isSavedQR;
  }
};

const batchWiseLooper = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo,
  poDetailsfull,
  qrMngBy,
  openQty,
  addedRemarks,
  addedBatchNum,
  headerQr
) => {
  console.log("The Qr is Managed By Batches");
  console.log("No of Batches is: " + addedBatchNum);
  console.log("Total Received Quantity is: " + openQty);
  const loopLength = addedBatchNum;
  const eachBatchQty = openQty / addedBatchNum;
  console.log("No of Qty In Each Batch is: " + eachBatchQty);
  const counterArray = [];
  for (let i = 0; i < loopLength; i++) {
    const theDetailQrData = await getGenerateDetailQrCode(headerQr);
    const {
      responseData: detailQrGeneratedResponse,
      hasError: detailQrGeneratedResponsehasError,
      errorMessage,
    } = theDetailQrData;
    console.log(
      "Check of details",
      detailQrGeneratedResponse,
      detailQrGeneratedResponsehasError,
      errorMessage
    );
    /* Saver the given detail QRCode data*/

    if (!detailQrGeneratedResponsehasError) {
      const { qrCode: detailQRCodeID, incNo } = detailQrGeneratedResponse;
      const isSavedDetailQrCode = await detailQrSaver(
        branchID,
        headerQr,
        detailQRCodeID,
        incNo,
        itemCode,
        qrMngBy,
        `${eachBatchQty}`,
        gateInNo,
        addedRemarks
      );
      console.log("isSavedDetailQrCode", isSavedDetailQrCode);
    }
  }
};
const serialWiseLooper = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo,
  poDetailsfull,
  qrMngBy,
  openQty,
  addedRemarks,
  headerQr
) => {
  console.log("The Qr is Managed By serial");
  console.log("Total Received Quantity is: " + openQty);
  const loopLength = openQty;
  const counterArray = [];
  const responseArray = [];
  const qty = "1";
  for (let i = 0; i < loopLength; i++) {
    const theDetailQrData = await getGenerateDetailQrCode(headerQr);
    const {
      responseData: detailQrGeneratedResponse,
      hasError: detailQrGeneratedResponsehasError,
      errorMessage,
    } = theDetailQrData;
    console.log(
      "Check of details",
      detailQrGeneratedResponse,
      detailQrGeneratedResponsehasError,
      errorMessage
    );
    /* Saver the given detail QRCode data*/

    if (!detailQrGeneratedResponsehasError) {
      const { qrCode: detailQRCodeID, incNo } = detailQrGeneratedResponse;
      const isSavedDetailQrCode = await detailQrSaver(
        branchID,
        headerQr,
        detailQRCodeID,
        incNo,
        itemCode,
        qrMngBy,
        `${qty}`,
        gateInNo,
        addedRemarks
      );
      const {
        responseData: isSavedDetailQrCodeResponseData,
        hasError: isSavedDetailQrCodeHasError,
      } = isSavedDetailQrCode;
      if (!isSavedDetailQrCodeHasError) {
        counterArray.push(1);
        responseArray.push(isSavedDetailQrCodeResponseData);
      }
    }
  }
  return { counterArray, responseArray };
};
const noneWiseLooper = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo,
  poDetailsfull,
  qrMngBy,
  openQty,
  addedRemarks,
  addedBatchNum,
  headerQr
) => {
  console.log("The Qr is Managed By serial");
  console.log("Total Received Quantity is: " + openQty);
  // const loopLength = openQty;
  const counterArray = [];
  const responseArray = [];
  const qty = openQty;
  const theDetailQrData = await getGenerateDetailQrCode(headerQr);
  const {
    responseData: detailQrGeneratedResponse,
    hasError: detailQrGeneratedResponsehasError,
    errorMessage,
  } = theDetailQrData;
  console.log(
    "Check of details",
    detailQrGeneratedResponse,
    detailQrGeneratedResponsehasError,
    errorMessage
  );
  if (!detailQrGeneratedResponsehasError) {
    const { qrCode: detailQRCodeID, incNo } = detailQrGeneratedResponse;
    const isSavedDetailQrCode = await detailQrSaver(
      branchID,
      headerQr,
      detailQRCodeID,
      incNo,
      itemCode,
      qrMngBy,
      `${qty}`,
      gateInNo,
      addedRemarks
    );
    const {
      responseData: isSavedDetailQrCodeResponseData,
      hasError: isSavedDetailQrCodeHasError,
    } = isSavedDetailQrCode;
    if (!isSavedDetailQrCodeHasError) {
      counterArray.push(1);
      responseArray.push(isSavedDetailQrCodeResponseData);
    }
  }
  return { counterArray, responseArray };
};

export const getGenerateDetailQrCode = async (headerQr) => {
  console.log(headerQr);
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetDetailQR?HeaderQR=${headerQr}`
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};
export const detailQrSaver = async (
  branchID,
  headerQRCodeID,
  detailQRCodeID,
  incNo,
  itemCode,
  qrMngBy,
  qty,
  gateInNo,
  remark
) => {
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
    qty,
    gateInNo,
    remark,
    batchSerialNo: "",
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveDetailQR`,
      requestBody
    );

    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

const dateFormatter = (inputString) => {
  const formattedDate =
    inputString.split("/")[2].split(" ")[0] +
    "-" +
    (inputString.split("/")[0].length === 1
      ? "0" + inputString.split("/")[0]
      : inputString.split("/")[0]) +
    "-" +
    (inputString.split("/")[1].length === 1
      ? "0" + inputString.split("/")[1]
      : inputString.split("/")[1]);

  return formattedDate;
};
