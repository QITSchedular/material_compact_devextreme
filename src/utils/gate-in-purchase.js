// https://localhost:8084/api/Commons/Period Indicator
import axios from "axios";
import { API_URL } from "./items-master-data";
import notify from "devextreme/ui/notify";
import { toast as RToast } from "react-toastify";
import { AppContext } from "../contexts/dataContext";

export const getPeriodIndicator = async () => {
  try {
    const response = await axios.get(`${API_URL}/Commons/Period Indicator`);
    const data = response.data;
    // console.log(data);

    return data;
  } catch (error) {
    return error;
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
    const { statusMsg } = error.response.data;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

export const getPurchaseOrder = async (poNumber, selectedSeries, flag) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };

  const requestBody = {
    docNum: poNumber,
    series: selectedSeries,
    branchID: 1,
    gateInOnly: flag ? flag : "N",
  };

  try {
    const response = await axios.post(
      `${API_URL}/PurchaseOrders/GetPO`,
      requestBody
    );
    // handle the error here
    console.log(response.data);
    const data = response.data;
    if (data) {
      return data;
    } else {
      return errors;
    }
  } catch (error) {
    // Handle any errors that occurred during the A.seriesData
    // console.error("Error:", error.response.data);
    const { statusMsg } = error.response.data;
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
  docEntry
) => {
  //http://192.168.1.102:{{PORT}}/api/PurchaseOrders/GetPO
  // console.log("itemCode: " + itemCode, "recQty: " + receivedQty);
  // alert(recQty);
  const requestBody = {
    objType: "22",
    branchID: 1,
    docEntry: docEntry,
    lineNum: lineNum,
    itemCode: itemCode,
    recQty: `${receivedQty}`,
  };

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
    console.error("Error:", error.response.data);
    return "Error";
  }
};
// handling the async validation for the recieved quantity

export const callUpdatePoApi = async (updatedItemsList, docNum, docEntry) => {
  // console.log("From Call to Update api", updatedItemsList, docNum, docEntry);
  let length = updatedItemsList.length;
  for (let i = 0; i < length; i++) {
    const response = await gateInAndUpdatePo(
      updatedItemsList[i].key,
      updatedItemsList[i].recQty,
      updatedItemsList[i].lineNum,
      docNum,
      docEntry
    );
    console.log(response);
    return response;
  }
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
    const { statusMsg } = error.response.data;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};
