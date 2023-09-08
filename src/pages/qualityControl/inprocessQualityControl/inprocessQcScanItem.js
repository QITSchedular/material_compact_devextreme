import { DateBox, TextBox, Button as NormalButton } from "devextreme-react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import React, { useState, useRef } from "react";
import { GRPOScanner } from "../../../assets/icon";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { useParams } from "react-router-dom";
import { LockedWareHouseList, validatePoListsIQC } from "../../../utils/incoming-QC";
import { toastDisplayer } from "../../../api/qrgenerators";
import { QtcDataGrid } from "../../../components";
import { Popup } from "devextreme-react/popup";
import './inprocessQC.scss';
import InprocessQcPopUp from "./InprocessQcPopUp";
import DataGrid, {
    Column,
    Paging,
    Selection,
    Scrolling,
} from "devextreme-react/data-grid";
import InprocessQrRequest from "./inprocessQrRequest";

function InprocessQcScanItem() {
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
            dataType: "date"
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
    const { headerQRCodeID, docEntry } = useParams();
    const [selectedRowKeysOnChangeApprove, setSelectedRowKeysOnChangeApprove] = useState([]); // State to store the selected row data
    const [selectedRowKeysOnChangeReject, setSelectedRowKeysOnChangeReject] = useState([]); // State to store the selected row data
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store the selected row data
    const [selectedRowKeysReject, setSelectedRowKeysReject] = useState([]); // State to store the selected row data
    var [detailQRCodeID, setdetailQRCodeID] = useState("");
    var [isGridVisible, setIsGridVisible] = useState(false);
    const [IQCList, setIQCList] = useState(new Set()); // State to store the selected row data
    const [QrRequestData, setQrRequestData] = useState(new Set()); // State to store the selected row data
    const [selectedRowData, setSelectedRowData] = useState("");
    const dataGridRef = useRef();
    const dataGridRefList = useRef();

    //pop up cancel handler QR request
    const handleCancelQrRequest = async () => {
        return await outsideClickHandlerQrRequest();
    };

    //close QR request
    const outsideClickHandlerQrRequest = async () => {
        return setQrRequestPopUp(false);
    };

    // popUp save btn handler approve
    const handleSave = async (params) => {
        handleSaveSelectedRowData();
    };

    //pop up cancel handler approve
    const handleCancel = async () => {
        return await outsideClickHandler();
    };

    //pop up cancel handler reject
    const handleCancelReject = async () => {
        return await outsideClickHandlerReject();
    };

    // popUp save btn handler reject
    const handleSaveReject = async (params) => {
        handleSaveSelectedRowDataReject();
    };

    const helpOptions = {
        icon: HelpIcons,
        onClick: async () => {
            //showPopupHandler();
        },
    };


    //when approve popup save btn clicked
    const handleSaveSelectedRowData = () => {
        setSelectedRowKeys(selectedRowKeysOnChangeApprove);
        console.log(selectedRowsDataApprove);
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

    const SearchHandler = async () => {
        if (detailQRCodeID) {
            var reqBody = {
                headerQRCodeID: headerQRCodeID,
                docEntry: docEntry,
                detailQRCodeID: detailQRCodeID,
            };
            var response = await validatePoListsIQC(reqBody);

            console.log("response : ", response);
            var doProuctExist;
            if (IQCList.size > 0) {
                doProuctExist = false;
                IQCList.forEach((value) => {
                    console.log(value);
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
            return toastDisplayer("error", "Please type/scan Item");
        }
    };

    const handleTextValueChange = (e) => {
        // console.log(e.value);
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

    // approve -- called after handleDataGridRowSelectionApprove
    const selectedRowSetter = async (params) => {
        setSelectedRowData(params);
        return handleQCPoSelection(params);
    };

    const handleQCPoSelection = (params) => {
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

    //when select any row of reject popup this will called
    const handleDataGridRowSelectionReject = async ({ selectedRowKeys }) => {
        // console.log(selectedRowKeys);
        setSelectedRowKeysOnChangeReject(selectedRowKeys);
        const length = await selectedRowKeys.length;
        if (selectedRowKeys.length > 1) {
            const value = await dataGridRef.current.instance.selectRows(
                selectedRowKeys[length - 1]
            );
            return selectedRowSetterReject(value);
        } else {
            const value = await dataGridRef.current.instance.selectRows(
                selectedRowKeys[0]
            );
            return selectedRowSetterReject(value);
        }
    };

    const handleDataGridRowSelection = async ({ selectedRowKeys }) => {
        setSelectedRowKeysOnChangeApprove(selectedRowKeys);
        const length = await selectedRowKeys.length;
        if (selectedRowKeys.length == 1) {
            if (selectedRowsDataApprove.length > 0 && selectedRowsDataReject.length > 0) {
                setQrRequestPopUp(true);
                IQCList.forEach((item) => {
                    if (item.itemCode == selectedRowKeys[0]) {
                        setQrRequestData(item);
                    }
                });
            } else {
                return toastDisplayer(
                    "error",
                    "Please select warehouse"
                );
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
                        <InprocessQcPopUp
                            title={"Approved Warehouse"}
                            caption={"Search the warehouse"}
                            handleCancel={handleCancel}
                            handleSave={handleSave}
                            apiCallFun={LockedWareHouseList()}
                            keyExpr={"whsCode"}
                            columns={column}
                            handleDataGridRowSelection={handleDataGridRowSelectionApprove}
                            dataGridRef={dataGridRef}
                            selectedRowKeys={selectedRowKeys}
                        />
                    )}
                >
                    <h1>hello</h1>
                </Popup>
            )}

            {RejectWareHouse && (
                <Popup
                    visible={true}
                    height={window.innerHeight - 100}
                    showCloseButton={true}
                    hideOnOutsideClick={outsideClickHandlerReject}
                    className="purchaseOrderList"
                    contentRender={() => (
                        <InprocessQcPopUp
                            title={"Rejected Warehouse"}
                            caption={"Rejected the warehouse"}
                            handleCancel={handleCancelReject}
                            handleSave={handleSaveReject}
                            apiCallFun={LockedWareHouseList()}
                            keyExpr={"whsCode"}
                            columns={column}
                            handleDataGridRowSelection={handleDataGridRowSelectionReject}
                            dataGridRef={dataGridRef}
                            selectedRowKeys={selectedRowKeysReject}
                        />
                    )}
                >
                    <h1>hello</h1>
                </Popup>
            )}
            <div className="main-section-scan-item">
        <div className="inputWrapper-scan-item">
          <div className="date-section">
            <DateBox
              className="dx-field-value"
              placeholder="From"
              stylingMode="outlined"
              type="date"
              // width={150}
            />
            <DateBox
              className="dx-field-value"
              placeholder="To"
              stylingMode="outlined"
              type="date"
              // width={150}
            />
            
          </div>
          <div className="txtBtn-section">
              <TextBox
                className="dx-field-value purchaseQRField"
                stylingMode="outlined"
                placeholder="Type the purchase QR code"
                width={230}
                onValueChanged={handleTextValueChange}
                showClearButton={true}
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
                />
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
                        keyExpr={"itemCode"}
                        showBorders={true}
                        columnAutoWidth={true}
                        hoverStateEnabled={true}
                        onSelectionChanged={handleDataGridRowSelection}
                        ref={dataGridRefList}
                    // selectedRowKeys={selectedRowKeysNew}
                    >
                        {/* <SearchPanel visible={true} /> */}
                        <Selection mode="multiple" />
                        <Scrolling columnRenderingMode="infinite" />
                        <Paging enabled={false} />
                        {columns &&
                            columns.map((value, key) => (
                                <Column
                                    dataField={value["field"]}
                                    caption={value["caption"]}
                                    hidingPriority={6}
                                ></Column>
                            ))}
                    </DataGrid>
                </div>
            )}
            {QrRequestPopUp && (
                <Popup
                    visible={true}
                    height={window.innerHeight - 100}
                    width={window.innerWidth - 925}
                    showCloseButton={true}
                    className="QrRequestPopUp"
                    hideOnOutsideClick={false}
                    contentRender={() => (
                        <InprocessQrRequest
                            handleCancelQrRequest={handleCancelQrRequest}
                            requestData={QrRequestData}
                            approveWareHouse={selectedRowsDataApprove[0].whsCode}
                            rejectWareHouse={selectedRowsDataReject[0].whsCode}
                        />
                    )}
                >
                </Popup>
            )}
        </>
    );
}

export default InprocessQcScanItem;
