// https://localhost:8084/api/Commons/Period Indicator
import axios from "axios";
import { API_URL } from "./items-master-data";
import notify from "devextreme/ui/notify";
import { toast as RToast } from "react-toastify";
import { AppContext } from "../contexts/dataContext";
import { toastDisplayer } from "../api/qrgenerators";

export const getPeriodIndicator = async () => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.get(`${API_URL}/Commons/Period Indicator`);
    const data = response.data;
    // console.log(data);

    return data;
  } catch (error) {
    // return error;
    
    const statusMsg  = error.message;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};
export const getSeriesPo = async (series, branchid) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  // http://192.168.1.102:{{PORT}}/api/Commons/Series?Indicator=FY2223&ObjType=22&BranchID=1
  try {
    const response = await axios.get(
      `${API_URL}/Commons/Series?Indicator=${series}&ObjType=22&BranchID=${branchid}`
    );
    const data = response.data;
    // console.log("This is from gerSeriesPo api", data);
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    const { statusMsg } = error.data;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

export const getPurchaseOrder = async (
  poNumber,
  selectedSeries,
  flag,
  gateInNo
) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };

  const requestBody = {
    docNum: poNumber,
    series: selectedSeries,
    branchID: 1,
    gateInOnly: flag ? flag : "N",
    gateInNo: flag === "Y" && gateInNo ? `${gateInNo}` : "",
  };

  try {
    const response = await axios.post(
      `${API_URL}/PurchaseOrders/GetPO`,
      requestBody
    );
    // handle the error here
    const data = response.data;
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    // Handle any errors that occurred during the A.seriesData
    const statusMsg  = error.message;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

export const gateInAndUpdatePo = async (
  itemCode,
  receivedQty,
  lineNum,
  docNum,
  docEntry,
  vehicleName,
  selectedTransporterData
) => {
  const gateInNoResponse = await axios.post(
    `${API_URL}/Commons/GetGateINNo?BranchID=${1}`
  );

  const requestBody = {
    objType: "22",
    branchID: 1,
    gateInNo: gateInNoResponse.data,
    docEntry: docEntry,
    lineNum: lineNum,
    itemCode: itemCode,
    recQty: `${receivedQty}`,
    vehicleNo: vehicleName,
    transporter: selectedTransporterData[0].cardCode,
  };
  console.log("Request body to save the gatein", requestBody);
  try {
    const response = await axios.post(
      `${API_URL}/PurchaseOrders/GateINPO`,
      requestBody
    );
    // handle the error here
    console.log(response.data);
    return response.data;
  } catch (error) {
    // Handle any errors that occurred during the A.seriesData
    console.error("Error:", error.data);
    return "Error";
  }
};
// handling the async validation for the recieved quantity

export const callUpdatePoApi = async (
  updatedItemsList,
  docNum,
  docEntry,
  vehicleName,
  selectedTransporterData
) => {
  let length = updatedItemsList.length;
  const updatedResponses = [];
  for (let i = 0; i < length; i++) {
    const vehicleNo = vehicleName;
    console.log(
      "Inside For loop",
      updatedItemsList[i].key,
      updatedItemsList[i].recQty,
      updatedItemsList[i].lineNum,
      docNum,
      docEntry,
      vehicleNo,
      selectedTransporterData
    );
    const response = await gateInAndUpdatePo(
      updatedItemsList[i].key,
      updatedItemsList[i].recQty,
      updatedItemsList[i].lineNum,
      docNum,
      docEntry,
      vehicleNo,
      selectedTransporterData
    );
    if (response.isSaved === "Y") {
      updatedResponses.push(response);
    } else {
      const error = {
        statusCode: "400",
        isSaved: "N",
        statusMsg: `Gate in failed for item code: ${updatedItemsList[i].key}`,
      };
      updatedResponses.push(error);
    }
  }
  return updatedResponses;
  // call the above api one by one now
  // const loopCALL = updatedItemsList.map(async (element) => {
  //   // console.log(element)
  //   const response = await gateInAndUpdatePo(element.key, element.recQty);
  //   console.log(response);
  // });
  // await gateInAndUpdatePo("P052", "1");
};

// Get all po list(used in Grpo)
export const getPoLists = async () => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  // http://192.168.1.102:{{PORT}}/api/Commons/Series?Indicator=FY2223&ObjType=22&BranchID=1
  try {
    const response = await axios.post(
      `${API_URL}/DraftGRPO/GetPOList?BranchID=1`
    );
    const data = response.data;
    // console.log("This is from gerSeriesPo api", data);
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    if (error) {
      errors.hasError = true;
      errors.errorText = errors.message;

      // return errors;
      return toastDisplayer('error', error.message);
    }
    // const { statusMsg } = error.response.data;
    // if (statusMsg) {
    //   errors.hasError = true;
    //   errors.errorText = statusMsg;
    //   return errors;
    // }
    return toastDisplayer('error', error.message);
    // return errors;
  }
};

export const searchPoListsIQC = async (QRCode) => {
  const requestBody = {
    branchID: 1,
    fromDate: "",
    toDate: "",
    headerQRCodeID: QRCode,
  };
  console.log("QRCode : ", QRCode)
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      `${API_URL}/IncomingQC/GetGRPOListByPO`, //api will be change
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


// get all this list of gate In number according to the selected po number
export const getGateInNumberList = async (DocNum, Series) => {
  try {
    const response = await axios.get(
      `${API_URL}/Commons/FillGateInNo?Series=${Series}&DocNum=${DocNum}`
    );
    console.log("The list of all the gate in done", response.data);
    return response.data;
  } catch (error) {
    console.log("Error: " + error);
  }
};
// Get TransPorter List
export const getAllTransportersList = async () => {
  try {
    const response = await axios.get(`${API_URL}/Commons/Transporter`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const GateInList = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/PurchaseOrders/GateINList?BranchID=1`
    );
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      // Convert the recDate to a Date object
      let recDate = new Date(data[i].recDate);

      // Extract only the date portion (YYYY-MM-DD) and store it back in the data object
      data[i].recDate = recDate.toISOString().split("T")[0];

      console.log(data[i].recDate);
    }
    return data;
  } catch (error) {
    return error;
  }
};

export const errorHandler = () => { };
