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
    console.log("The GetProOrdListReceipt api res is: ", responseBody);
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
  const { docEntry, warehouse, quantity, project } = gridData[0];
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const requestBody = {
    ProOrdDocEntry: docEntry,
    series: 1197, // series is working statically but we have to take it from masters ~Poojan
    WhsCode: warehouse,
    binAbsEntry: 0,
    project: project,
    ReceiptQty: `${quantity}`,
    Comment: comments ? comments : "",
    proReworkDet: [
      {
        deptId: 1,
        hours: 8.5,
        delay: "2 days",
      },
      {
        deptId: 8,
        hours: 2,
        delay: "1 days",
      }
    ]
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
