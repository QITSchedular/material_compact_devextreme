import React, { useEffect, useState } from "react";
import { useQRCodeScan } from "../../utils/useQRCodeScan";

import debounce from "lodash/debounce";
import "./qrscannerstyle.scss";
import { Button } from "devextreme-react";
const TransparentContainer = ({
  mountNodeId,
  showScanner,
  HandleCloseQrScanner1,
  HandleDecodedData,
  HandleSaveDecodedData
}) => {
  const { startQrCode, stopQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: mountNodeId,
  });
  const [qrScannerStyle,setqrScannerStyle] = useState(false);

  const startQrCode_debounce = ()=>{
      setqrScannerStyle(true);
  }
  const debouncedStartQrCode = debounce(startQrCode, 5);
  const showqrstyle = debounce(startQrCode_debounce,1100);
  useEffect(() => {
    debouncedStartQrCode();
    showqrstyle();
  }, []);
  const scannerCloser = () => {
    return stopQrCode();
  };
  const scannerCloser1 = () => {
    return HandleCloseQrScanner1();
  };

  useEffect(()=>{
    const HandleDecodedData1 = (data)=>{
      return HandleDecodedData(data);
    }
    if(decodedQRData.data!=null){
      HandleDecodedData1(decodedQRData.data);
    }
  },[decodedQRData])

 

  return (
    <div className={`expanded-div ${showScanner ? "expanded" : ""}`}>
      {mountNodeId && (
        <>
          <div id={mountNodeId} className="scanner-container-fullscreen"></div>
          {qrScannerStyle?<div className="scan"></div>:""}
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
