import axios from "axios";
import { API_URL } from "./items-master-data";
import { toast, cssTransition } from "react-toastify";
import {
  HeaderIncNo,
  IsDetailQRExist,
  IsHeaderQRExist,
  SaveHeaderQR,
  itemsIncNum,
  toastDisplayer,
} from "../api/qrgenerators";

// check if the header qr is generated or not
//https://localhost:8084/api/Commons/IsHeaderQRExist
//Handle 1:
export const checkHeaderQrExistence = async (
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
  console.log("This is the added remarks", addedRemarks);
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
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
    const data = response.data;

    if (data.isExist === "Y") {
      // check if the details exists
      console.log("Headers data exists");
      const { qrCode } = data;
      // console.log("HEADER'S QR CODE", qrCode);
      const detailsQRExists = await checkIfDetailsExists(
        branchID,
        docEntry,
        docNum,
        series,
        objType,
        itemCode,
        gateInNo,
        errors,
        qrCode,
        poDetailsfull,
        addedRemarks,
        addedBatchNum
      );
      // yes Details exists: then exit from here:
      console.log("Do Item QR Exists.. ?", detailsQRExists);

      // swirling toast
      if (detailsQRExists === "Y") {
        const bounce = cssTransition({
          enter: "animate__animated animate__bounceIn",
          exit: "animate__animated animate__bounceOut",
        });
        toast.error("Hey 👋, Qr has already been generated", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return "Detail Qr already-generated";
      }
      // Details do Not exist;
      // then get the incremental for the item first;
      // send to qr generator
      else {
        console.log(detailsQRExists);
        console.log("The Qr of detail does not exist--- so this flow");
        const isItemsQrGenerated = await itemsQrGeneratorAndSaver(
          branchID,
          qrCode,
          itemCode,
          qrMngBy,
          openQty,
          gateInNo,
          addedRemarks,
          addedBatchNum
        );
        return isItemsQrGenerated;
      }

      //const itemIncNumber = await getItemsMaxIncNumber(qrCode);
      // console.log("itemIncNumber: " + itemIncNumber);
      // After Getting the incremental, generate the Qr Code:
      // if (itemIncNumber.length < 15) {
      //   const itemsGeneratedQr = await mapDateToChars(
      //     itemIncNumber,
      //     poDetailsfull[0].docDate
      //   );
      //   // after getting the generated qr save that thing in the database
      //   console.log("itemsGeneratedQr: " + itemsGeneratedQr);
      //   const isSavedItemQr = await SaveDetailQR(
      //     branchID,
      //     qrCode,
      //     itemsGeneratedQr,
      //     itemIncNumber,
      //     itemCode,
      //     qrMngBy,
      //     openQty,
      //     gateInNo,
      //     addedRemarks
      //   );

      //   const savedItemResponse = await isSavedItemQr;
      //   if (savedItemResponse === "Saved Successfully!!!") {
      //     return "Qr Generated";
      //   }
      // }
    } else {
      console.log("Items Qr Data Do Not Exists", data);
    }
  } catch (error) {
    const { statusMsg, isExist } = error.response.data;
    if (isExist === "N") {
      console.log("Header Qr Data Not Found");
      // get the header Incremental number First
      const getHeaderIncNo = await axios.post(`${API_URL}/Commons/HeaderIncNo`);
      const incrementalNum = await getHeaderIncNo.data;
      // console.log(incrementalNum);

      // then generate the Qr Code and enter the header
      const qrCodeID = await mapDateToChars(
        incrementalNum,
        poDetailsfull[0].docDate,
        "headerIncNum"
      );
      console.log("Header Qr code", qrCodeID);
      //save this header to the database
      // console.log(poDetailsfull);
      const payload = {
        branchID,
        qrCodeID: qrCodeID,
        docEntry,
        docNum,
        series,
        docDate: poDetailsfull[0].docDate,
        objType,
        incNo: incrementalNum,
      };
      console.log("PayLoad to generate the Header QR String", payload);
      const saveHeaderIncNoResponse = await axios.post(
        `${API_URL}/Commons/SaveHeaderQR`,
        payload
      );
      // if it is saved
      console.log("Header Qr Is saved:", saveHeaderIncNoResponse.data);
      // get the Item Incremental Number
      const { isSaved } = saveHeaderIncNoResponse.data;
      if (isSaved === "Y") {
        // check the items Qr Existence
        const detailsExistance = await checkIfDetailsExists(
          branchID,
          docEntry,
          docNum,
          series,
          objType,
          itemCode,
          gateInNo,
          errors,
          qrCodeID,
          poDetailsfull,
          qrMngBy
        );
      }
    }
  }
};

// HANDLE: 2
// SHOULD CHECK IF THE DETAILS EXISTS OR NOT
export const checkIfDetailsExists = async (
  branchID,
  docEntry,
  docNum,
  series,
  objType,
  itemCode,
  gateInNo,
  errors,
  qrCode,
  poDetailsfull,
  qrMngBy
) => {
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
    const data = response.data;
    console.log("The itemsQr Code for this item exists: ", data);
    if (data.isExist == "Y") {
      return data.isExist;
    }
  } catch (error) {
    //get the items max inc number and then generate the ar code
    const { statusMsg, isExist } = error.response.data;
    if (isExist === "N") {
      console.log("The ItemsQr for this items does not exist", isExist);
      // return isExist;
      // get the items max incremental number, it needs the header Qr
      // the qrCode parameter is comming from the checkHeaderQrExistence
      const incrementNumForQrGenerator = await getItemsMaxIncNumber(qrCode);
      // now CREATE the items QR-STRING
      return isExist;
    }
  }
};

export const getItemsMaxIncNumber = async (headerQrString) => {
  try {
    const response = await axios.post(
      `${API_URL}/Commons/DetailIncNo?HeaderQR=${headerQrString}`
    );
    if (response.status === 200) {
      console.log("The incremental number is:" + response.data);
      const incrementalNum = response.data;
      return incrementalNum;
      // const headerQrCodeID = mapDateToChars(incrementalNum);
    } else {
      return "Item's incremental is not Not Found";
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// SAVE ITEM'S GENERATED QR DATA
export const SaveDetailQR = async (
  branchID,
  qrCode,
  itemsGeneratedQr,
  itemIncNumber,
  itemCode,
  qrMngBy,
  openQty,
  gateInNo,
  addedRemarks
) => {
  const requestBody = {
    branchID,
    headerQRCodeID: qrCode,
    detailQRCodeID: itemsGeneratedQr,
    incNo: itemIncNumber,
    itemCode,
    qrMngBy,
    qty: `${openQty}`,
    gateInNo,
    remark: addedRemarks ? addedRemarks : "",
    batchSerialNo: "",
  };
  console.log("This requestBody of SaveDetailsQr", requestBody);
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveDetailQR`,
      requestBody
    );
    console.log("The qr is saved for N series", response);
    if (response.data.isSaved === "Y") {
      return response.data.statusMsg;
    } else {
      console.log("Qr Generation faild for N item");
      return "Error: Failed to generate";
    }
  } catch (error) {
    console.log("Qr Generation faild for N item");
    console.log("Error while generating the Qr Code: " + error);
    return error;
  }
};
// date and QrString Handlers --------------------------------
const mapDateToChars = async (incrementalNum, docDate, flag) => {
  console.log("The doc date is", docDate);

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
const seriesAppender = async (yyyy, MM, DD, incrementalNum, flag) => {
  if (flag === "headerIncNum") {
    const finalString = yyyy + MM + DD + " " + MM + " " + incrementalNum;
    return finalString;
  }
};

// flow check if the header Qr already exists or not:
//   If No:
//        Get the incremental Number;
//        Generate the Header Qr;
//        Save the Header Qr;
//        Take the header Qr into account;
//        Generate the respective incremental Number of the item(checking is not needed since header itself has not been generated)

// export const getHeaderIncNo = async () => {
//   const response = await axios.post(`${API_URL}/Commons/HeaderIncNo`);
//   const data = response.data;
//   if (!data) return "Not Found";
//   else return data;
// };

// export const checkIfHeaderQrExists = async () => {
//   const response = await axios.post(
//     `${API_URL}/Commons/IsHeaderQRExist`,
//     requestBody
//   );
//   const data = response.data;
//   if (!data) return "Not Found";
//   else return data;
// };

// export const checkIfDetailsQrExists = async ( branchID,
//   docEntry,
//   docNum,
//   series,
//   objType,
//   itemCode,
//   gateInNo,
//   errors,
//   qrCodeID,
//   poDetailsfull,
//   qrMngBy) => {
//     const requestBody ={

//     };
//   const response = await axios.post(
//     `${API_URL}/Commons/IsDetailQRExist`,
//     requestBody
//   );
//   const data = response.data;
//   if (!data) return "Not Found";
//   else return data;
// };

const itemsQrGeneratorAndSaver = async (
  branchID,
  qrCode,
  itemCode,
  qrMngBy,
  openQty,
  gateInNo,
  addedRemarks,
  addedBatchNum
) => {
  console.log("Now I am at the itemsQrGeneratorAndSaver");
  console.log(`The PayLoad it has is: 
  BranchId: ${branchID}, HeaderQrCode: ${qrCode}`);
  if (qrMngBy === "S") {
    // console.log(openQty);
    // return null;
    const loopLength = openQty;
    const counterArray = [];
    const qty = "1";
    for (let i = 0; i < loopLength; i++) {
      const itemIncNumber = await getItemsMaxIncNumber(qrCode);
      const generateItemQr = qrCode + " " + itemIncNumber;
      const itemsGeneratedQr = generateItemQr;
      const isSavedItemQr = await SaveDetailQR(
        branchID,
        qrCode,
        itemsGeneratedQr,
        itemIncNumber,
        itemCode,
        qrMngBy,
        qty,
        gateInNo,
        addedRemarks
      );
      const savedItemResponse = await isSavedItemQr;
      if (savedItemResponse === "Saved Successfully!!!") {
        console.log("Qr Generated");
        counterArray.push(1);
        continue;
      } else {
        console.log("Qr Generation for Batch " + ++i + "failed");
        console.log(
          "Failed details",
          branchID,
          qrCode,
          itemsGeneratedQr,
          itemIncNumber,
          itemCode,
          qrMngBy,
          qty,
          gateInNo,
          addedRemarks
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
    // Needs to total Recieved Quantity
    // Needs Batch Number
    console.log("The Qr is Managed By Batches");
    console.log("No of Batches is: " + addedBatchNum);
    console.log("Total Received Quantity is: " + openQty);
    const loopLength = addedBatchNum;
    const eachBatchQty = openQty / addedBatchNum;
    console.log("No of Qty In Each Batch is: " + eachBatchQty);

    const counterArray = [];
    for (let i = 0; i < loopLength; i++) {
      const itemIncNumber = await getItemsMaxIncNumber(qrCode);
      console.log("The max inc num for this item is: ", itemIncNumber);
      const generateItemQr = qrCode + " " + itemIncNumber;
      const itemsGeneratedQr = generateItemQr;
      const isSavedItemQr = await SaveDetailQR(
        branchID,
        qrCode,
        itemsGeneratedQr,
        itemIncNumber,
        itemCode,
        qrMngBy,
        eachBatchQty,
        gateInNo,
        addedRemarks
      );
      const savedItemResponse = await isSavedItemQr;
      if (savedItemResponse === "Saved Successfully!!!") {
        console.log("Qr Generated");
        counterArray.push(1);
        continue;
      } else {
        console.log("Qr Generation for Batch " + ++i + "failed");
        console.log(
          "Failed details",
          branchID,
          qrCode,
          itemsGeneratedQr,
          itemIncNumber,
          itemCode,
          qrMngBy,
          eachBatchQty,
          gateInNo,
          addedRemarks
        );
      }
      counterArray.push(0);
    }
    if (!counterArray.includes(0)) {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate";
    }
  } else {
    const itemIncNumber = await getItemsMaxIncNumber(qrCode);
    const generateItemQr = qrCode + " " + itemIncNumber;
    const itemsGeneratedQr = generateItemQr;
    const isSavedItemQr = await SaveDetailQR(
      branchID,
      qrCode,
      itemsGeneratedQr,
      itemIncNumber,
      itemCode,
      qrMngBy,
      openQty,
      gateInNo,
      addedRemarks
    );
    const savedItemResponse = await isSavedItemQr;
    if (savedItemResponse === "Saved Successfully!!!") {
      return "Qr Generated";
    } else {
      return "Error: Failed to generate, Qr Code";
    }
  }
};

// display qr apis

export const fetchItemQrCode = async (data, poDetailsfull, seriesData) => {
  const { objType, docNum } = poDetailsfull[0];
  const { series } = seriesData[0];
  const { docEntry, gateInNo, itemCode } = data;
  const requestBody = {
    branchID: "1",
    docEntry,
    docNum,
    series,
    objType,
    itemCode,
    gateInNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetDetailDataQR`,
      requestBody
    );
    const data = await response.data;
    // console.log("The Qr String for this item is ", detailQRCodeID);
    return data;
  } catch (error) {
    // const { statusMsg } = error.response.data;
    // console.log(error);
    return error.response.data;
  }
};
export const fetchItemQrCode1 = async (docEntry,docNum,series,objType,itemCode,gateInNo) => {
  const requestBody = {
    branchID: "1",
    docEntry,
    docNum,
    series,
    objType,
    itemCode,
    gateInNo,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Commons/GetDetailDataQR`,
      requestBody
    );
    const data = await response.data;
    // console.log("The detailed response is ", response.data);
    // console.log("The Qr String for this item is ", detailQRCodeID);
    return data;
  } catch (error) {
    // const { statusMsg } = error.response.data;
    // console.log(error);
    return error.response.data;
  }
};

// New handlers
export const qrGenerationHandler = async (
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
  const doHeaderExists = await IsHeaderQRExist(
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
  );

  const data = await doHeaderExists;
  console.log(data);
  // if the header exists
  if (data.isExist === "Y") {
    // THE HEADER QR EXISTS
    console.log("The Doc Date is: ", poDetailsfull[0].docDate);
    console.log("Header Qr Exists, and it is: ", data.qrCode);
    console.log("I will check for items qr Now");
    const { qrCode } = data;
    console.log("Header Qr Code: ", qrCode);
    const doDetailsQrExists = await IsDetailQRExist(
      branchID,
      docEntry,
      docNum,
      series,
      objType,
      itemCode,
      gateInNo
    );

    // THE DETAILS QR CODE ALSO EXISTS
    if (doDetailsQrExists.isExist === "Y") {
      console.log(
        "The items QR Code also exists and , I have displayed the toast"
      );
      toastDisplayer("error", "Hey 👋, Qr has already been generated");
      return "Detail Qr already-generated";
    }

    // THE DETAILS QR CODE DOES NOT EXIST
    if (doDetailsQrExists.isExist === "N") {
      console.log("The items QR Code do not exists.");
      console.log(
        "Will find the items' inc number and then generate the Items QR Code"
      );
      // const itemsIncrementalNumber = await itemsIncNum(qrCode);
      const itemsQrGeneratedFinally = await itemsQrGeneratorAndSaver(
        branchID,
        qrCode,
        itemCode,
        qrMngBy,
        openQty,
        gateInNo,
        addedRemarks,
        addedBatchNum
      );
      console.log(
        "The items qr has also been generated and you will see the confirmation message"
      );
      return itemsQrGeneratedFinally;
    }
  }
  if (data.isExist === "N") {
    console.log("The header's data donot exists");
    console.log("I will generate the header data first");

    // Generate the header
    // Find the header Inc Number
    console.log("I will find the header Inc number first:");
    const headerIncrementalNumber = await HeaderIncNo();
    if (headerIncrementalNumber.isError === false) {
      const { headerincrementalNum } = headerIncrementalNumber;
      console.log(
        "I got the header increment number and it is " + headerincrementalNum
      );
      console.log("Now I will generate the header Qr Code");

      // Generate the Header Code
      const qrCodeId = await mapDateToChars(
        headerincrementalNum,
        poDetailsfull[0].docDate,
        "headerIncNum"
      );
      console.log("The generated header code is " + qrCodeId);

      // Now save the header QrCode:
      // Construct the header save, payload
      const payload = {
        branchID,
        qrCodeID: qrCodeId,
        docEntry,
        docNum,
        series,
        docDate: poDetailsfull[0].docDate,
        objType,
        incNo: headerincrementalNum,
      };
      const saveGeneratedHeaderQr = await SaveHeaderQR(payload);

      // if the header Qr has been saved successfully
      // go for items now
      if (saveGeneratedHeaderQr.isSaved === "Y") {
        console.log("Header's qr saved successfully");
        console.log(
          "Now I will check for the items qr, if it has been generated or not"
        );

        const doDetailsQrExists = await IsDetailQRExist(
          branchID,
          docEntry,
          docNum,
          series,
          objType,
          itemCode,
          gateInNo
        );
        // THE DETAILS QR CODE DOES NOT EXIST
        if (doDetailsQrExists.isExist === "N") {
          console.log("The items QR Code do not exists.");
          console.log(
            "Will find the items' inc number and then generate the Items QR Code"
          );
          // const itemsIncrementalNumber = await itemsIncNum(qrCode);
          const qrCode = await qrCodeId;
          const itemsQrGeneratedFinally = await itemsQrGeneratorAndSaver(
            branchID,
            qrCode,
            itemCode,
            qrMngBy,
            openQty,
            gateInNo,
            addedRemarks,
            addedBatchNum
          );
          console.log(
            "The items qr has also been generated and you will see the confirmation message"
          );
          return itemsQrGeneratedFinally;
        }
      }
    }
  }
};
