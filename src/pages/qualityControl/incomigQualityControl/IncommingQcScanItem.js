import {
  DateBox,
  TextBox,
  Button as NormalButton,
  Popup,
} from "devextreme-react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import React, { useEffect, useRef, useState } from "react";
import { GRPOScanner } from "../../../assets/icon";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { useParams } from "react-router-dom";
import {
  LockedWareHouseList,
  validatePoListsIQC,
} from "../../../utils/incoming-QC";
import { toastDisplayer } from "../../../api/qrgenerators";
import IncomingQcPopUp, { popUp } from "./IncomingQcPopUp";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Scrolling,
  Editing,
} from "devextreme-react/data-grid";
import IncomingQrRequest from "./incomingQrRequest";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

function IncommingQcScanItem() {
  const columns = [
    {
      caption: "poDocEntry",
      field: "poDocEntry",
    },
    {
      caption: "poDocNum",
      field: "poDocNum",
    },
    {
      caption: "headerQRCodeID",
      field: "headerQRCodeID",
    },
    {
      caption: "detailQRCodeID",
      field: "detailQRCodeID",
    },
    {
      caption: "grpoDocEntry",
      field: "grpoDocEntry",
    },
    {
      caption: "grpoDocNum",
      field: "grpoDocNum",
    },
    {
      caption: "cardCode",
      field: "cardCode",
    },
    {
      caption: "cardName",
      field: "cardName",
    },
    {
      caption: "docDate",
      field: "docDate",
      dataType: "date",
    },
    {
      caption: "itemCode",
      field: "itemCode",
    },
    {
      caption: "itemName",
      field: "itemName",
    },
    {
      caption: "recQty",
      field: "recQty",
    },
    {
      caption: "project",
      field: "project",
    },
    {
      caption: "uomCode",
      field: "uomCode",
    },
    {
      caption: "whsCode",
      field: "whsCode",
    },
  ];

  const [QrRequestPopUp, setQrRequestPopUp] = useState(false);
  const [ApproveWareHouse, setApproveWareHouse] = useState(false);
  const [RejectWareHouse, setRejectWareHouse] = useState(false);
  const [selectedRowsDataApprove, setselectedRowsDataApprove] = useState([]); // State to store the selected row data
  const [selectedRowsDataReject, setselectedRowsDataReject] = useState([]); // State to store the selected row data
  const [selectedRowsData, setselectedRowsData] = useState([]); // State to store the selected row data
  const { headerQRCodeID, docEntry } = useParams();
  const [selectedRowKeysOnChangeApprove, setSelectedRowKeysOnChangeApprove] =
    useState([]); // State to store the selected row data
  const [selectedRowKeysOnChangeReject, setSelectedRowKeysOnChangeReject] =
    useState([]); // State to store the selected row data
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store the selected row data
  const [selectedRowKeysReject, setSelectedRowKeysReject] = useState([]); // State to store the selected row data
  var [detailQRCodeID, setdetailQRCodeID] = useState("");
  var [isGridVisible, setIsGridVisible] = useState(false);
  const [IQCList, setIQCList] = useState(new Set()); // State to store the selected row data
  const [QrRequestData, setQrRequestData] = useState(new Set()); // State to store the selected row data
  const [selectedRowData, setSelectedRowData] = useState("");
  const dataGridRefApprove = useRef();
  const dataGridRefReject = useRef();
  const dataGridRefList = useRef();

  //scanner open and close
  const [showScanner, setShowScanner] = useState(false);
  //for Data
  const [scannedData, setScannedData] = useState([]);

  //pop up cancel handler QR request
  const handleCancelQrRequest = async () => {
    const value = await dataGridRefList.current.instance.selectRows(0);
    return await outsideClickHandlerQrRequest();
  };

  //close QR request
  const outsideClickHandlerQrRequest = async () => {
    return setQrRequestPopUp(false);
  };

  //pop up cancel handler approve
  const handleCancel = async () => {
    return await outsideClickHandler();
  };

  // popUp save btn handler approve
  const handleSave = async (params) => {
    handleSaveSelectedRowData();
  };

  //pop up cancel handler reject
  const handleCancelReject = async () => {
    return await outsideClickHandlerReject();
  };

  // popUp save btn handler reject
  const handleSaveReject = async (params) => {
    handleSaveSelectedRowDataReject();
  };

  // called when approve popup save btn clicked
  const handleSaveSelectedRowData = () => {
    setSelectedRowKeys(selectedRowKeysOnChangeApprove);
    if (selectedRowsDataApprove.length > 0) {
      return setApproveWareHouse(false);
    } else {
      return toastDisplayer(
        "error",
        "Please select a Purchase order to save and proceed"
      );
    }
  };

  // called when reject popup save btn clicked
  const handleSaveSelectedRowDataReject = () => {
    setSelectedRowKeysReject(selectedRowKeysOnChangeReject);
    // console.log(selectedRowKeysOnChangeReject);
    if (selectedRowKeysOnChangeReject.length > 0) {
      return setRejectWareHouse(false);
    } else {
      return toastDisplayer(
        "error",
        "Please select a Purchase order to save and proceed"
      );
    }
  };

  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      //   showPopupHandler();
    },
  };

  const commonFunctionforSearchHandler = async (data) => {
    var reqBody = {
      headerQRCodeID: headerQRCodeID,
      docEntry: docEntry,
      detailQRCodeID: data,
    };
    var response = await validatePoListsIQC(reqBody);
    var doProuctExist;
    if (response.hasError) {
      return toastDisplayer("error", response.errorText);
    }
    if (IQCList.size > 0) {
      doProuctExist = false;
      IQCList.forEach((value) => {
        if (value.detailQRCodeID == detailQRCodeID) {
          doProuctExist = true;
          return;
        }
      });
    } else if (detailQRCodeID) {
      var reqBody = {
        headerQRCodeID: headerQRCodeID,
        docEntry: docEntry,
        detailQRCodeID: detailQRCodeID,
      };
      var response = await validatePoListsIQC(reqBody);
      var doProuctExist;
      if (IQCList.size > 0) {
        doProuctExist = false;
        IQCList.forEach((value) => {
          if (value.detailQRCodeID == detailQRCodeID) {
            doProuctExist = true;
            return;
          }
        });
      } else {
        doProuctExist = false;
      }

      if (response["errorText"] == "No data found") {
        return toastDisplayer("error", "Please enter valid item code");
      } else if (doProuctExist && response) {
        return toastDisplayer("error", "Product already added..!!");
      } else if (!doProuctExist && response) {
        setIQCList((prevIQCList) => {
          const updatedSet = new Set(prevIQCList); // Create a new Set based on the previous Set

          response.forEach((resp) => {
            updatedSet.add(resp); // Add each object from prodResponse to the updatedSet
          });
          setIsGridVisible(true);
          return updatedSet; // Return the updated Set
        });
      }
    } else {
      doProuctExist = false;
    }

    if (response["errorText"]) {
      return toastDisplayer("error", "Please enter valid item code");
    } else if (doProuctExist && response) {
      return toastDisplayer("error", "Product already added..!!");
    } else if (!doProuctExist && response) {
      setIQCList((prevIQCList) => {
        const updatedSet = new Set(prevIQCList); // Create a new Set based on the previous Set

        response.forEach((resp) => {
          updatedSet.add(resp); // Add each object from prodResponse to the updatedSet
        });
        setIsGridVisible(true);
        return updatedSet; // Return the updated Set
      });
    } else {
      return toastDisplayer("error", response["errorText"]);
    }
  };

  const SearchHandler = async (scannedDetailQRCodeID) => {
    console.log("scannedDetailQRCodeID  : ", detailQRCodeID);
    // alert(scannedDetailQRCodeID);
    if (
      typeof scannedDetailQRCodeID !== "object" &&
      scannedDetailQRCodeID !== null
    ) {
      commonFunctionforSearchHandler(scannedDetailQRCodeID);
    } else if (detailQRCodeID) {
      commonFunctionforSearchHandler(detailQRCodeID);
    } else {
      return toastDisplayer("error", "Please type/scan Item");
    }
  };

  const handleTextValueChange = (e) => {
    return setdetailQRCodeID(e.value);
  };

  //close approve popup
  const outsideClickHandler = async () => {
    return setApproveWareHouse(false);
  };

  // close reject popup
  const outsideClickHandlerReject = async () => {
    return setRejectWareHouse(false);
  };

  const approveWareHouseHandler = {
    icon: HelpIcons,
    onClick: async () => {
      approveWareHouse();
    },
  };

  const approveWareHouse = () => {
    return setApproveWareHouse(true);
  };

  const rejectWareHouseHandler = {
    icon: HelpIcons,
    onClick: async () => {
      rejectWareHouse();
    },
  };

  const rejectWareHouse = () => {
    return setRejectWareHouse(true);
  };

  const column = [
    {
      caption: "Warehouse Code",
      field: "whsCode",
    },
    {
      caption: "Warehouse Name",
      field: "whsName",
    },
    {
      caption: "Location",
      field: "locCode",
    },
    {
      caption: "Locked",
      field: "locked",
    },
  ];

  const selectedRowSetter = async (params) => {
    setSelectedRowData(params);
    return handleQCPoSelection(params);
  };

  const handleQCPoSelection = (params) => {
    if (params.length > 0) {
      return setselectedRowsData(params);
    }
  };

  // approve -- called after handleDataGridRowSelectionApprove
  const selectedRowSetterApprove = async (params) => {
    setSelectedRowData(params);
    return handleQCPoSelectionApprove(params);
  };

  const handleQCPoSelectionApprove = (params) => {
    if (params.length > 0) {
      return setselectedRowsDataApprove(params);
    }
  };

  // reject -- called after handleDataGridRowSelectionReject
  const selectedRowSetterReject = async (params) => {
    setSelectedRowData(params);
    return handleQCPoSelectionReject(params);
  };

  const handleQCPoSelectionReject = (params) => {
    if (params.length > 0) {
      return setselectedRowsDataReject(params);
    }
  };

  //when select any row of approve popup this will called
  const handleDataGridRowSelectionApprove = async ({ selectedRowKeys }) => {
    setSelectedRowKeysOnChangeApprove(selectedRowKeys);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRefApprove.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetterApprove(value);
    } else {
      const value = await dataGridRefApprove.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetterApprove(value);
    }
  };

  //when select any row of reject popup this will called
  const handleDataGridRowSelectionReject = async ({ selectedRowKeys }) => {
    setSelectedRowKeysOnChangeReject(selectedRowKeys);
    const length = await selectedRowKeys.length;
    console.log(length);
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRefReject.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      // const value1 = await dataGridRefList.current.instance.selectRows(0);
      return selectedRowSetterReject(value);
    } else {
      const value = await dataGridRefReject.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetterReject(value);
    }
  };

  const handleDataGridRowSelection = async ({ selectedRowKeys }) => {
    setSelectedRowKeysOnChangeApprove(selectedRowKeys);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length == 1) {
      if (selectedRowsDataApprove.length > 0) {
        setQrRequestPopUp(true);
        IQCList.forEach((item) => {
          if (item.detailQRCodeID == selectedRowKeys[0]) {
            console.log(item);
            setQrRequestData(item);
          }
        });
      } else {
        const value = await dataGridRefList.current.instance.selectRows(0);
        return toastDisplayer("error", "Please select warehouse");
      }
    }
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRefList.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRefList.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetter(value);
    }
  };

  const removeFromIQCList = async (itemToRemove) => {
    const updatedIQCList = new Set(IQCList);
    updatedIQCList.forEach((item) => {
      if (item.detailQRCodeID === itemToRemove) {
        updatedIQCList.delete(item);
      }
    });
    if (updatedIQCList.size <= 0) {
      setIsGridVisible(false);
    }
    return setIQCList(updatedIQCList);
  };

  // Function to clear data
  const clearData = async (detailQr) => {
    if (IQCList.size <= 1) {
      await removeFromIQCList(detailQr);
      outsideClickHandlerQrRequest();
      setdetailQRCodeID("");
      setSelectedRowKeys([]);
      setSelectedRowKeysReject([]);
      setselectedRowsDataApprove([]);
      setselectedRowsDataReject([]);
    }
    outsideClickHandlerQrRequest();
    await removeFromIQCList(detailQr);
  };
  // delete data
  const DeleteData = async (e) => {
    await removeFromIQCList(e.key);
  };

  //close and open scanner
  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  const HandleDecodedData1 = (data1) => {
    // console.log("Scanned Data : ",data1);
    if (scannedData.includes(data1)) {
      console.log(`${data1} is already available.`);
    } else {
      setScannedData([...scannedData, data1]);
    }
    // setShowScanner(false);
  };

  // const HandleSaveDecodedScannedData = async () => {
  //   console.log("From HandleSaveDecodedScannedData", scannedData)
  //   setShowScanner(false);

  //   scannedData.forEach(async (scannedItem) => {
  //     await SearchHandler(scannedItem);
  //   })
  // }

  const HandleSaveDecodedScannedData = async () => {
    console.log("From HandleSaveDecodedScannedData");
    setShowScanner(false);

    try {
      scannedData.forEach(async (scannedItem) => {
        await SearchHandler(scannedItem);
      });
    } catch (error) {
      console.error("Circular reference detected. Unable to log scannedData.");
    }
  };

  const handleScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setShowScanner(true);
    } catch (error) {
      toastDisplayer("error", "Scanner not found.");
    }
  };

  return (
    <>
      {ApproveWareHouse && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={true}
          hideOnOutsideClick={outsideClickHandler}
          className="purchaseOrderList"
          contentRender={() => (
            <IncomingQcPopUp
              title={"Approved Warehouse"}
              caption={"Search the warehouse"}
              handleCancel={handleCancel}
              handleSave={handleSave}
              apiCallFun={LockedWareHouseList()}
              keyExpr={"whsCode"}
              columns={column}
              handleDataGridRowSelection={handleDataGridRowSelectionApprove}
              dataGridRef={dataGridRefApprove}
              selectedRowKeys={selectedRowKeys}
              selectedWarehouse={selectedRowKeysReject}
            />
          )}
        ></Popup>
      )}
      {RejectWareHouse && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={true}
          hideOnOutsideClick={outsideClickHandler}
          className="purchaseOrderList"
          contentRender={() => (
            <IncomingQcPopUp
              title={"Rejected Warehouse"}
              caption={"Rejected the warehouse"}
              handleCancel={handleCancelReject}
              handleSave={handleSaveReject}
              apiCallFun={LockedWareHouseList()}
              keyExpr={"whsCode"}
              columns={column}
              handleDataGridRowSelection={handleDataGridRowSelectionReject}
              dataGridRef={dataGridRefReject}
              selectedRowKeys={selectedRowKeysReject}
              selectedWarehouse={selectedRowKeys}
            />
          )}
        ></Popup>
      )}
      <div className="main-section-scan-item">
        <div className="inputWrapper-scan-item">
          <div className="txtBtn-section">
            <TextBox
              className="dx-field-value purchaseQRField"
              stylingMode="outlined"
              placeholder="Type the purchase QR code"
              // width={260}
              onValueChanged={handleTextValueChange}
              showClearButton={true}
              value={detailQRCodeID ? detailQRCodeID : ""}
            ></TextBox>
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
                onClick={handleScan}
              />
              {showScanner && (
                <div>
                  <TransparentContainer
                    mountNodeId="container"
                    showScan={showScanner}
                    HandleCloseQrScanner1={HandleCloseQrScanner}
                    HandleDecodedData={HandleDecodedData1}
                    HandleSaveDecodedData={HandleSaveDecodedScannedData}
                  ></TransparentContainer>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="helperWrapper">
          <TextBox
            className="dx-field-value purchaseQRField"
            stylingMode="outlined"
            placeholder="Approved Wherehouse"
            value={
              selectedRowsDataApprove.length > 0
                ? selectedRowsDataApprove[0].whsCode
                : ""
            }
            width={160}
            // onValueChanged={handleTextValueChange}
            showClearButton={true}
          >
            <TextBoxButton
              name="approve"
              location="after"
              options={approveWareHouseHandler}
            />
          </TextBox>
          <TextBox
            className="dx-field-value purchaseQRField"
            stylingMode="outlined"
            placeholder="Rejected Wherehouse"
            value={
              selectedRowsDataReject.length > 0
                ? selectedRowsDataReject[0].whsCode
                : ""
            }
            width={160}
            // onValueChanged={handleTextValueChange}
            showClearButton={true}
          >
            <TextBoxButton
              name="approve"
              location="after"
              options={rejectWareHouseHandler}
            />
          </TextBox>
        </div>
      </div>
      {isGridVisible && (
        <div className="orderList-section">
          <DataGrid
            // height={420}
            dataSource={Array.from(IQCList)}
            // keyExpr={"itemCode"}
            keyExpr={"detailQRCodeID"}
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRefList}
            onRowRemoving={DeleteData}
            // selectedRowKeys={selectedRowKeysNew}
          >
            {/* <SearchPanel visible={true} /> */}
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="infinite" enabled="true" />
            <Paging enabled={false} />
            {columns &&
              columns.map((value, key) => (
                <Column
                  dataField={value["field"]}
                  caption={value["caption"]}
                ></Column>
              ))}
            <Editing mode={"row"} allowDeleting={true} />
          </DataGrid>
        </div>
      )}
      {QrRequestPopUp && (
        <Popup
          visible={true}
          height={700}
          width={544}
          showCloseButton={true}
          className="QrRequestPopUp"
          hideOnOutsideClick={false}
          contentRender={() => (
            <IncomingQrRequest
              handleCancelQrRequest={handleCancelQrRequest}
              requestData={QrRequestData}
              allData={QrRequestData}
              approveWareHouse={
                selectedRowsDataApprove.length
                  ? selectedRowsDataApprove[0].whsCode
                  : null
              }
              rejectWareHouse={
                selectedRowsDataReject.length
                  ? selectedRowsDataReject[0].whsCode
                  : null
              }
              clearData={clearData}
            />
          )}
        >
          {/* {console.log(selectedRowsDataReject.length,"--",selectedRowsDataReject)} */}
        </Popup>
      )}
      {/* {QrRequestPopUp && <incomingQrRequest isCommonPopupVisible={QrRequestPopUp} />} */}
    </>
  );
}

export default IncommingQcScanItem;
