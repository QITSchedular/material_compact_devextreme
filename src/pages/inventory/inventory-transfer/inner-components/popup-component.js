import { Button, DataGrid, LoadPanel, Popup } from "devextreme-react";
import React, { useEffect, useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../../components/typographyTexts/TypographyComponents";
import {
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";

const PopupHelpComponent = ({
  placeholder,
  popUpOutsideClickHandler,
  gridDataSourceList,
  onSelectAndClose,
}) => {
  const dataGridRef = useRef();
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [keyExpr, setKeyExpr] = useState("");
  const [loading, setLoading] = useState(false);

  /* The function to set the selected values of the datagrid*/
  const selectedRowSetter = (params) => {
    setSelectedRowData(params);
  };

  /* The function to by pass multiple selction*/
  const handleTransporterSelection = ({ selectedRowKeys }) => {
    if (selectedRowKeys.length > 1) {
      const value = dataGridRef.current.instance.selectRows(
        selectedRowKeys[selectedRowKeys.length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = dataGridRef.current.instance.selectRows(selectedRowKeys[0]);
      return selectedRowSetter(value);
    }
  };
  const handleSave = async () => {
    // onSelectAndClose(selectedRowData); // Pass selected value to the callback
    try {
      const selectedValue = await onSelectAndClose(selectedRowData);
      selectedRowSetter(selectedValue);
    } catch (error) {
      console.error("Error while selecting value:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    switch (placeholder) {
      case "From Warehouse":
        return setKeyExpr("whsCode");
      case "Two Warehouse":
        return setKeyExpr("whsCode");
      case "Get BP Details":
        return setKeyExpr("cardCode");
    }
    setLoading(false);
  }, []);
  // useEffect(() => {
  //   async function userSelectionResolver() {
  //     const data = await selectedRowData;
  //     // console.log(data);
  //   }
  //   userSelectionResolver();
  // }, [selectedRowData]);
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
        <PopupHeaderText text={placeholder} />
        <PopupSubText
          text={"Scroll through the list or type in the search box.."}
        />
      </div>
      {loading && <LoadPanel visible={true} shading={true} />}
      <div
        className="dx-card responsive-paddings transporter-content-datagrid-container"
        style={{ margin: "8px 24px", height: "100% !important" }}
      >
        <DataGrid
          height={window.innerHeight - 250}
          dataSource={gridDataSourceList}
          keyExpr={keyExpr}
          showBorders={false}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          className="transporter-data-grid testGrid"
          onSelectionChanged={handleTransporterSelection}
          selectedRowKeys={selectedRowKeys}
          ref={dataGridRef}
        >
          <SearchPanel
            visible={true}
            width={190}
            highlightCaseSensitive={true}
            className={"search-panel"}
          />
          <Selection mode="multiple" />
          <Scrolling columnRenderingMode="virtual" />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div
        className="buttons-section responsive-paddings"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {/* <Button text="Cancel" width={124} height={35} onClick={handleCancel} /> */}
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
          onClick={handleSave}
          disabled={selectedRowKeys.length > 0 ? false : true}
        />
      </div>
    </>
  );
};
const PopupComponent = ({
  popUpOutsideClickHandler,
  placeholder,
  gridDataSourceList,
  onSelectAndClose,
}) => {
  return (
    <Popup
      visible={true}
      height={window.innerHeight - 20}
      contentRender={() => (
        <PopupHelpComponent
          placeholder={placeholder}
          popUpOutsideClickHandler={popUpOutsideClickHandler}
          gridDataSourceList={gridDataSourceList}
          onSelectAndClose={onSelectAndClose}
        />
      )}
      showCloseButton={true}
      hideOnOutsideClick={popUpOutsideClickHandler}
    ></Popup>
  );
};

export default PopupComponent;
