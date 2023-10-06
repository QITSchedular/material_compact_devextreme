import React, { useEffect, useState } from "react";
import MultiView from "devextreme-react/multi-view";
import QRCode from "react-qr-code";
import { Button } from "devextreme-react/button";
import "./qr-displayer-styles.scss";
const QrViewBox = ({ data, handleClose }) => {
  console.log("From QR VIEW bOX", handleClose);
  const company = data;

  const [qrData, setQrData] = useState([]);
  useEffect(() => {
    async function setDisplayer() {
      setQrData(data);
    }
    setDisplayer();
  }, []);
  const handlePopupClose = () => {
    return handleClose();
  };
  return (
    <div className="content-wrapper responsive-paddings-sm">
      <div className="content__header">
        <div className="header---description">
          <span className="header__title">Scan The Qr Code</span>
          <span className="header__supporting--text">
            Place the scanner on qr code to detect{" "}
          </span>
        </div>
      </div>

      <div className="qr__displayer">
        <QRCode
          size={67}
          value={data.data.detailQRCodeID}
          viewBox={`0 0 150 150`}
        />
      </div>
      <div className="qr__string--displayer">{data.data.detailQRCodeID}</div>
    </div>
  );
};

const Multiviewdisplayer = ({ handleClose, multipleQrCodes }) => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [loop, setLoop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelectionChanged = (args) => {
    if (args.name === "selectedIndex") {
      setSelectedIndex(args.value);
    }
  };

  const onLoopChanged = (args) => {
    setLoop(args.value);
  };

  const onAnimationEnabledChanged = (args) => {
    setAnimationEnabled(args.value);
  };

  const handlePrevView = () => {
    console.log("Click");
    const prevIndex = selectedIndex - 1;
    if (prevIndex >= 0) {
      setSelectedIndex(prevIndex);
    }
  };

  const handleNextView = () => {
    const nextIndex = selectedIndex + 1;
    if (nextIndex < multipleQrCodes.length) {
      setSelectedIndex(nextIndex);
    }
  };
  useEffect(() => {
    console.log("You are at multividimensional");
  }, []);
  return (
    <>
      <div className="header---closer">
        <Button icon="close" width={35} height={35} onClick={handleClose} />
      </div>
      <div className="my-multiviewer" style={{ display: "flex" }}>
        <Button
          type="default"
          stylingMode="outlined"
          icon="chevronprev"
          style={{ marginTop: "25%" }}
          onClick={handlePrevView}
          disabled={selectedIndex === 0}
        />

        <MultiView
          dataSource={multipleQrCodes}
          selectedIndex={selectedIndex}
          onOptionChanged={onSelectionChanged}
          loop={true}
          itemComponent={(data) => (
            <QrViewBox data={data} handleClose={handleClose} /> // Pass the function as a prop to QrViewBox
          )}
          animationEnabled={true}
        />
        <Button
          icon="chevronnext"
          type="default"
          stylingMode="outlined"
          onClick={handleNextView}
          disabled={selectedIndex === multipleQrCodes.length - 1}
        />
      </div>
    </>
  );
};

export default Multiviewdisplayer;
