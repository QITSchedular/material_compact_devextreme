import React, { useState } from "react";

import { DataGrid, Tooltip } from "devextreme-react";
import { Button, Column, ColumnFixing } from "devextreme-react/data-grid";
import GenerateqrPopup from "./generate-receipt-generateqr-popup";
import { getAllProductionDetailsQr } from "../../../../api/production.generate.api";
import { toastDisplayer } from "../../../../api/qrgenerators";
import GenerateReceiptqrDisplayer from "./generate-receipt-qr-displayer";

const GeneratePrintDataGrid = ({ generateGridDataSource }) => {
  const [showGenerateQrPopup, setShowGenerateQrPopup] = useState(false);
  const [showDisplayQrPopup, setShowDisplayQrPopup] = useState(false);
  const [displayQrDataSoruce, setDisplayQrDataSoruce] = useState([]);
  const [userSelectedRow, setUserSelectedRow] = useState([]);

  const showQrHandler = async (e) => {
    const selectedRowDisplayQr = e.row.data;
    // alert("showQrHandler");
    const apiRes = await getAllProductionDetailsQr(selectedRowDisplayQr);
    console.log("The apiRes fro all items qr", apiRes);
    if (apiRes.hasError) {
      return toastDisplayer(
        "error",
        "No Qr to display, please Generate Qr first"
      );
    }
    setDisplayQrDataSoruce(apiRes.responseData);
    return setShowDisplayQrPopup(true);
  };
  const generatePopupCloser = () => {
    setShowGenerateQrPopup(false);
  };
  const generateQrHandler = (e) => {
    console.log(e.row.data);
    // alert("generateQrHandler");
    setUserSelectedRow(e.row.data);
    setShowGenerateQrPopup(true);
  };
  const displayQrCloser = () => {
    setShowDisplayQrPopup(false);
  };
  return (
    <>
      <div className="generate-receiptqr-datagrid">
        <DataGrid
          className="transporter-data-grid"
          height={"50%"}
          dataSource={generateGridDataSource}
          keyExpr={"recNo"}
          showBorders={true}
          columnAutoWidth={true}
          hoverStateEnabled={true}
        >
          <ColumnFixing enabled={true} />
          <Column
            dataField={"recNo"}
            caption={"Receipt No."}
            alignment={"left"}
          />
          <Column
            dataField={"receiptQty"}
            caption={"Receipt Quantity"}
            alignment={"left"}
          />
          <Column
            dataField={"whsCode"}
            caption={"Warehouse"}
            alignment={"left"}
          />
          <Column
            dataField={"recComment"}
            caption={"Comment"}
            alignment={"left"}
          />
          <Column
            dataField={"qrMngBy"}
            caption={"Qr Mng By"}
            alignment={"left"}
          />
          <Column
            type="buttons"
            caption={"Actions"}
            fixed={true}
            fixedPosition={"right"}
          >
            <Button
              hint={"Generate QR Code"}
              name="qrcode"
              icon={"fa-solid fa-qrcode"}
              visible={true}
              onClick={generateQrHandler}
              cssClass={"generate"}
            ></Button>
            <Button
              name="printqr"
              icon={"print"}
              visible={true}
              onClick={showQrHandler}
            />
          </Column>
        </DataGrid>
      </div>
      {showGenerateQrPopup && (
        <GenerateqrPopup
          generatePopupCloser={generatePopupCloser}
          userSelectedRow={userSelectedRow}
        />
      )}
      {showDisplayQrPopup && (
        <GenerateReceiptqrDisplayer
          displayQrDataSoruce={displayQrDataSoruce}
          displayQrCloser={displayQrCloser}
        />
      )}
    </>
  );
};

export default GeneratePrintDataGrid;
