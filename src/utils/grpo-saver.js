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

export const grpoSaveHandler = async (scannedItemsData) => {
  // const requestBody = {
  //   branchId: "1",
  //   headerQRCodeID: qrCode,
  //   detailQRCodeID: detailQRCodeID,
  // };
  // // console.log("This is request body", requestBody);
  // // return requestBody;
  // try {
  //   const response = await axios.post(
  //     `${API_URL}/DraftGRPO/ValidateItemQR`,
  //     requestBody
  //   );
  //   const data = response.data;
  //   // console.log(data);

  //   return data;
  // } catch (error) {
  //   console.error(error);
  //   const { statusCode, statusMsg } = error.response.data;
  //   return statusMsg;
  // }
  console.log(scannedItemsData);
};

const grpoDetailsConstructor = async (gridDataSource) => {
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
      const batchSerialData = groupedData
        .filter((item) => item.itemCode === group.itemCode)
        .map((item) => ({
          itemCode: item.itemCode,
          batchSerialNo: item.batchSerialNo,
          qty: item.qty,
        }));
      return {
        itemCode: group.itemCode,
        qty: group.qty,
        lineNum: groupedData.indexOf(group).toString(),
        itemMngBy: group.itemMngBy,
        grpoBatchSerial: batchSerialData,
      };
    });
  };

  const groupedData = await groupPayloadByItemCode(gridDataSource);
  const grpoDetData = await constructGrpoBatchSerial(groupedData);

  return {
    docEntry: 2686, // static value
    cardCode: "SP10450", // static value
    docDate: "2023-07-25T00:00:00", // static value
    comments: "", // static value
    grpoDet: grpoDetData,
  };
};

export const generateGrpo = async (gridDataSource) => {
  const structuredPayload = await grpoDetailsConstructor(gridDataSource);
  console.log(structuredPayload);
  if (structuredPayload) {
    try {
      const res = await axios.post(
        "https://localhost:5173/api/DraftGRPO/CreateDraftGRPO",
        structuredPayload
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
};
