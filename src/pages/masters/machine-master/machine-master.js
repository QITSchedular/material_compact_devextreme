import React, { useState, useContext, useEffect } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import PopupForm from "../../../components/popup-form/PopupForm";
import { AppContext } from "../../../contexts/dataContext";
import { getItemGroup } from "../../../utils/items-master-data";
import { toastDisplayer } from "../../../api/qrgenerators";
import ExcelJS from "exceljs";
import { PopUpCommonForm } from "../../../components";

// import "./item-sub-group.scss";
// import "../../../themes/custom-theme/dx.material-custom.scss"
// import "../../../themes/custom-theme/dx.custom-material.scss";
// import "../../../themes/custom-theme/dx.material-custom.css"
function Machinemaster() {
  const [itemsGroupEditorOptions, setItemsGroupEditorOptions] = useState("");
  const [importedDataArray, setimportedDataArray] = useState([]);
  useEffect(() => {
    var getdata = async () => {
      const getItemGroupData = await getItemGroup();
      setItemsGroupEditorOptions(getItemGroupData);
    };
    getdata();
  }, []);
  const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
  const { openCommonPopup } = useContext(AppContext);

  const handleClick = () => {
    setShowItemGroupMasterBox(true);
    openCommonPopup();
  };
  const columns = [
    {
      caption: "Machine",
      field: "itmsGrpNam",
    },
    {
      caption: "Warehouse",
      field: "itmsSubGrpNam",
    },
    {
      caption: "Description",
      field: "locked",
    },
    {
      caption: "Status",
      field: "locked",
    },
    {
      caption: "Date",
      field: "locked",
    },
    {
      caption: "Actions",
      field: "",
    },
  ];
  const dataArray = [
    { feildType: "dxTextBox", label: "Machine Name", isValidate: true },
    {
      feildType: "dxSelectBox",
      label: "Warehouse",
      isValidate: true,
      // ,AllData :qrManagedByOptions,dExpr:"qrMngByName" ,vExpr:"qrMngById" },
      AllData: "",
      dExpr: "",
      vExpr: "",
    },
    {
      feildType: "dxSelectBox",
      label: "Status",
      isValidate: true,
      // ,AllData :qrManagedByOptions,dExpr:"qrMngByName" ,vExpr:"qrMngById" },
      AllData: "",
      dExpr: "",
      vExpr: "",
    },
    { feildType: "dxDateBox", label: "If, not date", isValidate: false },
    // { feildType: "dxCheckBox", label: "Locked", isValidate: false },
  ];
  const dataArray1 = [
    // [{ feildType: "dxTextBox", label: "Machine Name", isValidate: true },{ feildType: "dxTextBox", label: "Machine Name", isValidate: true }],
    { feildType: "dxTextBox", label: "Machine Name", isValidate: true },
    {
      feildType: "dxSelectBox",
      label: "Warehouse",
      isValidate: true,
      // ,AllData :qrManagedByOptions,dExpr:"qrMngByName" ,vExpr:"qrMngById" },
      AllData: "",
      dExpr: "",
      vExpr: "",
    },
  ];
  const dataArray2 = [
    // [{ feildType: "dxTextBox", label: "Machine Name", isValidate: true },{ feildType: "dxTextBox", label: "Machine Name", isValidate: true }],
    {
      feildType: "dxSelectBox",
      label: "Status",
      isValidate: true,
      // ,AllData :qrManagedByOptions,dExpr:"qrMngByName" ,vExpr:"qrMngById" },
      AllData: "",
      dExpr: "",
      vExpr: "",
    },
    { feildType: "dxDateBox", label: "If, not date", isValidate: false },

  ];
  const dataArray3 = [
    // [{ feildType: "dxTextBox", label: "Machine Name", isValidate: true },{ feildType: "dxTextBox", label: "Machine Name", isValidate: true }],
    { feildType: "dxTextArea", label: "Description", isValidate: false },
  ];

  // const keyArray = [
  //   "itmsGrpCod","itmsSubGrpNam","locked"
  // ];
  const keyArray = [
    { input: "itmsGrpCod" },
    { input: "itmsSubGrpNam" },
    { checkbox: "Locked" },
  ];

  const data = [{
    MachineName: "String",
    Warehouse: "Alphanumeric",
    Status: "String",
    Date: "Date",
    Description: "Alphanumeric",
  }]

  const handleFileUploaded = async (fileData) => {
    // console.log("fileData : ", fileData.target.files[0]);
    const file = fileData.target.files[0]; // Get the first file from the array
    // console.log("file ", file);

    const wb = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.readAsArrayBuffer(file); // Use the extracted file here
    reader.onload = () => {
      const buffer = reader.result;
      wb.xlsx.load(buffer).then((workbook) => {
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow(async (row, rowIndex) => {
            var importedData = {};
            if (rowIndex !== 1) {
              const rowData = row.values;
              importedData = {
                itemCode: rowData[1].toString(),
                itemName: rowData[2],
                itmsGrpCod: rowData[3],
                itmsSubGrpCod: rowData[4],
                uomEntry: rowData[5],
                qrMngBy: rowData[6],
                itemMngBy: rowData[7],
                isActive: rowData[8],
                atcEntry: rowData[9],
              };
              // console.log("importedData", importedData);
              importedDataArray.push(importedData);
            }
          });
        });
      });
      console.log("importedDataArray : ", importedDataArray);
    };
  };

  const saveImportedFileData = async () => {
    if (importedDataArray.length !== 0) {
      for (var i = 0; i < importedDataArray.length; i++) {
        //  try {
        //       const response = await addNewMasterItem(importedDataArray[i],"Items");

        //       if (response.statusCode === "200") {
        //         newItemIsAdded();
        //       }

        //       // await showToastNotifications(response);

        //     } catch (error) {
        //       console.log(error);
        //     }
        console.log("importedDataArray " + i + " : ", importedDataArray[i]);
      }
    } else {
      return toastDisplayer("error", "No data found..!!");
    }
  };
  return (
    <>
      <div className="content-block dx-card responsive-paddings">
        <div cssClass=".temp123" className="content-blocks">
          <MastersHeaderContent
            title={"Machine"}
            subtitle={"You are viewing the total number of machines"}
            handleAddClick={handleClick}
            columns={columns}
            masterType={""}
            // masterType={"ItemSubGroups"}
            keyExpr={""}
            // keyExpr={"itmsSubGrpCod"}
            handleFileUploaded={handleFileUploaded}
            handlesaveImportedFileData={saveImportedFileData}
            data={data}
            key={""}
            heading={"File input for Machine"}
          />
        </div>
      </div>

      {showItemGroupMasterBox && (
        <PopUpCommonForm
          title={"Machine Master"}
          field={dataArray1}
          field1={dataArray2}
          field2={dataArray3}
          // clientMasterType={"ItemSubGroups"}
          clientMasterType={""}
          keyArray={keyArray}
        />
      )}
    </>
  );
}

export default Machinemaster;
