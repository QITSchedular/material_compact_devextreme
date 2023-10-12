import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "devextreme-react/button";
import { LoadPanel } from "devextreme-react";
const SingleQrDisplayer = ({ itemQrCode, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [qrString, setQrstring] = useState(false);

  const popCloser = async () => {
    await handleClose();
  };
  useEffect(() => {
    setLoading(true);
    if (itemQrCode.length > 0) {
      setQrstring(itemQrCode[0].headerQRCodeID);
      setLoading(false);
    }
    setLoading(false);
  }, []);
  return (
    <>
      {loading && <LoadPanel />}
      <div className="content-wrapper responsive-paddings-sm">
        <div className="content__header">
          <div className="header---description">
            <span className="header__title">Scan The Qr Code</span>
            <span className="header__supporting--text">
              Place the scanner on qr code to detect{" "}
            </span>
          </div>
          <div className="header---closer">
            <Button icon="close" width={35} height={35} onClick={popCloser} />
          </div>
        </div>

        <div className="qr__displayer">
          <QRCode size={67} value={qrString} viewBox={`0 0 150 150`} />
        </div>
        <div className="qr__string--displayer">{qrString}</div>
      </div>
    </>
  );
};

export default SingleQrDisplayer;
