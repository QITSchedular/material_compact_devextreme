import axios from "axios";
import { checkErrorMessages, errorHandler } from "./errorHandler";

export const API_URL = "http://192.168.1.102:5173/api";
// http://192.168.1.102:5173/api/ItemSubGroups/Get?Filter=A
// https://localhost:8084/api/Commons/QR Managed By

export const getAllItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/Items/Get?Filter=A`);
    const data = response.data;
    console.log(data);

    return data;
  } catch (error) {
    return error;
  }
};

export const getItemGroup = async () => {
  try {
    const response = await axios.get(`${API_URL}/ItemGroups/Get?Filter=N`);
    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
};

export const getItemSubGroup = async () => {
  try {
    const response = await axios.get(`${API_URL}/ItemSubGroups/Get?Filter=N`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getUom = async () => {
  try {
    const response = await axios.get(`${API_URL}/UOMs/Get?Filter=N`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/Locations/Get?Filter=N`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getQrManagedBy = async () => {
  try {
    const response = await axios.get(`${API_URL}/Commons/QR Managed By`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllWarehouseData = async () => {
  try {
    const response = await axios.get(`${API_URL}/Warehouses/Get?Filter=A`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllWarehouseData_new = async () => {
  try {
    const response = await axios.get(`${API_URL}/Commons/ItemStock?ItemCode=`);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export const getMasterData = async (masterType) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.get(`${API_URL}/${masterType}/Get?Filter=A`);
    const data = response.data;
    return data;
  } catch (error) {
    const statusMsg  = error.message;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};

//saving Data
export const addNewItem = async (clientItemsData) => {
  try {
    const response = await fetch(`${API_URL}/Items/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientItemsData),
    });
    const responseData = await response.json();
    const handledResponse = await checkErrorMessages(responseData);
    // console.log("handledResponse", handledResponse);
    return handledResponse;
  } catch (error) { }
};


export const addNewMasterItem = async (clientItemsData, clientMasterType) => {
  console.log("clientItemsData ", clientItemsData, "\n\n\n clientMasterType ", clientMasterType);
  console.log(`${API_URL}/${clientMasterType}/Save`);
  try {
    const response = await fetch(`${API_URL}/${clientMasterType}/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientItemsData),
    });
    const responseData = await response.json();
    console.log("responseData", responseData);
    const handledResponse = await checkErrorMessages(responseData);
    console.log("handledResponse", handledResponse);
    return handledResponse;
  } catch (error) { }
};
