import React, { useEffect, useState } from "react";
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  SearchPanel,
  Export,
  Selection,
} from "devextreme-react/data-grid";
import HeaderContent from "./headerContent";
// import "../../assets/css/dx.light.css";
import "./tasks.scss";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { getAllItems } from "../../utils/items-master-data";

export default function Task() {
  const [itemsData, setItemsData] = useState();

  useEffect(() => {
    const getData = async () => {
      // const allItemsData = await getAllItems();
      setItemsData(await getAllItems());
    };
    getData();
  }, []);

  return (
    <React.Fragment>
      <div
        className="content-block dx-card responsive-paddings"
        style={{
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <div className="content-blocks">
          <HeaderContent />
        </div>
        <DataGrid
          dataSource={itemsData}
          showBorders={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          columnHidingEnabled={true}
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <SearchPanel visible={true} stylingMode={"outlined"} width={150} />
          <Selection mode="multiple" />
          {/* <FilterRow visible={true} /> */}

          <Column dataField={"itemCode"} width={90} hidingPriority={2} />
          <Column
            dataField={"itemName"}
            width={190}
            caption={"Item Name"}
            hidingPriority={8}
          />
          <Column
            dataField={"itmsGrpNam"}
            caption={"Item Group Name"}
            hidingPriority={6}
          />
          <Column
            dataField={"itmsSubGrpNam"}
            caption={"Items Sub Group Name"}
            hidingPriority={5}
          ></Column>
          <Column
            dataField={"uomName"}
            caption={"Uom Name"}
            hidingPriority={7}
          />

          <Column
            dataField={"qrMngByName"}
            caption={"Qr Managed By"}
            hidingPriority={3}
          />
          <Column
            dataField={"itemMngByName"}
            caption={"Item Managed By"}
            hidingPriority={3}
          />
          <Column
            dataField={"isActive"}
            caption={"Is Active"}
            hidingPriority={7}
          />
          {/* <Column
            dataField={"Task_Due_Date"}
            caption={"Due Date"}
            dataType={"date"}
            hidingPriority={4}
          /> */}
          {/* <Column
            dataField={"Task_Priority"}
            caption={"Priority"}
            name={"Priority"}
            hidingPriority={1}
          /> */}
          {/* <Column
            dataField={"Task_Completion"}
            caption={"Completion"}
            hidingPriority={0}
          /> */}
          <Export enabled={true} allowExportSelectedData={true} />
        </DataGrid>
      </div>
    </React.Fragment>
  );
}

const dataSource = {
  store: {
    type: "odata",
    key: "Task_ID",
    url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks",
  },
  expand: "ResponsibleEmployee",
  select: [
    "Task_ID",
    "Task_Subject",
    "Task_Start_Date",
    "Task_Due_Date",
    "Task_Status",
    "Task_Priority",
    "Task_Completion",
    "ResponsibleEmployee/Employee_Full_Name",
  ],
};

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 },
];
