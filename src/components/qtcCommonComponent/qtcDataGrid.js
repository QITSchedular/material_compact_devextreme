import React, { useEffect, useState } from "react";
import { Button, DataGrid, LoadPanel } from "devextreme-react";
import {
    Column,
    Pager,
    Paging,
    Scrolling,
    Selection,
} from "devextreme-react/data-grid";
// import { AppContext } from "../../contexts/dataContext";
const allowedPageSizes = [10, 20, 30];

function QtcDataGrid({ columns, Data, keyExpr }) {
    const [gridDataSource, setGridDataSource] = useState([Data]);
    const [loading, setLoading] = useState(false);
    return (
        <>

            {
                gridDataSource &&
                <DataGrid
                    dataSource={Data}
                    keyExpr={`${keyExpr}`}
                    showBorders={true}
                    focusedRowEnabled={true}
                    defaultFocusedRowIndex={0}
                    columnAutoWidth={true}
                    columnHidingEnabled={true}
                    className="items-master-datagrid"
                >

                    <Scrolling columnRenderingMode="virtual" />
                    <Paging defaultPageSize={10} />
                    <Pager
                        showPageSizeSelector={true}
                        showInfo={true}
                        showNavigationButtons={true}
                        allowedPageSizes={allowedPageSizes}
                    />
                    <Selection mode="multiple" />
                    {columns.map((value, key) => (

                        <Column
                            dataField={value["field"]}
                            caption={value["caption"]}
                            hidingPriority={6}
                        />

                    ))}
                </DataGrid>

            }
        </>
    )
}

export default QtcDataGrid