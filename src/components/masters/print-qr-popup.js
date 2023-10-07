import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "devextreme-react/button";
import { LoadPanel, Popup } from "devextreme-react";
const PrintQrPopUp = ({
  itemQrCode,
  handleClose,
  showPrintPop,
  selectedRowDetails,
}) => {
  console.log(selectedRowDetails);
  const [loading, setLoading] = useState(false);
  const [qrString, setQrstring] = useState(false);
  const [popUpVisibility, setPopUpVisibility] = useState(showPrintPop);

  const popCloser = async () => {
    await setPopUpVisibility(false);
    await handleClose();
  };
  useEffect(() => {}, []);
  return (
    <>
      {loading && <LoadPanel />}
      <Popup
        showTitle={false}
        visible={popUpVisibility}
        width={400}
        height={455}
      >
        <div className="content-wrapper responsive-paddings-sm">
          <div className="content__header">
            <div className="header---description">
              <span className="header__title">
                {selectedRowDetails.itemCode}
              </span>
              <span className="header__supporting--text">
                Click Print to get the Qr Code..{" "}
              </span>
            </div>
            <div className="header---closer">
              <Button icon="close" width={35} height={35} onClick={popCloser} />
            </div>
          </div>

          <div className="qr__displayer">
            <QRCode size={67} value={itemQrCode} viewBox={`0 0 150 150`} />
          </div>
          <div className="qr__string--displayer">
            {selectedRowDetails.itemCode}
          </div>
          <div
            className="print-qr-action-buttons"
            style={{ display: "flex", marginTop: "5rem" }}
          >
            <Button text="Print" width={150} height={38}></Button>
            <Button
              text="Print All"
              type={"default"}
              width={150}
              height={38}
            ></Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default PrintQrPopUp;
