import React, { useEffect } from 'react';
import { Popup } from 'devextreme-react/popup';
import { useQRCodeScan } from './useQRCodeScan';
import debounce from 'lodash/debounce';
import './qrScanner.scss'
const TransparentPopup = ({ visible, mountNodeId }) => {
  const { startQrCode, stopQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: mountNodeId,
  });

   const debouncedStartQrCode = debounce(startQrCode, 5);
  useEffect(() => {
    debouncedStartQrCode();
  }, []);
  const scannerCloser = ()=>{
    return stopQrCode();
  }

  return (
    <Popup
    width={"99%"}
    height={"99%"}
    visible={true}
  hideOnOutsideClick={true}
  showCloseButton={false}
  showTitle={false}
  title="Qr Scanner"
  
  className="popup-container" // Apply a custom CSS class to the Popup
>
  {/* Container for QR scanner */}
  <div className="scanner-container">
    {mountNodeId && <div id={mountNodeId} > </div>}
  </div>

  {/* Container for buttons */}
  <div className="button-container">
  <button className="popup-button btn-danger" onClick={scannerCloser}> Close</button>
    <button className="popup-button" onClick={()=>debouncedStartQrCode()}>Start</button>
    {decodedQRData && <span><strong>{decodedQRData.data}</strong></span>}
  </div>
</Popup>

  );
};

export default TransparentPopup;
