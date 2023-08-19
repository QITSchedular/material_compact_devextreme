import React from 'react'
import { Button, DataGrid } from 'devextreme-react'
import {
  Column,
  Editing,
  Export,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection
} from 'devextreme-react/data-grid'
// import { AppContext } from "../../contexts/dataContext";
const allowedPageSizes = [10, 20, 30]

function QtcDataGrid ({ columns, Data, keyExpr }) {
  // const [itemsData, setItemsData] = useState([]);
  // const { isItemAdded, revertIsItemAdded } = useContext(AppContext);

  // useEffect(() => {
  //     const getData = async () => {
  //         const allItemsData = await getMasterData(masterType);
  //         setItemsData(allItemsData.reverse());
  //     }
  //     getData();
  // }, [isItemAdded]);

  // useEffect(() => {
  //     const getData = async () => {
  //         if (isItemAdded) {
  //             const allItemsData = await getMasterData(masterType);
  //             setItemsData([allItemsData[0], ...itemsData]);
  //             revertIsItemAdded();
  //         }
  //     }
  //     getData();
  // }, [isItemAdded]);

  return (
    <>
      <DataGrid
        dataSource={Data}
        keyExpr={keyExpr}
        showBorders={true}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        className='items-master-datagrid'
      >
        <Scrolling columnRenderingMode='virtual' />
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
          allowedPageSizes={allowedPageSizes}
        />
        <Selection mode='multiple' />
        {columns.map((value, key) => (
          <Column
            dataField={value['field']}
            caption={value['caption']}
            hidingPriority={6}
          />
        ))}
      </DataGrid>
    </>
  )
}

export default QtcDataGrid
