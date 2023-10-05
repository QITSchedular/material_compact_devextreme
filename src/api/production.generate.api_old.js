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
  /*-------------The Header Qr Does Not Exists ------------------*/
  if (doHeaderExists.hasError) {
    /* try getting the header Incremental Number*/
    console.log("Header Qr Doesnot exists, get incremental number");

    const apiResHeaderIncrementalNumber = await getHeaderIncNum();
    const headerIncrementalNumber = apiResHeaderIncrementalNumber.responseData;

    console.log("Got the incremental number: " + headerIncrementalNumber);
    console.log("Generate qr for incremental number: ");

    /*-------------------- Generate the Qr Initial String--------------------*/
    console.log("Map date to Chars for the header qr code id: ");
    const headerQrCodeID = await mapDateToChars(
      headerIncrementalNumber,
      selectedRowData.proOrdDocDate,
      "headerIncNum"
    );
    console.log("The header qr has been generated: " + headerQrCodeID);
    /*Save the newly generated QrCode*/
    console.log("Save the newly generated HeaderQrCode");
    const headerSaverPayload = {
      branchID,
      qrCodeID: headerQrCodeID,
      docEntry: proOrdDocEntry,
      docNum: proOrdDocNum,
      series,
      docDate: "2023-09-07",
      objType,
      incNo: `${headerIncrementalNumber}`,
    };
    const saveGeneratedHeaderQr = await SaveHeaderQR(headerSaverPayload);
    if (!saveGeneratedHeaderQr.hasError) {
      /***Check for details qr existence**/
      console.log(
        "The Generated Header Code has been saved:",
        saveGeneratedHeaderQr.responseData
      );

      // /*-------------------------- Check for the detail Qr Code existence ---------------------------------------*/
      // const doDetailsQrExists = await checkProductionDetailsQrExistence(
      //   proOrdDocEntry,
      //   proOrdDocNum,
      //   series,
      //   itemCode,
      //   recNo
      // );
      // console.log("doDetailsQrExists Status");
      // console.log(doDetailsQrExists);
    }
    /*-------------The Header is Saved Now Check and generate the Items Qr AND sAVE ------------------*/
    const doDetailsQrExists = await checkProductionDetailsQrExistence(
      proOrdDocEntry,
      proOrdDocNum,
      series,
      itemCode,
      recNo
    );
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
  } else {
    /*-------------The Header Exists & Search For Item and save------------------*/
    console.log("The Header Exists, item qr doesnot exist");
    // Check fro the items Existence
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

export const getHeaderIncNum = async () => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/HeaderProductionIncNo`
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

export const mapDateToChars = async (incrementalNum, docDate, flag) => {
  console.log(docDate);

  const searializedDate = docDate.split(" ")[0];
  const date = new Date(searializedDate); // Parse the docDate string
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  // Pad single-digit month and day with a leading zero if needed
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  const map1 = new Map([
    [0, "A"],
    [1, "B"],
    [2, "C"],
    [3, "D"],
    [4, "E"],
    [5, "F"],
    [6, "G"],
    [7, "H"],
    [8, "I"],
    [9, "J"],
  ]);

  // Map the year, month, and day according to the provided map
  const yyyy =
    map1.get(parseInt(year[0])) +
    map1.get(parseInt(year[1])) +
    map1.get(parseInt(year[2])) +
    map1.get(parseInt(year[3]));
  const MM = map1.get(parseInt(month[0])) + map1.get(parseInt(month[1]));
  const DD = map1.get(parseInt(day[0])) + map1.get(parseInt(day[1]));

  const response = await seriesAppender(yyyy, MM, DD, incrementalNum, flag);
  return response;
};

export const seriesAppender = async (yyyy, MM, DD, incrementalNum, flag) => {
  if (flag === "headerIncNum") {
    const finalString = yyyy + MM + DD + " " + MM + " " + incrementalNum;
    return finalString;
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
      `${API_URL}/Commons/DetailProductionIncNo?HeaderQR=${qrCode}`
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
  if (qrMngBy === "S") {
    console.log(`Since the qr is managed by Serial Numbers: 
    The quantity for each Qr will be one  `);
    const loopLength = receiptQty;
    const counterArray = [];
    const qty = "1";
    for (let i = 0; i < loopLength; i++) {
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
        console.log("Qr Generated and saved", i + 1, itemsGeneratedQr);
        counterArray.push(1);
        continue;
      } else {
        console.log("Qr Generation for Serial" + ++i + "failed");
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
      }
      counterArray.push(0);
    }
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  }
  if (qrMngBy === "B") {
    // To generate you need receipt qty
    // You need how may batches should be made
    // const loopLength = addedBatchNum;
    console.log("The Qr is Managed By Batches");
    console.log("No of Batches provided by user is: " + addedBatches);
    console.log("Total Receipt quantity is: ", receiptQty);

    const loopLength = addedBatches;

    const eachBatchQty = receiptQty / addedBatches;
    console.log("No of Qty In Each Batch is: " + eachBatchQty);
    const counterArray = [];

    for (let i = 0; i < loopLength; i++) {
      const itemIncNumApiRes = await getProductionItemsMaxIncNumber(
        headerQRCodeID
      );
      const itemIncNumber = itemIncNumApiRes.responseData;
      console.log("The max inc num for this item is: ", itemIncNumber);
      const generateItemQr = headerQRCodeID + " " + itemIncNumber;
      const itemsGeneratedQr = generateItemQr;
      const isSavedItemQr = await saveProductionDetailsQr(
        headerQRCodeID,
        itemsGeneratedQr,
        itemIncNumber,
        itemCode,
        qrMngBy,
        eachBatchQty,
        recNo
      );
      /*  If the items qr has been saved successfully */
      if (!isSavedItemQr.hasError) {
        console.log("Qr Generated and saved", i + 1, itemsGeneratedQr);
        counterArray.push(1);
        continue;
      } else {
        console.log("Qr Generation for Serial" + ++i + "failed");
        console.log(
          "Failed details",
          headerQRCodeID,
          itemsGeneratedQr,
          itemIncNumber,
          itemCode,
          qrMngBy,
          eachBatchQty,
          recNo
        );
      }
      counterArray.push(0);
    }
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  }
  //------------------------ Qr Is Managed By None----------------------------------------//
  else {
    const itemIncNumApiRes = await getProductionItemsMaxIncNumber(
      headerQRCodeID
    );
    console.log("The Header QRCode is " + headerQRCodeID);
    const itemIncNumber = itemIncNumApiRes.responseData;
    const generateItemQr = headerQRCodeID + " " + itemIncNumber;
    const itemsGeneratedQr = generateItemQr;
    const isSavedItemQr = await saveProductionDetailsQr(
      headerQRCodeID,
      itemsGeneratedQr,
      itemIncNumber,
      itemCode,
      qrMngBy,
      receiptQty,
      recNo
    );
    // if the qr Has been generated successfully and saved successfully
    if (!isSavedItemQr.hasError) {
      console.log("Qr Generation and Saving Successful");
      return "Qr Generated";
    } else {
      console.log("Qr Generated, but Saving Failed");
      return "Error: Failed to generate, Qr Code";
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
