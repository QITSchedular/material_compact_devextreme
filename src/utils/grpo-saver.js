import axios from "axios";
import { API_URL } from "./items-master-data";

export const ValidateItemQR = async (qrCode, detailQRCodeID) => {
  const requestBody = {
    branchId: "1",
    headerQRCodeID: qrCode,
    detailQRCodeID: detailQRCodeID,
  };
  // console.log("This is request body", requestBody);
  // return requestBody;
  try {
    const response = await axios.post(
      `${API_URL}/DraftGRPO/ValidateItemQR`,
      requestBody
    );
    const data = response.data;
    // console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    const { statusCode, statusMsg } = error.response.data;
    return statusMsg;
  }
};

const grpoDetailsConstructor = async (
  gridDataSource,
  comments,
  choosenWarehouseName
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
    return groupedData.map((group) => {
      const grpoBatchSerialData = gridDataSource
        .filter((item) => item.itemCode === group.itemCode)
        .map((item) => ({
          gateInNo: `${item.gateInNo}`,
          itemCode: item.itemCode,
          detailQRCodeID: item.detailQRCodeID,
          batchSerialNo: item.batchSerialNo,
          qty: `${item.qty}`,
        }));
      return {
        itemCode: group.itemCode,
        lineNum: `${group.lineNum}`,
        uomCode: `${group.uoMCode}`,
        fromWhs: `${group.whsCode}`,
        toWhs: `${choosenWarehouseName}`,
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
    docEntry: headerItem.docEntry,
    docNum: headerItem.docNum,
    cardCode: headerItem.cardCode,
    docDate: headerItem.docDate,
    comments: comments,
    whsCode: choosenWarehouseName,
    grpoDet: grpoDetData,
  };
};

export const generateGrpo = async (
  gridDataSource,
  comments,
  choosenWarehouseName
) => {
  console.log("This is the grid data source", gridDataSource);
  const structuredPayload = await grpoDetailsConstructor(
    gridDataSource,
    comments,
    choosenWarehouseName
  );
  console.log("This is the structuredPayload", structuredPayload);
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
      console.log(error);
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
    console.log(error);
    const returnError = error.response.data;
    return returnError;
  }
};



export const ValidateItemQR1 = async (qrCode, detailQRCodeID, docEntry) => {
  const requestBody = {
    "branchID": 1,
    "headerQRCodeID": qrCode,
    "detailQRCodeID": detailQRCodeID,
    "grpoDocEntry": docEntry
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
    console.error(error);
    const { statusCode, statusMsg } = error.response.data;
    return statusMsg;
  }
};
