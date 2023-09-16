import { DataGrid, LoadPanel } from "devextreme-react";
import {
  Button,
  Column,
  ColumnFixing,
  Editing,
  Export,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/dataContext";
import { addNewMasterItem, getAllItems } from "../../../utils/items-master-data";
import HeaderContent from "./headerContent";
import "./items-master.scss";
import { toastDisplayer } from "../../../api/qrgenerators";
import PrintQrPopUp from "../../../components/masters/print-qr-popup";
import ExcelJS from "exceljs";
const allowedPageSizes = [10, 20, 30];
export default function ItemsMaster() {
  const [itemsData, setItemsData] = useState("");
  const [itemQrCode, setItemQrCode] = useState("");
  const [showPrintPop, setShowPrintPop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState([]);
  const [importedDataArray, setimportedDataArray] = useState([]);
  const {
    isPopupVisible,
    isItemAdded,
    openPopup,
    closePopup,
    newItemIsAdded,
    revertIsItemAdded,
  } = useContext(AppContext);

  const handleClose = async () => {
    return setShowPrintPop(false);
  };
  // show the qrcode prrint popup
  const handleShowQrCodePrint = async (e) => {
    await setLoading(true);
    const { qrCodeId } = e.row.data;
    if (qrCodeId.length > 0) {
      await setItemQrCode(qrCodeId);
      await setShowPrintPop(true);
      await setSelectedRowDetails(e.row.data);
      await setLoading(false);
    } else {
      toastDisplayer("error", "Something went wrong, please try again later");
      return setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const allItemsData = await getAllItems();
      setItemsData(allItemsData);
    };
    getData();
  }, []);
  useEffect(() => {
    const setDataAgain = async () => {
      if (isItemAdded) {
        const allItemsData = await getAllItems();
        setItemsData(allItemsData);
        revertIsItemAdded();
      }
    };
    setDataAgain();
  }, [isItemAdded]);

  const handleFileUploaded = async (fileData) => {
    // console.log("fileData : ", fileData.target.files[0]);
    const file = fileData.target.files[0]; // Get the first file from the array
    // console.log("file ", file);

    const wb = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.readAsArrayBuffer(file); // Use the extracted file here
    reader.onload = () => {
      const buffer = reader.result;
      wb.xlsx.load(buffer).then((workbook) => {
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow(async (row, rowIndex) => {
            var importedData = {};
            if (rowIndex !== 1) {
              const rowData = row.values;
              importedData = {
                itemCode: rowData[1].toString(),
                itemName: rowData[2],
                itmsGrpCod: rowData[3],
                itmsSubGrpCod: rowData[4],
                uomEntry: rowData[5],
                qrMngBy: rowData[6],
                itemMngBy: rowData[7],
                isActive: rowData[8],
                atcEntry: rowData[9],
              };
              // console.log("importedData", importedData);
              importedDataArray.push(importedData);
            }
          });
        });
      });
      console.log("importedDataArray : ", importedDataArray);
    };
  };

  const saveImportedFileData = async () => {
    if (importedDataArray.length !== 0) {
      for (var i = 0; i < importedDataArray.length; i++) {
        try {
          const response = await addNewMasterItem(importedDataArray[i], "Items");

          if (response.statusCode === "200") {
            newItemIsAdded();
          }

          // await showToastNotifications(response);

        } catch (error) {
          console.log(error);
        }
        // console.log("importedDataArray " + i + " : ",importedDataArray[i])
      }
    } else {
      return toastDisplayer("error", "No data found..!!");
    }
  };

  const data = [{
    ItemName: "String",
    ItemCode: "Numeric",
    ItemGroup: "Alphanumeric",
    ItemSubGroup: "Alphanumeric",
    UOM: "Alphanumeric",
    ItemManagedBy: "String",
    QrManagedBy: "String",
    OnHand: "Integer",
  }]

  return (
    <React.Fragment>
      <>
        {showPrintPop && (
          <PrintQrPopUp
            itemQrCode={itemQrCode}
            handleClose={handleClose}
            showPrintPop={showPrintPop}
            selectedRowDetails={selectedRowDetails}
          />
        )}
        {loading && <LoadPanel />}
        <div
          className="content-block dx-card responsive-paddings items-master-content-wrapper"
          style={{
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <div className="content-blocks">
            <HeaderContent handleFileUploaded={handleFileUploaded} handlesaveImportedFileData={saveImportedFileData} data={data} keyExpr={"ItemCode"} heading={"File input for Items Master"} />
          </div>
          {/* <div
          id="exportContainer"
          style={{ marginTop: "5px", marginBottom: "5px" }}
        >
          <Button text="Refresh" icon="refresh" />
        </div> */}
          <DataGrid
            dataSource={itemsData}
            keyExpr={"itemCode"}
            showBorders={true}
            focusedRowEnabled={true}
            defaultFocusedRowIndex={0}
            columnAutoWidth={true}
            columnHidingEnabled={false}
            className="items-master-datagrid"
          >
            <Scrolling columnRenderingMode="virtual" />
            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              showInfo={true}
              showNavigationButtons={true}
              allowedPageSizes={allowedPageSizes}
            />
            <Editing allowUpdating={true} allowDeleting={true} />
            <SearchPanel
              visible={true}
              width={190}
              className={"search-panel"}
            />
            <Selection mode="multiple" allowSelectAll={false} />
            <ColumnFixing enabled={true} />

            <Column dataField={"itemCode"} width={90} />
            <Column dataField={"itemName"} width={190} caption={"Item Name"} />
            <Column dataField={"itmsGrpNam"} caption={"Item Group Name"} />
            <Column
              dataField={"itmsSubGrpNam"}
              caption={"Items Sub Group Name"}
            ></Column>
            <Column dataField={"uomName"} caption={"Uom Name"} />

            <Column dataField={"qrMngByName"} caption={"Qr Managed By"} />
            <Column dataField={"itemMngByName"} caption={"Item Managed By"} />
            <Column dataField={"isActive"} caption={"Is Active"} />
            <Column
              type="buttons"
              width={110}
              caption={"Actions"}
              fixedPosition={"right"}
            >
              <Button name="edit" />
              <Button name="delete" />
              <Button
                hint="Print Qr"
                icon="fa-solid fa-print"
                visible={true}
                onClick={handleShowQrCodePrint}
              />
            </Column>
            <Export enabled={true} allowExportSelectedData={true} />
          </DataGrid>
        </div>
      </>
    </React.Fragment>
  );
}

// const itemQrCode =[{
//   headerQrCodeId:""
// }]
