import { TextBox, Button as NormalButton, Button } from "devextreme-react";
import React, { useRef, useState, useEffect } from "react";
import { GRPOScanner } from "../../../assets/icon";
import { toastDisplayer } from "../../../api/qrgenerators";
import {
  productionVarifyIssueSaveItems,
  validatePoListsVerifyMaterial,
} from "../../../utils/production-verify-material";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Scrolling,
  ColumnFixing,
  Editing,
  AsyncRule,
  ValidationRule,
  RequiredRule,
  SearchPanel,
} from "devextreme-react/data-grid";
import { SwalDisplayer } from "../../../utils/showToastsNotifications";
import { useParams } from "react-router-dom";

function Varify_Material_ScanItem() {
  var [detailQRCodeID, setdetailQRCodeID] = useState("");
  var [POCList, setPOCList] = useState(new Set());
  var [isGridVisible, setIsGridVisible] = useState(false);
  var [txtComment, setComment] = useState("");
  const dataGridRef = useRef();
  const { itemCode, docEntry } = useParams();
  const [isSearching, setIsSearching] = useState(false);

  const handleTextValueChange = (e) => {
    console.log(e.value);
    setdetailQRCodeID(e.value);
  };

  const SearchHandler = async () => {
    console.log(SearchHandler);
    if (detailQRCodeID.length > 0) {
      const existingItem = Array.from(POCList).find(
        (item) => item.qrCodeID === detailQRCodeID
      );

      if (existingItem) {
        // If the item already exists in POCList, you can show a message or choose to update it.
        // For example, you can update the quantity or any other relevant information.
        existingItem.issQty = (existingItem.issQty || 0) + 1; // Update quantity as needed
        setPOCList(new Set(POCList)); // Update the state
      } else {
        // If the item doesn't exist in POCList, make the API call
        const response = await validatePoListsVerifyMaterial(
          detailQRCodeID,
          docEntry
        );
        console.log("API Response:", response);

        if (response["hasError"]) {
          return toastDisplayer("error", response["errorText"]);
        }

        if (response) {
          response.forEach((resp) => {
            if (resp.issQty == null) {
              resp.issQty = 0;
            }
          });

          // Add the response data to POCList
          setPOCList((prevIQCList) => {
            const updatedSet = new Set(prevIQCList);
            response.forEach((resp) => {
              updatedSet.add(resp);
            });
            setIsGridVisible(true);
            return updatedSet;
          });
        } else {
          return toastDisplayer("error", "Something went wrong");
        }
      }
    } else {
      return toastDisplayer("error", "Please scan the item");
    }
  };
  useEffect(() => {
    console.log("POCList:", POCList);
  }, [POCList]);

  const asyncValidation = (params) => {
    const { value } = params;
    const { plannedQty, issuedQty, qrQty } = params.data;
    const totalReceivableQuantity = (
      parseFloat(plannedQty) - parseFloat(issuedQty)
    ).toFixed(6);

    return new Promise((resolve, reject) => {
      if (parseFloat(value) > totalReceivableQuantity) {
        return reject(
          `Total Receivable Quantity should be smaller than or Equal to: ${totalReceivableQuantity}`
        );
      } else {
        return resolve(value);
      }
    });
  };

  const handleValueChange = async (e) => {
    await setComment(e.value);
  };

  const getAllRowData = () => {
    if (dataGridRef.current) {
      const dataGridInstance = dataGridRef.current.instance;

      if (dataGridInstance) {
        const dataSource = dataGridInstance.getDataSource();

        // To get all row data, you can use the load() method of the dataSource
        return dataSource.load();
      }
    }

    return Promise.resolve([]); // Return an empty array if DataGrid is not available
  };

  const handleSaveItem = async () => {
    // var response = await validatePoListsVerifyMaterial(detailQRCodeID);
    const payload = await getAllRowData();
    const response = await productionVarifyIssueSaveItems(payload, txtComment);
    console.log("reshdfhfhjfhjhjhgfhgfkh", response);
    const dataGridInstance = dataGridRef.current.instance;
    if (response.errorMessage) {
      // dataGridRef.current.instance.refresh();
      return toastDisplayer("error", response.errorMessage);
    } else if (!response.hasError && response.responseData) {
      return SwalDisplayer("success", "Verfication Isssue Successful");
    } else {
      return toastDisplayer(
        "error",
        "Something went wrog please try again later"
      );
    }
    // if (dataGridRef.current) {
    // const dataGridInstance = dataGridRef.current.instance;

    // if (dataGridInstance) {
    // const payload = await getAllRowData();
    // const response = await productionVarifyIssueSaveItems(
    // payload,
    // txtComment
    // );
    // // console.log(response["hasError"]);
    // setPOCList(new Set());
    // payload.forEach(async (row) => {
    // console.log(row.detailQRCodeID)
    // var response = await validatePoListsVerifyMaterial(detailQRCodeID);
    // console.log(response)
    // setPOCList((prevIQCList) => {
    // const updatedSet = new Set(prevIQCList); // Create a new Set based on the previous Set
    // response.map((value) => {
    // console.log(value.issQty)
    // if (value.issQty == null) {
    // value.issQty = 0;
    // }
    // updatedSet.add(value);
    // })
    // setIsGridVisible(true);
    // return updatedSet; // Return the updated Set
    // });

    // })
    // setComment("");

    // // POCList.forEach((value) => {
    // // value.issuedQty=(parseFloat(value.issuedQty)+parseFloat(value.issQty)).toFixed(6);
    // // value.issQty=0;
    // // });

    // // console.log(POCList)
    // dataGridRef.current.instance.refresh();
    // if (response["hasError"]) {
    // SwalDisplayer("error", "Operation not Successful");
    // } else {
    // SwalDisplayer("success", "Operation Successful");
    // }
    // } else {
    // return toastDisplayer("error", "Something went wrong");
    // }
    // } else {
    // return toastDisplayer("error", "Something went wrong");
    // }
  };

  return (
    <>
      <div className="main-section-scan-item">
        <div className="inputWrapper-scan-item">
          <div className="txtBtn-section">
            <TextBox
              className="dx-field-value purchaseQRField"
              stylingMode="outlined"
              placeholder="Type the purchase QR code"
              width={230}
              height={40}
              valueChangeEvent="keyup"
              // value={
              // selectedRowsData.length > 0 ? selectedRowsData[0].itemCode : ""
              // }
              onValueChanged={handleTextValueChange}
              // onValueChanged={handleTextValueChange}
              showClearButton={true}
            ></TextBox>
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
              />
            </div>
          </div>
        </div>
      </div>
      {isGridVisible && (
        <div>
          <div className="orderList-section">
            <DataGrid
              // height={420}
              dataSource={Array.from(POCList)}
              keyExpr={"itemCode"}
              showBorders={true}
              columnAutoWidth={true}
              columnHidingEnabled={false}
              hoverStateEnabled={true}
              focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              // onSaving={handleGridSaving}
              // onSelectionChanged={handleDataGridRowSelection}
              ref={dataGridRef}
              // selectedRowKeys={selectedRowKeysNew}
            >
              {/* <Selection mode="single" /> */}
              <SearchPanel visible={true} />
              <Editing mode={"row"} allowDeleting={true} />
              <Selection mode="multiple" />
              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
              <ColumnFixing enabled={true} />
              <Column
                dataField="proOrdDocEntry"
                caption="docEntry"
                allowEditing={false}
                visible={true}
              ></Column>
              <Column
                dataField="docNum"
                caption="docNum"
                allowEditing={false}
              ></Column>
              <Column
                dataField="gateInNo"
                caption="gateInNo"
                allowEditing={false}
              ></Column>
              <Column
                dataField="qrCodeID"
                caption="detailQRCodeID"
                allowEditing={false}
              ></Column>
              <Column
                dataField="itemCode"
                caption="itemCode"
                allowEditing={false}
              ></Column>
              <Column
                dataField="itemName"
                caption="itemName"
                allowEditing={false}
              ></Column>
              <Column
                dataField="plannedQty"
                caption="plannedQty"
                allowEditing={false}
              ></Column>
              <Column
                dataField="issuedQty"
                caption="issuedQty"
                allowEditing={false}
              ></Column>
              <Column
                // dataField="docEntry"
                caption="Opened Qty"
                calculateCellValue={(rowData) =>
                  rowData.plannedQty - rowData.issuedQty
                }
                allowEditing={false}
                customizeText={(cellInfo) => {
                  // Customize the text here, for example, round to 2 decimal places
                  return cellInfo.value.toFixed(6); // Change the number of decimal places as needed
                }}
              ></Column>
              <Column
                dataField="batchSerialNo"
                caption="batchSerialNo"
                allowEditing={false}
              ></Column>
              <Column
                dataField="whsCode"
                caption="proWhsCode"
                allowEditing={false}
              ></Column>

              <Column
                dataField="issQty"
                caption="Issue Qty"
                // allowEditing={true}
              >
                {/* <RequiredRule /> */}
                <AsyncRule
                  // message="Quantity cannot exceed the available opened quantity"
                  validationCallback={asyncValidation}
                />
              </Column>

              <Column
                type="buttons"
                width={110}
                caption={"Actions"}
                fixedPosition={"right"}
              >
                {/* <Button name="edit" /> */}
                <Button name="delete" />
                <Button
                  hint="Print Qr"
                  icon="fa-solid fa-print"
                  visible={true}
                  // onClick={handleShowQrCodePrint}
                />
              </Column>
            </DataGrid>
          </div>
          <div className="comment-Section">
            <div
              className="particularDetail"
              style={{
                margin: "2rem 0rem 0.5rem 0rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextBox
                // className="dx-field-value"
                className="form-element"
                stylingMode="outlined"
                label={"Comment"}
                labelMode="floating"
                // width={160}
                showClearButton={true}
                onValueChanged={handleValueChange}
                value={txtComment}
              ></TextBox>

              <Button
                text="Issue"
                type="default"
                width={124}
                height={40}
                onClick={handleSaveItem}
                className="OkQcBtn"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Varify_Material_ScanItem;
