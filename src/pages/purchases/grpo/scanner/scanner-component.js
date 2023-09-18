// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect } from "react";

// const qrcodeRegionId = "html5qr-code-full-region";

// // Creates the configuration object for Html5QrcodeScanner.
// const createConfig = (props) => {
//   // fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult}
//   let config = {};
//   if (props.fps) {
//     config.fps = props.fps;
//   }
//   if (props.qrbox) {
//     config.qrbox = props.qrbox;
//   }
//   if (props.aspectRatio) {
//     config.aspectRatio = props.aspectRatio;
//   }
//   if (props.disableFlip !== undefined) {
//     config.disableFlip = props.disableFlip;
//   }
//   return config;
// };

// //

// const Html5QrcodePlugin = (props) => {
//   // fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult}

//   useEffect(() => {
//     // when component mounts
//     const config = createConfig(props);
//     const verbose = props.verbose === true;
//     // Suceess callback is required.
//     if (!props.qrCodeSuccessCallback) {
//       throw "qrCodeSuccessCallback is required callback.";
//     }
//     const html5QrcodeScanner = new Html5QrcodeScanner(
//       qrcodeRegionId,
//       config,
//       verbose
//     );
//     html5QrcodeScanner.render(
//       props.qrCodeSuccessCallback,
//       props.qrCodeErrorCallback
//     );

//     // cleanup function when component will unmount
//     return () => {
//       html5QrcodeScanner.clear().catch((error) => {
//         console.error("Failed to clear html5QrcodeScanner. ", error);
//       });
//     };
//   }, []);

//   return <div id={qrcodeRegionId} />;
// };

// export default Html5QrcodePlugin;


import React, { useEffect,  useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CustomQrCodeScannerWithButton1 = ({qrCodeSuccessCallback}) => {
  const [scannedQRCode, setScannedQRCode] = useState(null);
  useEffect(() => {
    function onScanSuccess(decodedText, decodedResult) {
        html5QrcodeScanner.clear();
        setScannedQRCode(decodedText);
        return qrCodeSuccessCallback(decodedText);
        // return qrCodeSuccessCallback("decodedText");
    }
    function onScanError(errorMessage) {
        // handle on error condition, with error message
    }
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess, onScanError);
  }, []);

  return (
    <div>
      {scannedQRCode ? 
        <div>
          <p>Scanned QR Code: {scannedQRCode}</p>
        </div>
       : 
        <div id="reader" />
      }
    </div>
  );
};

export default CustomQrCodeScannerWithButton1;
