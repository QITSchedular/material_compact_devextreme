import axios from "axios";
import { API_URL } from "./items-master-data";

// check if the header qr is generated or not
//https://localhost:8084/api/Commons/IsHeaderQRExist
//Handle 1:
export const checkHeaderQrExistence = async (
  docEntry,
  docNum,
  objType,
  series,
  branchID,
  itemCode,
  gateInNo
) => {
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  const requestBody = {
    branchID,
    docEntry,
    docNum,
    series,
    objType,
  };

  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsHeaderQRExist`,
      requestBody
    );
    const data = response.data;

    if (data.isExist === "Y") {
      // check if the details exists
      console.log("Headers data exists", data);
      const { qrCode } = data;
      const detailsExistance = await checkIfDetailsExists(
        branchID,
        docEntry,
        docNum,
        series,
        objType,
        itemCode,
        gateInNo,
        errors,
        qrCode
      );
      return detailsExistance;
    } else {
      console.log("Headers data doesnot exists", data);
    }
  } catch (error) {
    console.log("From CATCH");
    console.log(error);
  }
};

// HANDLE: 2
export const checkIfDetailsExists = async (
  branchID,
  docEntry,
  docNum,
  series,
  objType,
  itemCode,
  gateInNo,
  errors,
  qrCode
) => {
  const requestBody = {
    branchID,
    docEntry,
    docNum,
    series,
    objType,
    itemCode,
    gateInNo,
  };

  try {
    const response = await axios.post(
      `${API_URL}/Commons/IsDetailQRExist`,
      requestBody
    );
    const data = response.data;
    console.log("This exists", data);
    if (data.isExist == "Y") {
      return data;
    }
  } catch (error) {
    //get the items max inc number and then generate the ar code

    const { statusMsg, isExist } = error.response.data;
    if (isExist === "N") {
      console.log("The Qr For this items does not exist");
      const incrementNumForQrGenerator = await getItemsMaxIncNumber(qrCode);
      console.log(incrementNumForQrGenerator);
    }
  }
};

export const getItemsMaxIncNumber = async (headerQrString) => {
  try {
    const response = await axios.post(
      `${API_URL}/Commons/DetailIncNo?HeaderQR=${headerQrString}`
    );
    if (response.status === 200) {
      console.log("At Status");
      console.log(response.data);
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const mapDateToChars = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  // Pad single-digit month and day with a leading zero if needed
  month = month.length === 1 ? "0" + month : month;
  day = day.length === 1 ? "0" + day : day;

  const map1 = new Map([
    [0, "A"],
    [1, "B"],
    [2, "C"],
    [3, "D"],
    [4, "E"],
    [5, "F"],
    [6, "G"],
    [7, "H"],
    [8, "I"],
    [9, "J"],
  ]);

  // Map the year, month, and day according to the provided map
  const yy = map1.get(parseInt(year[0])) + map1.get(parseInt(year[1]));
  const MM = map1.get(parseInt(month[0])) + map1.get(parseInt(month[1]));
  const DD = map1.get(parseInt(day[0])) + map1.get(parseInt(day[1]));

  return { yy, MM, DD };
};

const qrStringGenerator = async () => {
  console.log(mapDateToChars);
};
