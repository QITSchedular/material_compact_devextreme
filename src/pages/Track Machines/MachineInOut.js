import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import "./MachineInOut.scss";
import { customers } from "./data";
import { Popup } from "devextreme-react/popup";
import { TextArea } from "devextreme-react/text-area";
import scanner from "./scanner.png";
import { List, MultiView } from "devextreme-react";
import TransparentContainer from "../../components/qr-scanner/transparent-container";
import { useQRCodeScan } from "../../utils/useQRCodeScan";
import { GRPOScanner } from "../../assets/icon";
import DropDownBox from "devextreme-react/drop-down-box";
import DropDownButton from "devextreme-react/drop-down-button";

const QrCodes = ({ QrArray }) => {
  console.log(QrArray.data.detailQRcode);
  return (
    <>
      <div className="qrCodeSection">
        <div className="qrCodeSectionSub1">
          <div>
            <img src={scanner} height={100} width={100} />
          </div>
        </div>
        <div className="qrCodeSectionSub2">
          <div className="qrCodeSectionSubSub1">
            <div>
              <span className="detailHeaderTxt">
                {QrArray.data.detailQRcode}
              </span>
            </div>
            <div>
              <span className="timeTxt">{QrArray.data.time}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const shifts = [{ shift: "Day" }, { shift: "Night" }];

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const time = today.getTime();
  return `${month}/${date}/${year}`;
}

function getTime() {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const sec = time.getSeconds();

  return `${hour} - ${minute} - ${sec}`;
}

function MachineInOut() {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [statusLogin, setstatusLogin] = useState(true);
  const [qrdata, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedShift, setSelectedSift] = useState("");
  const [loginDate, setLoginDate] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  const [localData, setLocalData] = useState([]);

  const { startQrCode, stopQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: "machine-login-scanner-wrapper",
  });

  const [dropDownData, setDropDownData] = useState(shifts);

  const togglePopup = () => {
    setstatusLogin(true);
    setPopupVisibility(!isPopupVisible);
  };
  const togglePopup1 = () => {
    setstatusLogin(false);
    setPopupVisibility(!isPopupVisible);
  };

  const handleCancel = () => {
    setPopupVisibility(false);
  };

  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };

  const QrArray = [
    {
      detailQRcode: "CACDAHBH AH 000004 0000034",
      time: "Time 12:00 A.m.",
      img: scanner,
    },
    {
      detailQRcode: "CACDAHBH AH 000004 0000035",
      time: "Time 11:00 A.m.",
      img: scanner,
    },
    {
      detailQRcode: "CACDAHBH AH 000004 0000036",
      time: "Time 01:00 A.m.",
      img: scanner,
    },
    {
      detailQRcode: "CACDAHBH AH 000004 0000037",
      time: "Time 02:00 A.m.",
      img: scanner,
    },
  ];

  const onSelectionChanged = (args) => {
    if (args.name === "selectedIndex") {
      //   setSelectedIndex(args.value);
    }
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };

  const scannerScannedData = (data) => {
    console.log("QR Data", data.data);
    setQrData(data.data);
    console.log("State QR Data ", qrdata);
  };

  const shiftClick = async (e) => {
    await setSelectedSift(e.itemData.shift);
    
  };
  const handlePopupLogin = async () => {
    if (selectedShift) {
      setPopupVisibility(false);
      setShowScanner(true);

      await setLoginDate(getDate);
      await setLoginTime(getTime);

      await setLocalData({
        ID: "123456",
        Name: "ABC",
        QR: qrdata,
        shift: selectedShift,
        Date: loginDate,
        time: loginTime,
      });

      
    } else {
      alert("Please select your shift");
    }
  };
  const handlePopupLogout = () => {
    setQrData(null);
    setSelectedSift(null);
    setPopupVisibility(false);
  };

  useEffect(() => {
    
    localStorage.setItem("loginUserDetail", JSON.stringify(localData));
    localStorage.setItem("qrData", JSON.stringify(qrdata));
    console.log(JSON.stringify(qrdata))
  }, [showScanner,localData]);
  return (
    <>
      <div className="card">
        <div className="content-block-wrapper">
          <div className="content-block-1">
            <div className="content-text">
              <div className="content-text-header">Login and Logout</div>
              <div className="content-text-info">
                Confirm your login details here
              </div>
              <div>
                {selectedShift && qrdata ? (
                  <div className="content-text-info">
                    <span>QR : {qrdata}</span>
                    <br />
                    <span>Shift : {selectedShift}</span>
                    <br />

                    <span>Login Date: {loginDate}</span>
                    <br />
                    <span> Login Time: {loginTime}</span>
                    <br />
                  </div>
                ) : (
                  <div className="content-text-info">
                    <span>Please Login</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="Btndiv">
            {statusLogin && selectedShift && qrdata ? (
              <Button
                className="my-btn"
                text="Log out"
                type="default"
                width={124}
                height={44}
                onClick={togglePopup}
              />
            ) : (
              <Button
                className="my-btn"
                type="default"
                text="Log In"
                width={124}
                height={44}
                onClick={togglePopup}
              />
            )}
          </div>
        </div>
      </div>

      {/*****************************************POPUP FOR LOGIN *********************************/}

      {isPopupVisible && (
        <Popup
          visible={isPopupVisible}
          showCloseButton={true}
          hideOnOutsideClick={true}
          onHiding={togglePopup}
          width={700}
          height={500}
        >
          <div className="content-blocks">
            <div className="MachineInOutMainDiv">
              <div className="content-block-wrapper">
                <div className="content-block-1">
                  <div className="content-text">
                    <div className="Machine-header">
                      Scan the Machine QR Code
                    </div>
                    <div className="Machine-text-info">
                      Please place the camera near Qr code
                    </div>
                  </div>
                  <div className="close-btn-section">
                    <Button icon="close" onClick={handleCancel} />
                  </div>
                </div>
              </div>
              <div className="qrCodeSection">
                <div class="container-qr">
                  <div class="background-container">
                    <div class="qr-background1"></div>
                    <div class="qr-background2"></div>
                  </div>
                  <div class="background-container">
                    <div class="qr-background3"></div>
                    <div class="qr-background4"></div>
                  </div>
                  <div class="overlay">
                    <img src={scanner} height={100} width={100} />
                  </div>
                </div>

                {statusLogin && selectedShift && qrdata ? (
                  <div className="qrCodeSectionSub2">
                    <div className="qrCodeSectionSubSub1">
                      <div>
                        <span className="detailHeaderTxt">{qrdata}</span>
                        <br />
                        <span>Shift : </span>
                        <span className="detailHeaderTxt">{selectedShift}</span>
                      </div>
                      <div>
                        <span className="timeTxt">Time 11:00 A.m.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="qrCodeSectionSub2">
                    <div className="qrCodeSectionSubSub1">
                      <DropDownButton
                        height={40}
                        text={
                          selectedShift ? selectedShift : "Select Your Sift"
                        }
                        keyExpr="shift"
                        displayExpr={"shift"}
                        items={shifts}
                        className="period-indicator"
                        width={350}
                        onItemClick={shiftClick}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="buttonSection">
                <div>
                  {statusLogin && selectedShift && qrdata ? (
                    <Button
                      className="Machine-btn"
                      onClick={handlePopupLogout}
                      text={"Logout"}
                    />
                  ) : (
                    <Button
                      className="Machine-btn"
                      onClick={handlePopupLogin}
                      text="Login"
                    />
                  )}
                </div>
              </div>
            </div>
            {/* <TransparentContainer mountNodeId="machine-login-scanner-wrapper" /> */}
          </div>
        </Popup>
      )}

      {showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="container"
            showScan={showScanner}
            HandleCloseQrScanner={HandleCloseQrScanner}
            scannerScannedData={scannerScannedData}
          ></TransparentContainer>
        </div>
      )}
    </>
  );
}

export default MachineInOut;
