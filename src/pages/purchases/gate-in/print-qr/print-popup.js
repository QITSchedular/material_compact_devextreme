import React, { useContext, useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { AppContext } from "../../../../contexts/dataContext";
import "./printqr-styles.scss";
import { checkHeaderQrExistence } from "../../../../utils/qr-generation";
import QRCode from "react-qr-code";

const VisibleQr = ({ value }) => {
  return (
    <>
      {value && (
        <div
          style={{
            height: "auto",
            margin: "0 auto",
            maxWidth: 64,
            width: "100%",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={value}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
    </>
  );
};
const renderContent = ({
  qrVisibilityHandler,
  selectedQrRowData,
  poDetailsfull,
  seriesList,
}) => {
  // console.log(seriesList[0]);
  console.log(selectedQrRowData);

  const handleCancel = async () => {
    await qrVisibilityHandler(false);
  };
  const handleGenerateQr = async () => {
    const { docEntry, docNum, objType } = poDetailsfull[0];
    const { series } = seriesList[0];
    const { gateInNo, itemCode } = selectedQrRowData;
    const branchID = "1";

    // manaual branch id, it should be dynamically generated
    const resp = await checkHeaderQrExistence(
      docEntry,
      docNum,
      objType,
      series,
      branchID,
      itemCode,
      gateInNo
    );
    const { qrCode } = resp;
  };
  return (
    <div className="responsive-paddings">
      <div className="main-section">
        <div
          className="dx-field"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <TextBox
            stylingMode="outlined"
            width={200}
            showClearButton={true}
            placeholder="No. of Batches"
            label="No. of Batches"
          />
          <TextBox
            stylingMode="outlined"
            width={400}
            showClearButton={true}
            placeholder="Add Remarks"
            label="Add Remarks"
          />
        </div>
      </div>
      <div className="action-section" style={{ paddingTop: "1rem" }}>
        <Button
          className="generate-button"
          type="default"
          icon="fa fa-qrcode"
          text="Generate Qr"
          width={150}
          height={35}
          onClick={handleGenerateQr}
        />
        <Button
          className="close"
          icon="close"
          text="Close"
          width={100}
          height={35}
          onClick={handleCancel}
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
  return (
    <>
      <div className="print-qr-popup">
        <Popup
          showTitle={true}
          visible={true}
          width={720}
          height={200}
          titleRender={() => renderTitle({ selectedQrRowData })}
          contentRender={() =>
            renderContent({
              qrVisibilityHandler,
              selectedQrRowData,
              poDetailsfull,
              seriesList,
            })
          }
        ></Popup>
        {/* ... */}
      </div>
    </>
  );
};

export default PrintPopup;
