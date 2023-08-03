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

const grpoDetailsConstructor = async (gridDataSource, comments) => {
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
          itemCode: item.itemCode,
          batchSerialNo: item.batchSerialNo,
          qty: `${item.qty}`,
        }));
      return {
        itemCode: group.itemCode,
        lineNum: `${group.lineNum}`,
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
    docEntry: headerItem.docEntry,
    cardCode: headerItem.cardCode,
    docDate: headerItem.docDate,
    comments: comments,
    grpoDet: grpoDetData,
  };
};

export const generateGrpo = async (gridDataSource, comments) => {
  const structuredPayload = await grpoDetailsConstructor(
    gridDataSource,
    comments
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
