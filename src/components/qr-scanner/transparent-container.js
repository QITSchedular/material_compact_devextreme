import React, { useEffect } from "react";
import { useQRCodeScan } from "../../utils/useQRCodeScan";

import debounce from "lodash/debounce";
import "./qrscannerstyle.scss";
import { Button } from "devextreme-react";
const TransparentContainer = ({
  mountNodeId,
  showScanner,
  HandleCloseQrScanner1,
  HandleCloseQrScanner,
  HandleDecodedData,
  scannerScannedData,
  HandleSaveDecodedData
}) => {
  const { startQrCode, stopQrCode, decodedQRData , } = useQRCodeScan({
    qrcodeMountNodeID: mountNodeId,
  });

  const debouncedStartQrCode = debounce(startQrCode, 5);
  useEffect(() => {
    debouncedStartQrCode();
  }, []);
  const scannerCloser = () => {
    return stopQrCode();
  };
  const scannerCloser1 = () => {
    return HandleCloseQrScanner1();
  };

  // useEffect(()=>{
  //   const HandleDecodedData1 = (data)=>{
  //     return HandleDecodedData(data);
  //   }
  //   if(decodedQRData.data!=null){
  //     HandleDecodedData1(decodedQRData.data);
  //   }
  // },[decodedQRData])

  useEffect(()=>{
    if(decodedQRData.data){
      scannerScannedData(decodedQRData);
      return HandleCloseQrScanner();
    }
  },[decodedQRData])


  return (
    <div className={`expanded-div ${showScanner ? "expanded" : ""}`}>
      {mountNodeId && (
        <>
          <div id={mountNodeId} className="scanner-container-fullscreen"></div>
          <div className="scan"></div>
          <div className="button-container">
         
            <Button
              className="popup-button"
              type="danger"
              icon="back"
              text={"Cancel"}
              width={100}
              onClick={scannerCloser1}
            ></Button>
            <Button
              className="popup-button"
              type="default"
              icon="refresh"
              text="Save"
              width={100}
              // onClick={() => debouncedStartQrCode()}
              onClick={HandleSaveDecodedData}
            ></Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransparentContainer;
