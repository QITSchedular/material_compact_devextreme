import { Button, DataGrid, Popup, ScrollView, TextBox } from "devextreme-react";
import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../../components/typographyTexts/TypographyComponents";
import {
  getDetailDataProductionQR,
  qrGenerationController,
} from "../../../../api/production.generate.api";
import { toastDisplayer } from "../../../../api/qrgenerators";

const PopUpContent = ({ userSelectedRow, generatePopupCloser }) => {
  const [batches, setBatches] = useState("");
  const [remarks, setRemarks] = useState("");
  const [itemsQrDetailsDataSource, setItemsQrDetailsDataSource] = useState([]);
  const { qrMngBy, itemCode, receiptQty, plannedQty } = userSelectedRow;
  console.log("From the pop Content Handler", userSelectedRow);
  const dataGridColumns = [
    "headerQRCodeID",
    "detailQRCodeID",
    "itemCode",
    "qrMngBy",
    "qty",
    "remark",
    "batchSerialNo",
  ];
  const fetchDetailDataProductionQR = async () => {
    const apiRes = await getDetailDataProductionQR(userSelectedRow);
    if (apiRes.hasError) {
      setItemsQrDetailsDataSource([]);
      console.log(apiRes.errorMessage);
    }
    setItemsQrDetailsDataSource(apiRes.responseData);
  };

  const handleBatchesValueChange = (data) => {
    const { value } = data;
    if (value > parseInt(receiptQty)) {
      toastDisplayer("error", "Batch cannot be greater than Receipty");
      setBatches("");
    }
    setBatches(value);
  };
  const handleRemarksValueChange = (data) => {
    const { value } = data;
    return setRemarks(value);
  };
  const handleGenerateQr = async () => {
    console.log("generate");
    await qrGenerationController(userSelectedRow, batches);
  };

  useEffect(() => {
    async function detailDataProductionQRFetcher() {
      await fetchDetailDataProductionQR();
    }
    detailDataProductionQRFetcher();
  }, []);
  return (
    <ScrollView height={"100%"}>
      <div
        className="generate-receipt-qr-popup-content-wrapper responsive-paddings"
        style={{ height: "100% !important" }}
      >
        <div
          className="title-section "
          style={{
            padding: "5px 20px !important",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <PopupHeaderText text={"Click Generate to generate the qr"} />
          <PopupSubText
            text={"Scroll through the list or type in the search box.."}
          />
          <div
            className="info-displayer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginTop: "1rem",
              padding: "10px 8px",
              border: "0.5px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <span>
              <strong>Item Code:</strong> {itemCode}
            </span>
            <span>
              <strong>Planned Quantity:</strong> {plannedQty}
            </span>
            <span>
              {" "}
              <strong>Receipt Quantity:</strong> {receiptQty}
            </span>
          </div>
          <PopupSubText text={`Qr Is Managed By: ${qrMngBy}`} />
        </div>
        <div className="main-section" style={{ marginBottom: "18px" }}>
          <div
            className="dx-field"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              paddingTop: "10px",
              paddingBottom: "10px",
              gap: "15px",
              width: "100%",
            }}
          >
            <TextBox
              stylingMode="outlined"
              mode="number"
              placeholder="No. of Batches"
              label="No. of Batches"
              width={"100%"}
              disabled={qrMngBy === "B" ? false : true}
              onValueChanged={handleBatchesValueChange}
            ></TextBox>
            <TextBox
              stylingMode="outlined"
              placeholder="Remarks"
              label="Remarks"
              width={"100%"}
              onValueChanged={handleRemarksValueChange}
            ></TextBox>
          </div>
        </div>
        <div
          className="action-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            className="close"
            icon="close"
            text="Cancel"
            width={120}
            height={35}
            onClick={() => generatePopupCloser()}
          />
          <Button
            className="generate-button"
            type="default"
            icon="fa fa-qrcode"
            text="Generate"
            width={150}
            height={35}
            onClick={handleGenerateQr}
            disabled={itemsQrDetailsDataSource ? true : false}
          />
        </div>
        {itemsQrDetailsDataSource && (
          <div className="production-items-datagrid-wrapper">
            <hr />
            <DataGrid
              className="transporter-data-grid draft-receipt-po-datagrid-container"
              height={250}
              dataSource={itemsQrDetailsDataSource}
              keyExpr={"detailQRCodeID"}
              showBorders={true}
              columnAutoWidth={true}
              hoverStateEnabled={true}
              columns={dataGridColumns}
            ></DataGrid>
          </div>
        )}
      </div>
    </ScrollView>
  );
};
const GenerateqrPopup = ({ generatePopupCloser, userSelectedRow }) => {
  return (
    <div>
      {" "}
      <Popup
        visible={true}
        showTitle={false}
        minWidth={350}
        maxWidth={600}
        height={"80%"}
        className="generate-receipt-pro-popup"
        hideOnOutsideClick={generatePopupCloser}
        contentRender={() => (
          <PopUpContent
            userSelectedRow={userSelectedRow}
            generatePopupCloser={generatePopupCloser}
          />
        )}
      ></Popup>
    </div>
  );
};

export default GenerateqrPopup;
