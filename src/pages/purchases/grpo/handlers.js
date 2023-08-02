export const mapToRequestBody = (data) => {
  return data.map((item) => {
    return {
      docEntry: item.docEntry,
      cardCode: item.cardCode,
      docDate: item.docDate,
      comments: "",
      grpoDet: [
        {
          itemCode: item.itemCode,
          lineNum: item.lineNum.toString(),
          itemMngBy: item.itemMngBy,
          qty: item.qty,
          grpoBatchSerial: [
            {
              itemCode: item.itemCode,
              batchSerialNo: item.batchSerialNo,
              qty: item.recQty,
            },
          ],
        },
      ],
    };
  });
};

export const verifyScanneditemQr = (headersQr, itemQr) => {
  // chck if the items qr exists
  // if yes construct the request body, fetch data and return to the grid
  const requestBody = mapToRequestBody(singleItemData);
  // if no throw error and
};
