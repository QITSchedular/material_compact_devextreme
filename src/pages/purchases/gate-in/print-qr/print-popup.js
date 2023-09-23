import React, { useContext, useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { AppContext } from "../../../../contexts/dataContext";
import "./printqr-styles.scss";
import {
  checkHeaderQrExistence,
  qrGenerationHandler,
} from "../../../../utils/qr-generation";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import Lottie from "../../../../assets/images/success-lottiie-2.gif";
import { RequiredRule } from "devextreme-react/validator";
import { toastDisplayer } from "../../../../api/qrgenerators";

import { qrGenerationController2 } from "../../../../api/purchases.generateandprint.api";

const renderSuccessContent = ({ qrVisibilityHandler, onQrGenerated }) => {
  const handleCancel = async () => {
    await onQrGenerated(false);
    await qrVisibilityHandler(false);
  };
  return (
    <div
      className="lottie-conatiner"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 15px",
        marginTop: "auto",
        gap: "5rem",
      }}
    >
      <Button icon="close" onClick={handleCancel} />
      <img
        src={Lottie}
        alt="qr-generated"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          marginTop: "auto",
        }}
      />
    </div>
  );
};

const renderContent = ({
  qrVisibilityHandler,
  selectedQrRowData,
  poDetailsfull,
  seriesList,
  onQrGenerated,
}) => {
  var addedRemarks = "";
  var addedBatchNum = "";
  var addedProjectCode = "";
  var { qty, openQty } = selectedQrRowData;
  const handleCancel = async () => {
    await qrVisibilityHandler(false);
  };
  const handleRemarksValueChanged = async (data) => {
    console.log(data);
    addedRemarks = data;
    return addedRemarks;
  };

  const handleBatchesValueChange = async (data) => {
    const { qty } = selectedQrRowData;
    if (data > qty) {
      console.log("Data is greater than or equal to");
    }
    addedBatchNum = await addBatchNumber(data);
    console.log(addedBatchNum);
    return addedBatchNum;
  };

  const addBatchNumber = async (totalBatches) => {
    const newBatchNum = totalBatches;
    return newBatchNum;
  };
  const handleGenerateQr = async () => {
    const { docEntry, docNum, objType } = poDetailsfull[0];
    const { series } = seriesList[0];
    const { gateInNo, itemCode, qrMngBy, qty, openQty } = selectedQrRowData;
    console.log("This is selected row data", selectedQrRowData);
    const branchID = "1";
    // manaual branch id, it should be dynamically generated
    const testNewApi = await qrGenerationController2(
      docEntry,
      docNum,
      objType,
      series,
      branchID,
      itemCode,
      gateInNo,
      poDetailsfull,
      qrMngBy,
      openQty,
      addedRemarks,
      addedBatchNum
    );
    console.log(testNewApi);
    // if (resp === "Qr Generated") {
    //   return onQrGenerated(true);
    // }
    // if (resp === "Detail Qr already-generated") {
    //   return handleCancel();
    // }
    // if (resp === "Error: Failed to generate") {
    //   await toastDisplayer("error", "Error: Failed to generate the QrCode");
    // }

    // const resp = await qrGenerationHandler(
    //   docEntry,
    //   docNum,
    //   objType,
    //   series,
    //   branchID,
    //   itemCode,
    //   gateInNo,
    //   poDetailsfull,
    //   qrMngBy,
    //   openQty,
    //   addedRemarks,
    //   addedBatchNum
    // );

    // // const { qrCode } = resp;x
  };

  return (
    <div className="responsive-paddings">
      <div className="title-section" style={{ marginBottom: "1rem" }}>
        <div className="title__texts">
          <h3
            style={{
              color: "color: #161616",
              fontFamily: "Roboto",
              fontSize: "18px",
              fontWeight: "600",
              marginTop: "0px",
              marginBottom: "0px",
            }}
          >
            Item Code 42251
          </h3>
          <span
            style={{
              color: "#525252",
              fontFamily: "Roboto",
              fontSize: "14px",
            }}
          >
            Did you go through the items details?
          </span>
        </div>
        <div className="title__cancel"></div>
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
          }}
        >
          <TextBox
            stylingMode="outlined"
            mode="number"
            width={336}
            height={48}
            showClearButton={true}
            placeholder="No. of Batches"
            label="No. of Batches"
            style={{
              marginBottom: "10px",
            }}
            disabled={selectedQrRowData.qrMngBy === "B" ? false : true}
            onValueChange={handleBatchesValueChange}
          ></TextBox>
          <TextBox
            stylingMode="outlined"
            width={336}
            height={48}
            showClearButton={true}
            placeholder="Project Code"
            label="Project Code"
            style={{
              margin: "10px auto",
            }}
            disabled={selectedQrRowData.qrMngBy !== "B" ? false : true}
            value={
              selectedQrRowData.project ? selectedQrRowData.project : "None"
            }
          />
          <TextBox
            stylingMode="outlined"
            width={336}
            height={48}
            showClearButton={true}
            placeholder="Add Remarks"
            label="Add Remarks"
            style={{
              margin: "10px auto",
            }}
            onValueChange={handleRemarksValueChanged}
          />
        </div>
      </div>
      <div
        className="summary-section"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <div
          className="summary_header"
          style={{
            color: "393939",
            fontFamily: "Roboto",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Summary
        </div>
        <div className="summary_details">
          <div
            className="order__qty--sec"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0 20px 0",
            }}
          >
            <span
              style={{
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Ordered Qty.
            </span>
            <span
              style={{
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              {qty}
            </span>
          </div>
          <div
            className="rec__qty--sec"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span
              style={{
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Recieved Qty.
            </span>
            <span
              style={{
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              {openQty}
            </span>
          </div>
        </div>
      </div>
      <div
        className="action-section"
        style={{
          paddingTop: "5rem",
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
          onClick={handleCancel}
        />
        <Button
          className="generate-button"
          type="default"
          icon="fa fa-qrcode"
          text="Generate"
          width={150}
          height={35}
          onClick={handleGenerateQr}
        />
      </div>
    </div>
  );
};

const renderTitle = ({ selectedQrRowData }) => {
  return (
    <div
      className="dx-flexbox"
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "16px",
      }}
    >
      <div>ItemCode: {selectedQrRowData.itemCode}</div>
      <div>Recieved Qty: {selectedQrRowData.qty}</div>
    </div>
  );
};

const PrintPopup = ({
  qrVisibilityHandler,
  selectedQrRowData,
  poDetailsfull,
  seriesList,
}) => {
  // const { isQrPopupVisible, openQrPopUp, closeQrPopUp } =
  //   useContext(AppContext);
  const [qrGenerated, setQrGenerated] = useState(false);
  const handleQrGenerated = (isGenerated) => {
    setQrGenerated(isGenerated);
  };
  return (
    <>
      <div className="print-qr-popup">
        <Popup
          showTitle={false}
          visible={true}
          width={400}
          height={595}
          titleRender={() => renderTitle({ selectedQrRowData })}
          contentRender={() =>
            qrGenerated
              ? renderSuccessContent({
                  qrVisibilityHandler,
                  onQrGenerated: handleQrGenerated,
                })
              : renderContent({
                  qrVisibilityHandler,
                  selectedQrRowData,
                  poDetailsfull,
                  seriesList,
                  onQrGenerated: handleQrGenerated,
                })
          }
        ></Popup>
        {/* ... */}
      </div>
    </>
  );
};

export default PrintPopup;
