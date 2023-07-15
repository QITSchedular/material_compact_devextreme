import axios from "axios";

export const API_URL = "http://192.168.1.102:5173/api";
// http://192.168.1.102:5173/api/ItemSubGroups/Get?Filter=A
// https://localhost:8084/api/Commons/QR Managed By

export const getAllItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/Items/Get?Filter=A`);
    const data = response.data;
    console.log("All Items", data);
    return data;
  } catch (error) {
    return error;
  }
};

export const getItemGroup = async () => {
  try {
    const response = await axios.get(`${API_URL}/ItemGroups/Get?Filter=N`);
    const data = response.data;
    console.log("Items Group Data:", data);
    return data;
  } catch (error) {
    return error;
  }
};

export const getItemSubGroup = async () => {
  try {
    const response = await axios.get(`${API_URL}/ItemSubGroups/Get?Filter=N`);
    const data = response.data;
    console.log("Items SUBGroup Data:", data);
    return data;
  } catch (error) {
    return error;
  }
};
export const getUom = async () => {
  try {
    const response = await axios.get(`${API_URL}/UOMs/Get?Filter=N`);
    const data = response.data;
    console.log("Items UOM Data", data);
    return data;
  } catch (error) {
    return error;
  }
};
export const getQrManagedBy = async () => {
  try {
    const response = await axios.get(`${API_URL}/Commons/QR Managed By`);
    const data = response.data;
    console.log("Qr Managed By Data", data);
    return data;
  } catch (error) {
    return error;
  }
};

//saving Data
export const addNewItem = async (clientItemsData) => {
  try {
    console.log("FROM ADD NEW iTEMS", clientItemsData);
    const response = await fetch(`${API_URL}/Items/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientItemsData),
    });
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {}
};
