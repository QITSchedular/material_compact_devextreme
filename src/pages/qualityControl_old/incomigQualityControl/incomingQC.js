import { TextBox, Button as NormalButton, DateBox } from "devextreme-react";
import React, { useRef, useState, useEffect } from "react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { GRPOScanner, dateStartToEnd } from "../../../assets/icon";
import { Popup, ScrollView } from "devextreme-react";
import PurchaseOrderList from "./purchaseOrderList";
import { toastDisplayer } from "../../../api/qrgenerators";
import IncomingQCOrderList from "./incomingQC-OrderList";
import { searchPoListsIQC } from "../../../utils/incoming-QC";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

function IncomingQCComponent() {
  const [showTransporterHelp, setShowTransporterHelp] = useState(false);
  const [loading, setLoading] = useState(false); // State to store the selection indicator
  const [selectedRowsData, setSelectedRowsData] = useState([]); // State to store the selected row data
  const [selectedRowKeysOnChange, setSelectedRowKeysOnChange] = useState([]); // State to store the selected row data
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [selectedRowData, setSelectedRowData] = useState("");
  const [txtValueOfTypePOL, settxtValueOfTypePOL] = useState(""); // State to store the selection indicator
  const [fromDate, setFromDate] = useState(""); // State to store the selection indicator
  const [toDate, setToDate] = useState(""); // State to store the selection indicator
  const [IQCList, setIQCList] = useState(new Set()); // State to store the selected row data
  const [IQCList2, setIQCList2] = useState(new Set()); // State to store the selected row data
  const dataGridRef = useRef();

  //for scanner open-close
  const [showScanner, setShowScanner] = useState(false);
  //manage multiple input of data
  const [showPO, setShowPO] = useState();

  const outsideClickHandler = async () => {
    return setShowTransporterHelp(false);
  };

  const handleCancel = async () => {
    return await outsideClickHandler();
  };

  const handleTextValueChange = (e) => {
    setShowPO(true);
    return settxtValueOfTypePOL(e.value);
  };

  const handleQCPoSelection = (params) => {
    if (params.length > 0) {
      setShowPO(false);
      return setSelectedRowsData(params);
    }
  };

  const selectedRowSetter = async (params) => {
    setSelectedRowData(params);
    return handleQCPoSelection(params);
  };

  const handleDataGridRowSelection = async ({ selectedRowKeys }) => {
    setSelectedRowKeysOnChange(selectedRowKeys);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetter(value);
    }
  };

  const handleSaveSelectedPo = () => {
    setSelectedRowKeys(selectedRowKeysOnChange);
    if (selectedRowsData.length > 0) {
      return setShowTransporterHelp(false);
    } else {
      return toastDisplayer(
        "error",
        "Please select a Purchase order to save and proceed"
      );
    }
  };

  const handleSave = async (params) => {
    // console.log("click ok btn");
    handleSaveSelectedPo();
  };

  const showPopupHandler = () => {
    // console.log("it is true to show");
    return setShowTransporterHelp(true);
  };

  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };

  function convertData(dateString) {
    const originalDate = new Date(dateString);

    // Extract the year, month, and day components
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month because months are zero-based
    const day = String(originalDate.getDate()).padStart(2, "0");

    // Create the formatted date string in the "YYYY-MM-DD" format
    const formattedDateStr = `${year}-${month}-${day}`;

    return formattedDateStr;
  }

  const fromDateOptions = (e) => {
    setFromDate(convertData(e.value));
  };

  const toDateOptions = (e) => {
    setToDate(convertData(e.value));
  };

  const SearchHandler = async () => {
    if (txtValueOfTypePOL) {
      const prodResponse = await searchPoListsIQC(
        txtValueOfTypePOL,
        fromDate,
        toDate
      );
      console.log("first===>", prodResponse);
      var doProuctExist;

      if (IQCList2.size > 0) {
        doProuctExist = false;
        IQCList2.forEach((value) => {
          if (value.headerQRCodeID == txtValueOfTypePOL) {
            doProuctExist = true;
            return;
          }
        });
      } else {
        doProuctExist = false;
      }
      if (prodResponse["errorText"] == "No data found") {
        return toastDisplayer(
          "error",
          "Invalid Incoming QC, please select a valid Incoming QC"
        );
      } else if (prodResponse && doProuctExist) {
        return toastDisplayer("error", "Product alredy exist..!!");
      } else if (prodResponse && !doProuctExist) {
        // setIQCList2((prevIQCList) => {
        //   const updatedSet = new Set(prevIQCList); // Create a new Set based on the previous Set

        //   prodResponse.forEach((response) => {
        //     updatedSet.add(response); // Add each object from prodResponse to the updatedSet
        //   });

        //   return updatedSet; // Return the updated Set
        // });
        setIQCList2((prevIQCList) => {
          console.log("prevIQCList: ", prevIQCList);

          const updatedSet = new Set(prevIQCList);

          prodResponse.forEach((response) => {
            const exists = Array.from(updatedSet).some((item) =>
              item.docEntry === response.docEntry
            );
            console.log("isexist===", exists);
            if (!exists) {
              updatedSet.add(response);
            }
          });
          console.log("updatedSet:", updatedSet);
          return updatedSet;
        });
      }
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };

  //close and open scanner
  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };

  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };

  const HandleDecodedData1 = (data) => {
    settxtValueOfTypePOL(data);
    setShowPO(true);
    setShowScanner(false);
  };

  const [popupHeight, setPopupHeight] = useState(window.innerHeight - 70);

  useEffect(() => {
    const handleResize = () => {
      setPopupHeight(window.innerHeight - 70);
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {showTransporterHelp && (
        <Popup
          visible={true}
          //height={window.innerHeight - 70}
          height={popupHeight}
          showCloseButton={true}
          hideOnOutsideClick={outsideClickHandler}
          className="purchaseOrderList"
          contentRender={() => (
            <PurchaseOrderList
              handleCancel={handleCancel}
              handleSave={handleSave}
              handleDataGridRowSelection={handleDataGridRowSelection}
              dataGridRef={dataGridRef}
              selectedRowKeys={selectedRowKeys}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        ></Popup>
      )}
      <div className="main-section">
        {/* {console.log(IQCList2)} */}
        <div className="inputWrapper">
          <div className="date-section">
            {/* <div> */}
            <DateBox
              className="dx-field-value"
              placeholder="From"
              stylingMode="outlined"
              type="date"
              width={230}
              height={40}
              onValueChanged={fromDateOptions}
            />
            {/* </div>
            <div> */}
            <DateBox
              className="dx-field-value"
              placeholder="To"
              stylingMode="outlined"
              type="date"
              width={230}
              height={40}
              onValueChanged={toDateOptions}
            />
            {/* </div> */}
          </div>
          <div className="txtBtn-section">
            <TextBox
              className="dx-field-value purchaseQRField"
              stylingMode="outlined"
              placeholder="Type the purchase QR code"
              value={
                showPO
                  ? txtValueOfTypePOL
                  : selectedRowsData.length > 0
                  ? selectedRowsData[0].qrCodeID
                  : ""
              }
              width={210}
              onValueChanged={handleTextValueChange}
              showClearButton={true}
              height={40}
            >
              <TextBoxButton
                name="currency"
                location="after"
                options={helpOptions}
                height={40}
              />
            </TextBox>
            <div className="btnSection">
              <NormalButton
                width={40}
                height={40}
                type="normal"
                stylingMode="outlined"
                icon="search"
                onClick={SearchHandler}
              />
              <NormalButton
                width={40}
                height={40}
                type="normal"
                stylingMode="outlined"
                icon={GRPOScanner}
                onClick={handleScan}
              />
              {showScanner && (
                <div>
                  <TransparentContainer
                    mountNodeId="container"
                    showScan={showScanner}
                    HandleCloseQrScanner1={HandleCloseQrScanner}
                    HandleDecodedData={HandleDecodedData1}
                  ></TransparentContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="orderList-section">
        <IncomingQCOrderList IQCList2={IQCList2} />
      </div>
    </>
  );
}

export default IncomingQCComponent;
