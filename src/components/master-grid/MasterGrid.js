import React, { useContext, useEffect, useState } from "react";
import { Button, DataGrid } from "devextreme-react";
import {
    Column,
    Editing,
    Export,
    Pager,
    Paging,
    Scrolling,
    SearchPanel,
    Selection,
} from "devextreme-react/data-grid";
import { getMasterData } from "../../utils/items-master-data";
import { AppContext } from "../../contexts/dataContext";
import { toastDisplayer } from "../../api/qrgenerators";
const allowedPageSizes = [10, 20, 30];

function MasterGrid({ columns, masterType, keyExpr }) {
    // const [itemsData, setItemsData] = useState();
    // const { isItemAdded, revertIsItemAdded } = useContext(AppContext);

    // useEffect(() => {
    //     const getData = async () => {
    //         const allItemsData = await getMasterData(masterType);
    //         setItemsData(allItemsData);
    //     }
    //     getData();
    // }, [isItemAdded]);

    // useEffect(() => {
    //     const getData = async () => {
    //        if(isItemAdded){
    //         const allItemsData = await getMasterData(masterType);
    //         setItemsData(allItemsData);
    //         revertIsItemAdded();
    //        }
    //     }
    //     getData();
    // }, [isItemAdded]);
    const [itemsData, setItemsData] = useState([]);
    const { isItemAdded, revertIsItemAdded } = useContext(AppContext);

    useEffect(() => {
        const getData = async () => {
            const allItemsData = await getMasterData(masterType);
            if (allItemsData.hasError) {
                // alert();
                return toastDisplayer("error", allItemsData.errorText);
            }
            if(allItemsData){
                return setItemsData(allItemsData.reverse());
            }
        }
        getData();
    }, [isItemAdded]);

    useEffect(() => {
        const getData = async () => {
            if (isItemAdded) {
                const allItemsData = await getMasterData(masterType);
                setItemsData([allItemsData[0], ...itemsData]);
                revertIsItemAdded();
            }
        }
        getData();
    }, [isItemAdded]);

    return (
        <>
            <DataGrid
                dataSource={itemsData}
                keyExpr={keyExpr}
                showBorders={true}
                focusedRowEnabled={true}
                defaultFocusedRowIndex={0}
                columnAutoWidth={true}
                columnHidingEnabled={true}
                className="items-master-datagrid"
            >
                <Editing
                    mode="row"
                    allowDeleting={true}
                    allowUpdating={true}
                    confirmDelete={true}
                    useIcons={true}
                />
                <Scrolling columnRenderingMode="virtual" />
                <Paging defaultPageSize={10} />
                <Pager
                    showPageSizeSelector={true}
                    showInfo={true}
                    showNavigationButtons={true}
                    allowedPageSizes={allowedPageSizes}
                />
                <SearchPanel visible={true} width={190} className={"search-panel"} />
                <Selection mode="multiple" />
                {columns.map((value, key) => (

                    (value["caption"] === "Actions") ?
                        <Column type="buttons" caption="Actions">
                            <Button name="delete" />
                            <Button name="save" />
                            <Button hint="Clone" icon="copy" />
                        </Column>
                        :
                        <Column
                            dataField={value["field"]}
                            caption={value["caption"]}
                            hidingPriority={6}
                        />

                ))}
                <Export enabled={true} allowExportSelectedData={true} />
            </DataGrid>
        </>
    )
}

export default MasterGrid