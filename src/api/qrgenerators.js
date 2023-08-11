import axios from "axios";
import { API_URL } from "../utils/items-master-data";
import { toast } from "react-toastify";

// checks if the header's/Purchase order's Qr exists or not
export const IsHeaderQRExist = async (
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
    const responseData = await response.data;
    const { statusCode, isExist, qrCode } = responseData;
    const data = {
      isExist,
      qrCode,
    };
    return data;
  } catch (error) {
    const { statusCode, isExist, statusMsg } = error.response.data;
    const data = {
      isExist,
      statusMsg,
    };
    return data;
  }
};

// checks if the items Qr exists or not
export const IsDetailQRExist = async (
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
  // construct the request body
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
    const responseData = await response.data;
    const { statusCode, isExist, qrCode } = responseData;
    const data = {
      isExist,
      qrCode,
    };
    return data;
  } catch (error) {
    const { statusCode, isExist, statusMsg } = error.response.data;
    const data = {
      isExist,
      statusMsg,
    };
    return data;
  }
};

// gets the Purchase order's/Headers' Incremental Number
export const HeaderIncNo = async () => {
  try {
    const response = await axios.post(`${API_URL}/Commons/HeaderIncNo`);
    const incrementalNum = await response.data;
    const data = {
      isError: false,
      headerincrementalNum: incrementalNum,
    };
    return data;
  } catch (error) {
    console.log("Cannot find the Header incremental num: ", error);
    const data = {
      isError: true,
      errorMsg: "Something went wrong, please try again later",
    };
    return data;
  }
};

// Gets the Item's incremental number
export const itemsIncNum = async (headerQrString) => {
  try {
    const response = await axios.post(
      `${API_URL}/Commons/DetailIncNo?HeaderQR=${headerQrString}`
    );
    const incrementalNum = await response.data;
    return incrementalNum;
  } catch (error) {
    const errorResponse = "Something went wrong, please try again later";
    return errorResponse;
  }
};

// Saves the header's/Purchase order generated Qr Data
export const SaveHeaderQR = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/Commons/SaveHeaderQR`,
      payload
    );
    const incrementalNum = await response.data;
    return incrementalNum;
  } catch (error) {
    const errorResponse = "Something went wrong, please try again later";
    console.log(error);
    return errorResponse;
  }
};
// Saves the Items generated Qr Data

export const toastDisplayer = async (toastType, toastMsg) => {
  if (toastType === "error") {
    return toast.error(`${toastMsg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (toastType === "succes") {
    return toast.success(`${toastMsg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};
