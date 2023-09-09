import { Button, DataGrid, Popup } from "devextreme-react";
import React, { useState } from "react";
import { toastDisplayer } from "../../api/qrgenerators";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyTexts/TypographyComponents";
import QtcDataGrid from "../qtcCommonComponent/qtcDataGrid";
import "./items-master.scss";
function Template_PopUp({ isPopupVisible, handleClosePopUp, filefunction, handlesaveImportedFileData, dataSource, keyExpr, heading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isfileUpload, setFileUpdload] = useState(false);
  //console.log("dataSource : ", dataSource, " keyExpr : ", keyExpr);
  const handleFileChange = (file) => {
    const selectedFileType = file.target.files[0].type;
    if (
      selectedFileType == "text/csv" ||
      selectedFileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFileUpdload(true);
      setSelectedFile(file.target.files[0]);
      return filefunction(file);
    } else {
      return toastDisplayer("error", "Please select a CSV or XLSX file.");
    }
  }



  const handleFileDelete = () => {
    setFileUpdload(false);
    setSelectedFile(null);
  };

  const handleFileDownload = () => {
    const fileName = "test.xlsx";
    const filePath = `./${fileName}`; // Assuming the file is in the 'downloads' folder

    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filechkfunc = ()=>{
    // alert();
    return toastDisplayer("error", "Please select a CSV or XLSX file.");
  }
  return (
    <Popup
      maxWidth={850}
      height={500}
      visible={isPopupVisible}
      dragEnabled={false}
      hideOnOutsideClick={false}
      showCloseButton={true}
      shading={true}
      container=".dx-viewport"
      className="item-master-file-import-popup-container"
    >
      <div className="popup-header-item-master-import">
        <div>
          <PopupHeaderText text={heading} />
          <div className="filepopuptagline">
            <PopupSubText text={"Preferred CSV format"} />
          </div>
        </div>
        <div>
          <Button icon="close" onClick={handleClosePopUp} />
        </div>
      </div>
      <div className="filedatagrid">
        <DataGrid
          dataSource={dataSource}
          keyExpr={keyExpr}
          showBorders={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          columnHidingEnabled={false}
          className='items-master-datagrid'
        >
        </DataGrid>
      </div>
      <div className="mainContainerFileUpload">
        {/* <div className="fileuploader-container">
          <div className="file-formate-box">
            <p>CSV file required formate</p>
            <button
              type="button"
              className="file-action-btn"
              onClick={handleFileDownload}
            >
              Download
            </button>
          </div>
        </div> */}
        <div className="fileuploader-container">
          <div className="file-upload-box">
            <input
              type="file"
              id="fileupload"
              className="file-upload-input"
              onChange={handleFileChange}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <span>
              Drag and drop or{" "}
              <span className="file-link">browse your file</span>
            </span>
          </div>
          {selectedFile && (
            <div className="selected-file">
              <div className="file-image">
                <i className="far fa-file-alt"></i>
              </div>
              <div className="file-detail">
                <h6>{selectedFile.name}</h6>
                <p>
                  <span>Size: {selectedFile.size} bytes</span>
                </p>
                <div className="file-actions">
                  <button
                    type="button"
                    className="file-action-btn"
                    onClick={handleFileDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Datagrid */}
      </div>
      <div
        className="buttons-section"
        style={{ display: "flex", justifyContent: "flex-end", paddingRight: "1rem" }}
      >
        <Button
          text="Cancel"
          width={124}
          height={35}
          onClick={handleClosePopUp}
        />
        <Button
          text="Save"
          type="default"
          width={124}
          height={35}
          onClick={isfileUpload ? handlesaveImportedFileData : filechkfunc}
          className="OkQcBtn"
        // disabled={selectedRowKeys.length > 0 ? false : true}
        />
      </div>
    </Popup>
  );
}

export default Template_PopUp;
