import axios from "axios";
import { API_URL } from "../utils/items-master-data";
const responseBody = {
  hasError: false,
  errorMessage: "",
  responseData: "",
};

export const verifyProdcutionQrInput = async (
  productionNumberInput,
  selectedToWarehouse
) => {
  const requestBody = {
    branchID: 1,
    fromWhs: `${selectedToWarehouse[0].whsCode}`,
    detailQRCodeID: `${productionNumberInput}`,
  };
  try {
    const response = await axios.post(
      `${API_URL}/InventoryTransfer/ItemDataInWhs`,
      requestBody
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response.data.statusMsg || error.response.data.errors;
    return responseBody;
  }
};
