import { Button, Popup, TextBox } from "devextreme-react";
import React, { useEffect, useRef, useState } from "react";
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
  isOKButtonDisabled,
  setOKButtonDisabled,
}) => {
  const dataGridRef = useRef();
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  /* The function to set the selected values of the datagrid*/
  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
  };
  const handleGridItemSelection = ({ selectedRowKeys }) => {
    console.log(selectedRowKeys);
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

  const handleClosePopUp = async () => {
    // const form = formPopup.current.instance;
    // form.resetValues();
    //return await closeCommonPopup();
  };

  const handleSaveSelection = async () => {
    await setInputPoValue(selectedRowData);
    return popUpOutsideClickHandler();
  };
  // select the row if input po value is already selected
  useEffect(() => {
    if (inputPoValue && inputPoValue.length > 0) {
      // Set the initially selected rows based on the inputPoValue prop
      const selectedRowKeys = poHelpDataSource
        .filter((item) => item.docEntry === inputPoValue[0].docEntry)
        .map((item) => item.docEntry);

      if (selectedRowKeys.length > 0) {
        dataGridRef.current.instance.selectRows(selectedRowKeys);
      }
    }
  }, [inputPoValue, poHelpDataSource]);

  // ... Rest of the code ...

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
      <div className="close-btn">
        <Button icon="close" onClick={popUpOutsideClickHandler} />
      </div>
      <div
        className="responsive-paddings production-content-datagrid-container"
        style={{ margin: "8px 24px", height: "100% !important" }}
      >
        <DataGrid
          height={window.innerHeight - 250}
          dataSource={poHelpDataSource}
          keyExpr={"docEntry"}
          showBorders={true}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          className="transporter-data-grid issuefrompro__prohelp--data-grid"
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
          // disabled={selectedRowKeys.length > 1 ? false : true}
          disabled={isOKButtonDisabled}
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
  const [isOKButtonDisabled, setOKButtonDisabled] = useState(true);
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
            isOKButtonDisabled={isOKButtonDisabled}
            setOKButtonDisabled={setOKButtonDisabled}
          />
        )}
      ></Popup>
    </>
  );
};

export default IssueMaterialPoHelpPopup;
