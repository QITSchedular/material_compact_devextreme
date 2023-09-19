import React, { useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../../components/typographyTexts/TypographyComponents";
import { Button, DataGrid, Popup, ScrollView } from "devextreme-react";
import { SearchPanel, Selection } from "devextreme-react/data-grid";
import "./generate-receipt.styles.scss";

const PopUpContent = ({
  poGridDataSource,
  userSelectedGridRow,
  setUserSelectedGridRow,
  gridRowSelectSaveHandler,
  proHelpCloser,
}) => {
  const dataGridRef = useRef();

  /*--------- Grid single selection bypasser-------------------------------*/
  const selectedRowSetter = async (params) => {
    await setUserSelectedGridRow(params);
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
  };
  /*--------- Grid single selection bypasser-------------------------------*/
  const handleSaveSelection = async () => {
    const selectedRow = await userSelectedGridRow;
    gridRowSelectSaveHandler(selectedRow);
    proHelpCloser();
  };

  const [popupVisible, setPopupVisible] = useState(true);

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {popupVisible && (
        <ScrollView height="100%" width="100%">
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
              <Button icon="close" onClick={handleClosePopup} />
            </div>
          </div>

          <div className="responsive-paddings">
            <DataGrid
              className="transporter-data-grid"
              height={"50%"}
              dataSource={poGridDataSource}
              keyExpr={"proOrdDocEntry"}
              showBorders={true}
              columnAutoWidth={true}
              hoverStateEnabled={true}
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
              onClick={handleClosePopup}
            />
            <Button
              text="OK"
              type="default"
              width={124}
              height={35}
              className="default-button"
              onClick={handleSaveSelection}
            // disabled={selectedRowKeys.length > 1 ? false : true}
            // disabled={isOKButtonDisabled}
            />
          </div>
        </ScrollView>
      )}
    </>
  );
};

const GenerateReceiptProPopup = ({
  poGridDataSource,
  userSelectedGridRow,
  setUserSelectedGridRow,
  gridRowSelectSaveHandler,
  proHelpCloser,
}) => {
  return (
    <Popup
      visible={true}
      showTitle={false}
      height={"80%"}
      className="generate-receipt-pro-popup"
      contentRender={() => (
        <PopUpContent
          poGridDataSource={poGridDataSource}
          userSelectedGridRow={userSelectedGridRow}
          setUserSelectedGridRow={setUserSelectedGridRow}
          gridRowSelectSaveHandler={gridRowSelectSaveHandler}
          proHelpCloser={proHelpCloser}
        />
      )}
    ></Popup>
  );
};

export default GenerateReceiptProPopup;
