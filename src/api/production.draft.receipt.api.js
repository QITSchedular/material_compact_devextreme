import axios from "axios";
import { API_URL } from "../utils/items-master-data";

/*----------------------------------- Draft Receipt of the Production Handlers Start-----------------------------------------------------*/

export const getDraftReceiptProList = async () => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/GetProOrdListReceipt`
    );
    responseBody.responseData = response.data;
    console.log("The api res is: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};
export const saveProductionDraftReceipt = async (gridData, comments) => {
  const { docEntry, warehouse, quantity } = gridData[0];
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    ProOrdDocEntry: docEntry,
    WhsCode: warehouse,
    ReceiptQty: `${quantity}`,
    Comment: comments ? comments : "",
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/ProductionDraftReceipt`,
      requestBody
    );
    responseBody.responseData = response.data;
    console.log("The api res is: ", responseBody);
    return responseBody;
  } catch (error) {
    console.log("Error while fetching the data, from controller", error);
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};

/*----------------------------------- Draft Receipt of the Production Handlers End-----------------------------------------------------*/
