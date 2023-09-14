import React, { useState, useContext, useEffect } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import PopupForm from "../../../components/popup-form/PopupForm";
import { AppContext } from "../../../contexts/dataContext";
import { getItemGroup } from "../../../utils/items-master-data";
import { toastDisplayer } from "../../../api/qrgenerators";
import ExcelJS from "exceljs";
// import "./item-sub-group.scss";
// import "../../../themes/custom-theme/dx.material-custom.scss"
// import "../../../themes/custom-theme/dx.custom-material.scss";
// import "../../../themes/custom-theme/dx.material-custom.css"
function Itemsubgroupmaster() {
  const [itemsGroupEditorOptions, setItemsGroupEditorOptions] = useState("");
  const [importedDataArray, setimportedDataArray] = useState([]);
  useEffect(() => {
    var getdata = async () => {
      const getItemGroupData = await getItemGroup();
      setItemsGroupEditorOptions(getItemGroupData);
    }
    getdata();
  }, [])
  const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
  const { openCommonPopup } = useContext(AppContext);

  const handleClick = () => {
    setShowItemGroupMasterBox(true);
    openCommonPopup();
  };
  const columns = [
    {
      caption: "Item Group Name",
      field: "itmsGrpNam",
    },
    {
      caption: "Item Sub Group",
      field: "itmsSubGrpNam",
    },
    {
      caption: "Locked",
      field: "locked",
    },
    {
      caption: "Actions",
      field: "",
    },
  ];
  const dataArray = [
    { feildType: "dxSelectBox", label: "Item Group Name ", isValidate: true, AllData: itemsGroupEditorOptions, dExpr: "itmsGrpNam", vExpr: "itmsGrpCod" },
    { feildType: "dxTextBox", label: "Item Sub Group", isValidate: true },
    { feildType: "dxCheckBox", label: "Locked", isValidate: false },
  ];

  // const keyArray = [
  //   "itmsGrpCod","itmsSubGrpNam","locked"
  // ];
  const keyArray = [
    { input: "itmsGrpCod" },
    { input: "itmsSubGrpNam" },
    { checkbox: "Locked" }
  ];

  const data = [{
    ItemGrpName: "Alphanumeric",
    ItemSubGrpName: "Alphanumeric",
    Locked: "Y/N",
  }]

  const handleFileUploaded = async (fileData) => {
    // console.log("fileData : ", fileData.target.files[0]);
    const file = fileData.target.files[0]; // Get the first file from the array

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
        console.log("importedDataArray " + i + " : ", importedDataArray[i])
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
            title={"Item Sub Group"}
            subtitle={"You are viewing the total number of sub item groups"}
            handleAddClick={handleClick}
            columns={columns}
            masterType={"ItemSubGroups"}
            keyExpr={"itmsSubGrpCod"}
            handleFileUploaded={handleFileUploaded}
            handlesaveImportedFileData={saveImportedFileData}
            data={data}
            key={"itmsSubGrpCod"}
            heading={"File input for Item Sub Group"}
          />
        </div>
      </div>
      {showItemGroupMasterBox && (
        <PopupForm
          title={"Item Sub Group Master"}
          field={dataArray}
          clientMasterType={"ItemSubGroups"}
          keyArray={keyArray}
        />
      )}
    </>
  );
}

export default Itemsubgroupmaster;