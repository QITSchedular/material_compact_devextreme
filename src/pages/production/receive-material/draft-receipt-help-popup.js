import { Button, DataGrid, Popup } from "devextreme-react";
import React, { useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import "./receive-material.styles.scss";
import {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
const PopUpContent = ({
  poHelpDataSource,
  popUpOutsideClickHandler,
  setSelectedPoToReceive,
  isOKButtonDisabled,
  setOKButtonDisabled,
}) => {
  const dataGridRef = useRef();
  const [selectedRowData, setSelectedRowData] = useState("");

  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
  };

  const handleGridItemSelection = ({ selectedRowKeys }) => {
    if (selectedRowKeys.length > 1) {
      const value = dataGridRef.current.instance.selectRows(
        selectedRowKeys[selectedRowKeys.length - 1]
      );

      selectedRowSetter(value);
    } else {
      const value = dataGridRef.current.instance.selectRows(selectedRowKeys[0]);
      selectedRowSetter(value);
    }
    setOKButtonDisabled(selectedRowKeys.length === 0);
  };

  const handleSaveSelection = async () => {
    // await setInputPoValue(selectedRowData);
    const data = await selectedRowData;
    setSelectedPoToReceive(data);
    return popUpOutsideClickHandler();
  };
  return (
    <>
      <div
        className="title-section responsive-paddings"
        style={{
          padding: "5px 20px !important",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <PopupHeaderText text={"Production Order List"} />
        <PopupSubText
          text={"Scroll through the list or type in the search box.."}
        />
        <div className="close-btn">
          <Button icon="close" onClick={popUpOutsideClickHandler} />
        </div>
        <div
          className="responsive-paddings draft-receipt-po-datagrid-container"
          style={{
            margin: "8px 0px",
            height: "100% !important",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          <DataGrid
            className="transporter-data-grid draft-receipt-po-datagrid-container"
            height={window.innerHeight - 250}
            dataSource={poHelpDataSource}
            keyExpr={"docEntry"}
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleGridItemSelection}
            // selectedRowKeys={selectedRowKeys}
            ref={dataGridRef}
          >
            <SearchPanel
              visible={true}
              highlightCaseSensitive={true}
              className={"search-panel"}
            />
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="virtual"></Scrolling>
            <Paging defaultPageSize={10} />
            <Column
              caption="Order Number"
              dataField={"docNum"}
              allowEditing={false}
            />
            <Column
              caption="Item Code"
              dataField={"itemCode"}
              allowEditing={false}
            />
            <Column
              caption="Production Code"
              dataField={"prodName"}
              allowEditing={false}
            />
            <Column
              caption="Series Number"
              dataField={"seriesName"}
              allowEditing={false}
            />
            <Column caption="Type" dataField={"type"} allowEditing={false} />
            <Column
              caption="Quantity"
              dataField={"quantity"}
              allowEditing={false}
            />
            <Column
              caption="Planned Quantity"
              dataField={"plannedQty"}
              allowEditing={false}
            />
            <Column
              caption="Completed Quantity"
              dataField={"cmpltQty"}
              allowEditing={false}
            />
            <Column
              caption="WareHouse"
              dataField={"warehouse"}
              allowEditing={false}
            />
            <Column
              caption="UOM Code"
              dataField={"uomCode"}
              allowEditing={false}
            />
          </DataGrid>
        </div>
        <div
          className="buttons-section responsive-paddings"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            text="Cancel"
            width={124}
            height={35}
            onClick={popUpOutsideClickHandler}
          />
          <Button
            text="OK"
            type="default"
            width={124}
            height={35}
            className="default-button"
            onClick={handleSaveSelection}
            // disabled={selectedRowKeys.length > 1 ? false : true}
            disabled={isOKButtonDisabled}
          />
        </div>
      </div>
    </>
  );
};

//Main PopUp Component: Parent
const DraftReceiptHelpPopup = ({
  setShowDraftReceiptPoHelpPopup,
  poHelpDataSource,
  setSelectedPoToReceive,
}) => {
  const [isOKButtonDisabled, setOKButtonDisabled] = useState(true);
  const popUpOutsideClickHandler = () => {
    setShowDraftReceiptPoHelpPopup(false);
  };
  return (
    <>
      <Popup
        visible={true}
        showTitle={false}
        height={window.innerHeight - 20}
        hideOnOutsideClick={popUpOutsideClickHandler}
        className="production__draft--receiptmaterial__purchaseOrderList"
        contentRender={() => (
          <PopUpContent
            // poHelpDataSource={poHelpDataSource}
            popUpOutsideClickHandler={popUpOutsideClickHandler}
            // inputPoValue={inputPoValue}
            // setInputPoValue={setInputPoValue}
            isOKButtonDisabled={isOKButtonDisabled}
            setOKButtonDisabled={setOKButtonDisabled}
            poHelpDataSource={poHelpDataSource}
            setSelectedPoToReceive={setSelectedPoToReceive}
          />
        )}
      ></Popup>
    </>
  );
};

export default DraftReceiptHelpPopup;
