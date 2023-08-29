import axios from "axios";
import { API_URL } from "./items-master-data";

// Get all po list(used in incoming QC)
export const searchPoListsIQC = async (QRCode) => {
  const requestBody = {
    branchID: 1,
    fromDate: "",
    toDate: "",
    headerQRCodeID: QRCode,
  };
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

// Get all po list(used in incoming QC)
export const validatePoListsIQC = async (obj) => {
  console.log(obj);
  const requestBody = {
    "branchID": 1,
    "headerQRCodeID": obj.headerQRCodeID,
    "detailQRCodeID": obj.detailQRCodeID,
    "grpoDocEntry": obj.docEntry
  };
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      `${API_URL}/IncomingQC/ValidateItem`, //api will be change
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

export const LockedWareHouseList = async () => {
  try {
    const res = await axios.get(`${API_URL}/Warehouses/Get?Filter=N`);
    const returnData = await res.data;
    return returnData;
  } catch (error) {
    console.log(error);
    const returnError = error.response.data;
    return returnError;
  }

};
