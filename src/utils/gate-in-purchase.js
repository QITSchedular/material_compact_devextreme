// https://localhost:8084/api/Commons/Period Indicator
import axios from "axios";
import { API_URL } from "./items-master-data";

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
  // http://192.168.1.102:{{PORT}}/api/Commons/Series?Indicator=FY2223&ObjType=22&BranchID=1
  try {
    const response = await axios.get(
      `${API_URL}/Commons/Series?Indicator=${series}&ObjType=22&BranchID=${branchid}`
    );
    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
};

export const getPurchaseOrder = async (poNumber, selectedSeries) => {
  const requestBody = {
    docNum: poNumber,
    series: selectedSeries,
    branchID: 1,
    gateInOnly: "N",
  };

  try {
    const response = await axios.post(
      `${API_URL}/PurchaseOrders/GetPO`,
      requestBody
    );
    // handle the error here
    // console.log(response.data);
    return response.data;
  } catch (error) {
    // Handle any errors that occurred during the A.seriesData
    console.error("Error:", error.response.data);
  }
};

// handling the async validation for the recieved quantity
