import React, { useEffect, useState } from "react";
import Multiviewdisplayer from "../../../purchases/gate-in/print-qr/multiview-qr-displayer";
import { LoadPanel, Popup } from "devextreme-react";

const GenerateReceiptqrDisplayer = ({
  displayQrDataSoruce,
  displayQrCloser,
}) => {
  console.log("GenerateReceiptqrDisplayer", displayQrDataSoruce);
  const [loading, setLoading] = useState(false);
  const [displayMultiViewer, setDisplayMultiViewer] = useState(false);
  const [multipleQrCodes, setMultipleQrCodes] = useState([]);
  const handleClose = async () => {
    setDisplayMultiViewer(false);
    displayQrCloser();
  };

  useEffect(() => {
    setLoading(true);
    if (displayQrDataSoruce.length > 0) {
      setLoading(false);
      return setDisplayMultiViewer(true);
    }
    setLoading(false);
    setDisplayMultiViewer(false);
  }, []);
  return (
    <>
      {loading && <LoadPanel />}
      <Popup showTitle={false} visible={true} width={400} height={353}>
        <Multiviewdisplayer
          handleClose={handleClose}
          multipleQrCodes={displayQrDataSoruce}
        />
      </Popup>

      {/* {!displayMultiViewer ? (
        <>
          {loading && <LoadPanel />}
          <Popup showTitle={false} visible={true} width={400} height={353}>
            <SingleQrDisplayer
              handleClose={handleClose}
              itemQrCode={itemQrCode}
            />
          </Popup>
        </>
      ) : (
        <Popup showTitle={false} visible={true} width={400} height={353}>
          <Multiviewdisplayer
            handleClose={handleClose}
            multipleQrCodes={multipleQrCodes}
          />
        </Popup>
      )} */}
    </>
  );
};

export default GenerateReceiptqrDisplayer;
