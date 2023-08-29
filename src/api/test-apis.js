import axios from "axios";
import { API_URL } from "../utils/items-master-data";

export const testGetDetailsByProductionNumber = async (scannedQrCode) => {
  const requestBody = {
    headerQRCodeID: "CACDAHBH AH 000001",
    // headerQRCodeID: scannedQrCode,
    detailQRCodeID: "CACDAHBH AH 000001 000449",
    // detailQRCodeID: "CACDAHBH AH 000001 000238",

    branchID: "1",
  };
  const dataResponse = {
    hasError: true,
    data: "",
  };
  try {
    const response = await axios.post(
      `${API_URL}/DraftGRPO/ValidateItemQR`,
      requestBody
    );
    dataResponse.hasError = false; // Set error status to false
    dataResponse.data = response.data; // Set response data
    console.log(response.data);
  } catch (error) {
    // console.log(error);
    dataResponse.data = error.response
      ? error.response.data.statusMsg
      : "Unknown error";
  }

  return dataResponse; // Return the dataResponse object
};
