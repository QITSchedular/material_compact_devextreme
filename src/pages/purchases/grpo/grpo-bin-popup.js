
import React, { useEffect, useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Scrolling,
  SearchPanel,
  ColumnChooser,
  Position,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { toastDisplayer } from "../../../api/qrgenerators";
import { wareHouseList } from "../../../utils/grpo-saver";

const BinChooserDataGrid = ({ handleSaveSelectedWarehouse,nonQcBinDataGridDataSource }) => {
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [wareHouseDataSource, setWareHouseDataSource] = useState([]);
  const dataGridRef = useRef();

  // Bypasses the multiple selection of the datagrid and gives the single selection
  const handleDataGridRowSelection = async (data) => {
    // data.selectedRowKeys, data.selectedRowsData
    if (data.selectedRowKeys.length > 0) {
      const value = await dataGridRef.current.instance.selectRows(
        data.selectedRowKeys[data.selectedRowKeys.length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        data.selectedRowKeys[data.selectedRowKeys.length - 1]
      );
      return selectedRowSetter(value);
    }
    // setSelectedItemKeys(data.selectedRowKeys);
  };

  // sets the selected rows data;
  const selectedRowSetter = async (params) => {
    await setSelectedItemKeys(params);
    console.log("selected warehouse details", params);
    return handleSaveSelectedWarehouse(params);
  };
  useEffect(() => {
    const getAllWarehouses = async () => {
      // const response = await wareHouseList();
      console.log("nonQcBinDataGridDataSource : ",nonQcBinDataGridDataSource);
      setWareHouseDataSource(nonQcBinDataGridDataSource);
    };
    getAllWarehouses();
  }, []);
  return (
    <DataGrid
    //   height={window.innerHeight = 380}
      height={window.innerHeight <= 650 ? 380 : 450}
      id="warehouse-chooser-grid-container"
      dataSource={wareHouseDataSource}
      showBorders={true}
      selectedRowKeys={selectedItemKeys}
      onSelectionChanged={handleDataGridRowSelection}
      ref={dataGridRef}
    >
      <Scrolling columnRenderingMode="virtual" />
      <Paging defaultPageSize={20} />
      <Selection mode="multiple" allowSelectAll={false} />
      <SearchPanel visible={true} />
      <ColumnChooser enabled={true}>
        <Position
          my="right top"
          at="right center"
          of="#warehouse-chooser-grid-container"
        />
      </ColumnChooser>
      <Column dataField="binCode" caption="Bin Code" />
      <Column dataField="absEntry" caption={"Bin Entry"} />
    </DataGrid>
  );
};

const GrpoBinChooserComponent = ({
  handleSaveSelectedWarehouse,
  handleCloseButton,
  dummyData
}) => {
  return (
    <div className="responsive-paddings grpo-warehouse-chooser-wrapper">
      <div
        className="header-section"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="header-title-section">
          <PopupHeaderText text={"Choose Bin"} />
        </div>
        <div className="header-close-button">
          <Button
            icon="close"
            height={34}
            width={34}
            onClick={handleCloseButton}
          />
        </div>
      </div>

      <div className="data-grid-container" style={{ maxHeight: "300px" }}>
        <BinChooserDataGrid
          handleSaveSelectedWarehouse={handleSaveSelectedWarehouse}
          nonQcBinDataGridDataSource={dummyData}
        />
      </div>
    </div>
  );
};

export default GrpoBinChooserComponent;
