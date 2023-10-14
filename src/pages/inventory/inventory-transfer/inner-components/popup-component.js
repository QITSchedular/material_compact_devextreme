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
    console.log("params", params);
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
      console.log("selectedRowData", selectedRowData);
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
      case "From Bin":
        return setKeyExpr("absEntry");
      case "To Bin":
        return setKeyExpr("absEntry");
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
      <div style={{"display":"flex"}}>
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
        <div className="button-groups">
          <Button icon="close" onClick={popUpOutsideClickHandler} />
        </div>
      </div>

      {loading && <LoadPanel visible={true} shading={true} />}
      <div className="responsive-paddings transporter-content-datagrid-container">
        <DataGrid
          height={window.innerHeight - 310}
          dataSource={gridDataSourceList}
          keyExpr={keyExpr}
          showBorders={true}
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
        className="Btn-section responsive-paddings"
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
      height={window.innerHeight - 40}
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
