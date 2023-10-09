import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import scanner from "./scanner.png";
import TransparentContainer from "../../components/qr-scanner/transparent-container";
import { useQRCodeScan } from "../../utils/useQRCodeScan";
import DropDownButton from "devextreme-react/drop-down-button";
import QR_Code from "../../assets/images/QR_Code.png";
import { toastDisplayer } from '../../api/qrgenerators';

import "./MachineInOut.scss";
import { isLoggedIn } from "../../utils/machineInOut-controller";

const shifts = [{ shift: "Day" }, { shift: "Night" }];

const getDate = ()=> {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

function getTime() {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const sec = time.getSeconds();

  return `${hour} : ${minute} : ${sec}`;
}

function MachineInOut() {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [statusLogin, setstatusLogin] = useState(true);
  const [qrdata, setQrData] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [selectedShift, setSelectedSift] = useState("");
  const [loginDate, setLoginDate] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [loginDetails ,setLoginDetails] =useState([]);
  const [scannedQr, setScannedQr] = useState("");
  const [localData, setLocalData] = useState({
    ID: "123456",
    Name: "ABC",
    QR: null,
    shift: "Day",
    Date: null,
    time: null,
  });

  const { startQrCode, stopQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: "machine-login-scanner-wrapper",
  });

  const [dropDownData, setDropDownData] = useState(shifts);

  const togglePopup = async() => {
    await setstatusLogin(true);
    setPopupVisibility(!isPopupVisible);
  };

  const handleCancel = () => {
    setPopupVisibility(false);
  };

  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };



  const scannerScannedData = (data) => {
    console.log('Full qr data', data);
    console.log("This is the scanned QR Data", data.data);
    const qrValue = data.data;
    setQrData(qrValue);
    setScannedQr(qrValue);
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




      const qrDataValue = qrdata;

      const currentDate = getDate();
      const currentTime = getTime();

      setQrData(qrDataValue);
      setLoginDate(currentDate);
      setLoginTime(currentTime);

       setLocalData({
        ...localData,
        QR:scannedQr,
        shift: selectedShift,
        Date: currentDate,
        time: currentTime,
      });
    } else {
      alert("Please select your shift");
    }
  };



   //////---------------getting the Data from the localstorage--------------------
   function getLocalData() {
    const storedData = localStorage.getItem("loginUserDetail");
    const storeQr = localStorage.getItem("QrData");

   
    const dataArray = [];


    if (storedData) {
      const parsedData = JSON.parse(storedData);

      const ScannedData = JSON.parse(storeQr);

      const dataObject = {
        Id: parsedData.ID,
        ScannedData,
        name: parsedData.Name,
        Shift: parsedData.shift,
        Date: parsedData.Date,
        Time: parsedData.time,

      };

      dataArray.push(dataObject);

 
      setSelectedSift(dataObject.Shift);
      setQrData(storeQr);
      setLoginTime(dataObject.Time);
      console.log(dataArray);
      console.log("This is the selected sift in the logging",dataObject.Shift);
      setLoginDetails(dataArray);
    } else {
      console.log("No data found in local storage.");
    }
  }

 
  const handlePopupLogout = () => {
    setQrData(null);
    setSelectedSift(null);
    setPopupVisibility(false);
    localStorage.removeItem("qrdata");
    localStorage.removeItem("loginUserDetail");
  };

const isCheckHandler = ()=>{
const {loginUserDetail,loginUserDetailQrData}  = isLoggedIn();
if(loginUserDetail && loginUserDetailQrData){
    console.log("User is looged in")
    return setQrData(loginUserDetailQrData);
  }
};




  useEffect(() => {
    if(qrdata&&loginDate){
        console.log("This localData",localData)
        localStorage.setItem("loginUserDetail", JSON.stringify(localData));
        localStorage.setItem("QrData" ,JSON.stringify(scannedQr))
    }
  }, [qrdata]);
  useEffect(() => {
    isCheckHandler();
    getLocalData();
  }, []);

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

        <div className="login-details">
          <div>
            {selectedShift && qrdata ? (
              <>
                <div className="Machine-text-info">
                  <img
                    className="qr_img"
                    src={QR_Code}
                    height={126}
                    width={133}
                  />
                </div>
                <div className="inner-text">
                  <span className="login-text">
                    Click on logout to stop working on the Machine
                  </span>
                </div>
                <div className="Machine-text">
                  <h4 className="h4">
                    Machine Details : <span>{qrdata}</span>
                  </h4>

                  <h4 className="h4-logtime">
                    
                    Login Time: <span>{loginTime}</span>
                  </h4>


                </div>
              </>
            ) : (
              <div>
                <div className="Machine-text-info">
                  <img
                    className="qr_img"
                    src={QR_Code}
                    height={126}
                    width={133}
                  />
                </div>
                <div>
                  <span className="login-text">
                    Click on login to start working on the screen
                  </span>
                </div>
    
              </div>
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
          width={500}
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
                    <div className="Machine-text">
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
                        <span className="detailHeaderTxt" >{qrdata}</span>
                        <br />
                       
                      </div>
                      <div>
                        <span className="timeTxt">Time {loginTime}</span>
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
                        width={190}
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
