import axios from "axios";
import { API_URL } from "./items-master-data";

export const getPoListsIC = async () => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const responseBody = {
      branchID: 1,
      fromDate: "",
      toDate: "",
      headerQRCodeID: "",
      getAll: "Y",
    };
    const response = await axios.post(
      `${API_URL}/IncomingQC/GetPOList`,
      responseBody
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

// Get all po list(used in incoming QC)
export const searchPoListsIQC = async (QRCode,fromDate,toDate) => {
  const requestBody = {
    branchID: 1,
    fromDate: fromDate,
    toDate: toDate,
    headerQRCodeID: QRCode
  };
  console.log(requestBody)
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

// save QC Item
export const SavePoListsIQC = async (obj) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(`${API_URL}/IncomingQC/QC`, obj);
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





// This comment should be removed asap
