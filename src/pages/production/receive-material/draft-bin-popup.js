
import React, { useRef, useState } from "react";
import {
    PopupHeaderText,
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

const BinChooserDataGrid = ({
    handleSaveSelectedWarehouse, QcWareHouseBinData }) => {
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);
    const dataGridRef = useRef();

    const handleDataGridRowSelection = async (data) => {

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
    };


    const selectedRowSetter = async (params) => {
        await setSelectedItemKeys(params);
        console.log("selected warehouse details", params);
        handleSaveSelectedWarehouse(params);

        if (params.length > 0) {
            //setBinValue(params[0].binCode);
        }
    };
    return (
        <>
            <DataGrid
                height={window.innerHeight <= 650 ? 380 : 450}
                id="warehouse-chooser-grid-container"
                dataSource={QcWareHouseBinData}
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
                <Column dataField="absEntry" caption={"Bin Entry"} width={80} />
            </DataGrid>
        </>
    );
};

const DraftBinChooserComponent = ({
    handleSaveSelectedWarehouse,
    handleCloseButton,
    QcWareHouseBinData,
    setChosenBinValue  // Function to set the chosen bin value
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
                    QcWareHouseBinData={QcWareHouseBinData}
                    setChosenBinValue={setChosenBinValue}  // Pass the function to update the chosen bin value
                />
            </div>
        </div>
    );
};

export default DraftBinChooserComponent;
