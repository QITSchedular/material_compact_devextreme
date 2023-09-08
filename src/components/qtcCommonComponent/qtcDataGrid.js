import React from 'react'
import { DataGrid } from 'devextreme-react'
import {
  Column,
  Pager,
  Paging,
  Scrolling,
  Button as DeleteButton,
  Selection,
  Editing
} from 'devextreme-react/data-grid'
const allowedPageSizes = [10, 20, 30]

function QtcDataGrid ({ columns, Data, keyExpr, onRowRemoved }) {
  return (
    <>
      {Data && (
        <DataGrid
          dataSource={Data}
          keyExpr={keyExpr}
          showBorders={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          columnHidingEnabled={false}
          className='items-master-datagrid'
          onRowRemoving={onRowRemoved}
        >
          <Scrolling columnRenderingMode='virtual' />
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
            allowedPageSizes={allowedPageSizes}
          />
          <Scrolling columnRenderingMode='virtual' />
          {onRowRemoved && <Editing mode='row' allowDeleting={true} />}
          <Selection mode='multiple' allowSelectAll={true} />
          {columns &&
            columns.map((value, key) => (
              <Column
                dataField={value['field']}
                caption={value['caption']}
                hidingPriority={6}
              >
                <DeleteButton icon='trash' />
              </Column>
            ))}
        </DataGrid>
      )}
    </>
  )
}
export default QtcDataGrid
