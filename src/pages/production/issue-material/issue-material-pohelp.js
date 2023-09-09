import { Button, Popup, TextBox } from "devextreme-react";
import React, { useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";

import DataGrid, {
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import "./issue-material-main.styles.scss";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";

const PopUpContent = ({
  poHelpDataSource,
  popUpOutsideClickHandler,
  inputPoValue,
  setInputPoValue,
}) => {
  const dataGridRef = useRef();
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  /* The function to set the selected values of the datagrid*/
  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
  };
  const handleGridItemSelection = ({ selectedRowKeys }) => {
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

  const handleSaveSelection = async () => {
    await setInputPoValue(selectedRowData);
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
        <PopupHeaderText text={"Choose a Production Order"} />
        <PopupSubText
          text={"Scroll through the list or type in the search box.."}
        />
      </div>
      <div
        className="dx-card responsive-paddings production-content-datagrid-container"
        style={{ margin: "8px 24px", height: "100% !important" }}
      >
        <DataGrid
          height={window.innerHeight - 250}
          dataSource={poHelpDataSource}
          keyExpr={"docEntry"}
          showBorders={false}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          className="transporter-data-grid testGrid"
          onSelectionChanged={handleGridItemSelection}
          // selectedRowKeys={selectedRowKeys}
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
          // disabled={selectedRowKeys.length > 0 ? false : true}
        />
      </div>
    </>
  );
};
const IssueMaterialPoHelpPopup = ({
  poHelpDataSource,
  setShowPoHelpPopup,
  inputPoValue,
  setInputPoValue,
}) => {
  const popUpOutsideClickHandler = () => {
    setShowPoHelpPopup(false);
  };
  return (
    <>
      <Popup
        visible={true}
        showTitle={false}
        height={window.innerHeight - 20}
        hideOnOutsideClick={popUpOutsideClickHandler}
        className="production__issuematerial--purchaseOrderList"
        contentRender={() => (
          <PopUpContent
            poHelpDataSource={poHelpDataSource}
            popUpOutsideClickHandler={popUpOutsideClickHandler}
            inputPoValue={inputPoValue}
            setInputPoValue={setInputPoValue}
          />
        )}
      ></Popup>
    </>
  );
};

export default IssueMaterialPoHelpPopup;
