import { TextBox, Button as NormalButton, DateBox } from "devextreme-react";
import React, { useRef, useState } from "react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import "./incomingQC.scss";
import { GRPOScanner, dateStartToEnd } from "../../../assets/icon";
import { Popup } from "devextreme-react/popup";
import PurchaseOrderList from "./purchaseOrderList";
import { toastDisplayer } from "../../../api/qrgenerators";
import { getPoLists } from "../../../utils/gate-in-purchase";
import IncomingQCOrderList from "./incomingQC-OrderList";
import { searchPoListsIQC } from "../../../utils/incoming-QC";

function IncomingQCComponent() {
  const [showTransporterHelp, setShowTransporterHelp] = useState(false);
  const [loading, setLoading] = useState(false); // State to store the selection indicator
  const [selectedRowsData, setSelectedRowsData] = useState([]); // State to store the selected row data
  const [selectedRowKeysOnChange, setSelectedRowKeysOnChange] = useState([]); // State to store the selected row data
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [selectedRowData, setSelectedRowData] = useState("");
  const [txtValueOfTypePOL, settxtValueOfTypePOL] = useState(""); // State to store the selection indicator
  const [IQCList, setIQCList] = useState(new Set()); // State to store the selected row data
  const [IQCList2, setIQCList2] = useState(new Set()); // State to store the selected row data
  const dataGridRef = useRef();
  
  const outsideClickHandler = async () => {
    return setShowTransporterHelp(false);
  };

  const handleCancel = async () => {
    return await outsideClickHandler();
  };

  const handleTextValueChange = (e) => {
    return settxtValueOfTypePOL(e.value);
  };

  const handleQCPoSelection = (params) => {
    if (params.length > 0) {
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

  const dateOptions = {
    icon: dateStartToEnd,
    onClick: async () => {
      //   showPopupHandler();
    },
  };

  const SearchHandler = async () => {
    if (txtValueOfTypePOL) {
      const prodResponse = await searchPoListsIQC(txtValueOfTypePOL);
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
      if (prodResponse["errorText"]=="No data found") {
        return toastDisplayer(
          "error",
          "Invalid Incoming QC, please select a valid Incoming QC"
        );
      }
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };

  return (
    <>
      {showTransporterHelp && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
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
            />
          )}
        ></Popup>
      )}

      <div className="main-section">
        <div className="inputWrapper">
        <div className="date-section">
          <div>
            <DateBox
              className="dx-field-value"
              placeholder="From"
              stylingMode="outlined"
              type="date"
              width={230}
            />
          </div>
          <div>
            <DateBox
              className="dx-field-value"
              placeholder="To"
              stylingMode="outlined"
              type="date"
              width={230}
            />
          </div>
          <TextBox
            className="dx-field-value purchaseQRField"
            stylingMode="outlined"
            placeholder="Type the purchase QR code"
            value={
              selectedRowsData.length > 0 ? selectedRowsData[0].qrCodeID : ""
            }
            width={230}
            onValueChanged={handleTextValueChange}
            showClearButton={true}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>
        </div>
        <div className="btnSection">
          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={SearchHandler}
          />

          <NormalButton
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon={GRPOScanner}
          />
        </div>
        </div>
      </div>

      <div className="orderList-section">
        <IncomingQCOrderList
          IQCList2={IQCList2}
        />
      </div>
    </>
  );
}

export default IncomingQCComponent;
