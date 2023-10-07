import { LoadPanel, Popup } from "devextreme-react";
import React, { useEffect, useState } from "react";
// import QRCode from "react-qr-code";
// import { Button } from "devextreme-react/button";
import "./qr-displayer-styles.scss";
import SingleQrDisplayer from "./single-qr-displayer";

import Multiviewdisplayer from "./multiview-qr-displayer";

const ItemsQrDisplayer = ({
  itemQrCode,
  handleQrPopUpClose,
  displayerFlag,
}) => {
  console.log("this is the displayerFlag", itemQrCode);
  const [loading, setLoading] = useState(false);
  const [displayMultiViewer, setDisplayMultiViewer] = useState(false);
  const [multipleQrCodes, setMultipleQrCodes] = useState([]);
  // close the popup window
  const handleClose = async () => {
    await handleQrPopUpClose();
  };
  useEffect(() => {
    setLoading(true);
    if (itemQrCode.length > 0) {
      setLoading(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function checkSetDetails() {
      if (displayerFlag !== "N") {
        setLoading(true);
        console.log("Yes show the player");
        await setMultipleQrCodes(itemQrCode);
        setDisplayMultiViewer(true);
        setLoading(false);
      }
    }
    checkSetDetails();
  });
  return (
    <>
      {!displayMultiViewer ? (
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
      )}
    </>
  );
};

export default ItemsQrDisplayer;
