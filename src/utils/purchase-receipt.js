import axios from "axios";
import { API_URL } from "./items-master-data";

export const getProductionOrder = async () => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  try {
    const response = await axios.post(
      `${API_URL}/Production/GetProOrdListReceipt`
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