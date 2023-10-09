import axios from "axios";
import { API_URL } from "./items-master-data";

// export const ValidateItemQR = async (qrCode, detailQRCodeID) => {
//   const requestBody = {
//     branchId: "1",
//     headerQRCodeID: qrCode,
//     detailQRCodeID: detailQRCodeID,
//   };
//   // console.log("This is request body", requestBody);
//   // return requestBody;
//   try {
//     const response = await axios.post(
//       `${API_URL}/DraftGRPO/ValidateItemQR`,
//       requestBody
//     );
//     const data = response.data;
//     // console.log(data);

//     return data;
//   } catch (error) {
//     console.error(error);
//     const { statusCode, statusMsg } = error.data;
//     return statusMsg;
//   }
// };

export const ValidateItemQR = async (qrCode, detailQRCodeID) => {
  const requestBody = {
    branchId: "1",
    headerQRCodeID: qrCode,
    detailQRCodeID: detailQRCodeID,
  };
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  // console.log("This is request body", requestBody);
  // return requestBody;
  try {
    const response = await axios.post(
      `${API_URL}/DraftGRPO/ValidateItemQR`,
      requestBody
    );
    responseBody.responseData = response.data;
    const data = response.data;
    // console.log(data);

    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = error.response.data;
    // console.error(error);
    const { statusCode, statusMsg } = error.response.data;
    return responseBody;
  }
};

const grpoDetailsConstructor = async (
  gridDataSource,
  comments,
  choosenWarehouseName,
  series,
  numAtCard,
  defaultChoosenQcWareHouse,
  choosenQcWareHouseBinData,
  defaultChoosenNonQcWareHouse,
  choosenNonQcWareHouseBinData
) => {
  const groupPayloadByItemCode = async (gridDataSource) => {
    const groupedData = await gridDataSource.reduce((acc, item) => {
      const existingItem = acc.find(
        (group) => group.itemCode === item.itemCode
      );
      if (existingItem) {
        existingItem.qty = (
          parseFloat(existingItem.qty) + parseFloat(item.qty)
        ).toString();
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
    return groupedData;
  };

  const constructGrpoBatchSerial = async (groupedData) => {
    console.log("This is grouped data:", groupedData);
    return groupedData.map((group) => {
      const grpoBatchSerialData = gridDataSource
        .filter((item) => item.itemCode === group.itemCode)
        .map((item) => ({
          gateInNo: `${item.gateInNo}`,
          gateInDate: `${
            new Date(item.gateInDate).toISOString().split("T")[0]
          }`,
          itemCode: item.itemCode,
          detailQRCodeID: item.detailQRCodeID,
          batchSerialNo: item.batchSerialNo,
          project: item.project,
          qty: `${item.qty}`,
        }));
      return {
        itemCode: group.itemCode,
        lineNum: `${group.lineNum}`,
        qaRequired: `${group.qaRequired}`,
        uomCode: `${group.uoMCode}`,
        fromWhs: `${group.whsCode}`,
        itemMngBy: group.itemMngBy,
        qty: `${group.qty}`,
        grpoBatchSerial: grpoBatchSerialData,
      };
    });
  };

  const groupedData = await groupPayloadByItemCode(gridDataSource);
  const grpoDetData = await constructGrpoBatchSerial(groupedData);

  const headerItem = gridDataSource[0]; // Assuming gridDataSource has at least one element
  return {
    branchId: "1",
    series,
    docEntry: headerItem.docEntry,
    docNum: headerItem.docNum,
    cardCode: headerItem.cardCode,
    docDate: headerItem.docDate,
    comments: comments,
    numAtCard,
    qaWhsCode: defaultChoosenQcWareHouse[0].whsCode,
    qaBinAbsEntry: choosenQcWareHouseBinData
      ? choosenQcWareHouseBinData.absEntry
      : 0,
    nonQAWhsCode: defaultChoosenNonQcWareHouse[0].whsCode,
    nonQABinAbsEntry: choosenNonQcWareHouseBinData
      ? choosenNonQcWareHouseBinData.absEntry
      : "",
    grpoDet: grpoDetData,
  };
};

export const generateGrpo = async (
  gridDataSource,
  comments,
  choosenWarehouseName,
  series,
  numAtCard,
  defaultChoosenQcWareHouse,
  choosenQcWareHouseBinData,
  defaultChoosenNonQcWareHouse,
  choosenNonQcWareHouseBinData
) => {
  // console.log("This is the grid data source", gridDataSource);
  console.log("Payload for grpo saver");
  console.log("gridDataSource", gridDataSource);
  console.log("comments", comments);
  console.log("choosenWarehouseName", choosenWarehouseName);
  console.log("series", series);
  console.log("numAtCard", numAtCard);
  console.log("defaultChoosenQcWareHouse", defaultChoosenQcWareHouse);
  console.log("choosenQcWareHouseBinData", choosenQcWareHouseBinData);
  console.log("defaultChoosenNonQcWareHouse", defaultChoosenNonQcWareHouse);
  console.log("choosenNonQcWareHouseBinData", choosenNonQcWareHouseBinData);

  const structuredPayload = await grpoDetailsConstructor(
    gridDataSource,
    comments,
    choosenWarehouseName,
    series,
    numAtCard,
    defaultChoosenQcWareHouse,
    choosenQcWareHouseBinData,
    defaultChoosenNonQcWareHouse,
    choosenNonQcWareHouseBinData
  );
  // console.log("This is the structuredPayload", structuredPayload);
  console.log(JSON.stringify(structuredPayload));
  if (structuredPayload) {
    try {
      const res = await axios.post(
        `${API_URL}/DraftGRPO/CreateDraftGRPO`,
        structuredPayload
      );
      const returnData = await res.data;
      return returnData;
    } catch (error) {
      // console.log(error);
      const returnError = error.response.data;
      return returnError;
    }
  }
};

export const wareHouseList = async () => {
  try {
    const res = await axios.get(`${API_URL}/Warehouses/Get?Filter=N`);
    const returnData = await res.data;
    return returnData;
  } catch (error) {
    // console.log(error);
    const returnError = error.response.data;
    return returnError;
  }
};
export const binLocationController = async (payload) => {
  console.log("Payload from binLocationController", payload);
  const { whsCode } = payload;

  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.get(
      `${API_URL}/Commons/BinLocation?WhsCode=${whsCode}`
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

export const ValidateItemQR1 = async (qrCode, detailQRCodeID, docEntry) => {
  const requestBody = {
    branchID: 1,
    headerQRCodeID: qrCode,
    detailQRCodeID: detailQRCodeID,
    grpoDocEntry: docEntry,
  };
  const errors = {
    hasError: false,
    errorText: "Something went wrong",
  };
  // return requestBody;
  try {
    const response = await axios.post(
      `${API_URL}/IncomingQC/ValidateItem`,
      requestBody
    );
    const data = response.data;

    return data;
  } catch (error) {
    const statusMsg = error.message;
    if (statusMsg) {
      errors.hasError = true;
      errors.errorText = statusMsg;
      return errors;
    }
    return errors;
  }
};
