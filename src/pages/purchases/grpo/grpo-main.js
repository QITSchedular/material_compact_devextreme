import React, { useEffect, useRef, useState } from "react";
import "./grpo-styles.scss";
import {
  TextBox,
  Button as NormalButton,
  Button as TextBoxButton,
} from "devextreme-react/text-box";
import { Button } from "devextreme-react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { HelpIcons } from "./icons-exporter";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import { getPoLists } from "../../../utils/gate-in-purchase";
import { TransformerLoader } from "../../../components/custom-loaders/CoinLoader";
import LoadPanel from "devextreme-react/load-panel";
import { toastDisplayer } from "../../../api/qrgenerators";
import { useNavigate } from "react-router-dom";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { GRPOScanner } from "../../../assets/icon";
import Html5QrcodePlugin from "./scanner/scanner-component";
import QtcDataGrid from "../../../components/qtcCommonComponent/qtcDataGrid";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

const PopupContent = ({ onSelectRow, onSave }) => {
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const dataGridRef = useRef();

  const handleDataGridRowSelection = async ({
    selectedRowKeys,
    selectedRowsData,
  }) => {
    // console.log(selectedRowsData);
    // onSelectRow(selectedRowsData);
    // console.log(selectedRowKeys);
    // console.log(selectedRowsData);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      // clear selection
      // console.log("Greater");
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetter(value);
    } else {
      const value = await dataGridRef.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetter(value);
    }
  };

  const selectedRowSetter = async (params) => {
    await setSelectedRowData(params);
    return onSave(params);
  };

  useEffect(() => {
    setLoading(true);
    const dataGridDataHandler = async () => {
      const poListData = await getPoLists();
      console.log(poListData);
      if (poListData.length > 0) {
        console.log("It has data");
        setDataSource(poListData);
        return setLoading(false); // Correct the state update to false
      } else {
        const { errorText } = poListData;
        return setError(errorText);
      }
    };
    setLoading(true);
    dataGridDataHandler();
  }, []);

  return (
    <>
      {error ? (
        <div
          className="loader-displayer"
          style={{
            margin: "50px",
            height: "200px",
            padding: "25px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="text-section">Data Could not be loaded..</div>
          <div className="text-section">Click outside to exit</div>
          <TransformerLoader />
        </div>
      ) : (
        <div className="responsive-paddings grpo-po-help-container">
          <div className="header-section">
            <PopupHeaderText text={"Purchase Order List"} />
            <PopupSubText text={"Search the purchase order"} />
          </div>
          <DataGrid
            height={"70vh"}
            dataSource={dataSource}
            keyExpr="docEntry"
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
            ref={dataGridRef}
          >
            <SearchPanel visible={true} />
            <Selection mode="multiple" />
            <Scrolling columnRenderingMode="infinite" />
            <Paging enabled={false} />
            <Column
              dataField="cardCode"
              alignment="left"
              caption={"Vendor Code"}
            />
            <Column
              dataField="cardName"
              alignment="left"
              caption={"Vendor Name"}
            />
            <Column dataField="docNum" alignment="left" caption={"PO No."} />
            <Column
              dataField="docDate"
              alignment="left"
              caption={"Doc Date"}
              dataType={"date"}
            />
          </DataGrid>
          <div className="buttons-section">
            {/* <Button text="Cancel" />
            <Button text="Save" /> */}
          </div>
        </div>
      )}
    </>
  );
};

const GrpoMain = () => {
  const [grpoList, setGrpoList] = useState(new Set()); // State to store the selected row data
  const [grpoList1, setGrpoList1] = useState(new Set()); // State to store the selected row data
  const [showPoHelp, setShowPoHelp] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // State to store the selected row data
  const [selectedPo, setSelectedPo] = useState(""); // State to store the selection indicator
  const [loading, setLoading] = useState(false); // State to store the selection indicator
  const [gridDataSourceForPopup, setGridDataSourceForPopup] = useState([]); // State to store the
  const [isSelectedFromPopup, setIsSelectedFromPopup] = useState(false); // State to store the
  const [showScanner, setShowScanner] = useState(false);
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };
  // toolbar button options
  const saveButtonOptions = {
    width: 120,
    height: 40,
    text: "Save",
    type: "default",
    stylingMode: "contained",
    onClick: () => handleSaveSelectedPo(),
  };
  const cancelButtonOptions = {
    width: 120,
    height: 40,
    text: "Cancel",
    type: "error",
    stylingMode: "contained",
    onClick: () => handleCancelNoSelection(),
  };
  // get all the data
  const dataGridDataHandler = async (qrCode) => {
    setLoading(true);
    try {
      const poListData = await getPoLists();
      if (poListData.length > 0) {
        const qrCodeIds = poListData.map((item) => item.qrCodeID);
        const filteredData = poListData.filter(
          (item) => item.qrCodeID == qrCode
        );

        console.log("filteredData : ", filteredData);
        console.log("poListData : ", poListData);
        console.log("qrCodeIds : ", qrCodeIds);
        
        setGrpoList1((prevGrpoList) => {
          const updatedSet = new Set(prevGrpoList);
          filteredData.forEach((response) => {
            updatedSet.add(response);
          });
          return updatedSet;
        });
        
        // const qrCodeIds = poListData.map((item) => item.qrCodeID);
        const doPoExists = qrCodeIds.includes(qrCode);
        console.log("doPoExists : ", doPoExists);
        setLoading(false);

        return doPoExists;
      } else {
        // setError("No data found");
        setLoading(false);
        toastDisplayer("error", "No matching P.O found, try again");
        return false;
      }
    } catch (error) {
      // setError("Error fetching data");
      setLoading(false);
      return false;
    }
  };

  const showPopupHandler = () => {
    // console.log("it is true to show");
    return setShowPoHelp(true);
  };
  const outSideHandler = (flag) => {
    if (flag) {
      console.log("You shsould close the window");
      setShowPoHelp(false);
      return true;
    }
  };

  // Function to handle the selection and update the state
  // const handleRowSelection = (selectedRows) => {
  //   console.log("From HandleRowSelection", selectedRows);
  //   setSelectedRowsData(selectedRows);
  //   outSideHandler();
  // };
  // handle the search value change event

  const handleTextValueChange = (e) => {
    // console.log(e.previousValue);
    console.log(e.value);
    return setSelectedPo(e.value);
  };

  // handle the hit search event
  const handlePoVerification = async (e) => {
    if (selectedPo) {
      const doPoExists = await dataGridDataHandler(selectedPo);
      // console.log("selectedPo : ",grpoList1);
      if (doPoExists && grpoList.has(selectedPo)) {
        // Show an alert or a message to inform the user about the duplicate value
        return toastDisplayer("error", "QR Code already exists in the list!");
      } else if (doPoExists && !grpoList.has(selectedPo)) {
        // Add the selectedPo to the grpoList using the Set's add method
        return setGrpoList((prevGrpoList) =>
          new Set(prevGrpoList).add(selectedPo)
        );
      } else if (!doPoExists) {
        return toastDisplayer(
          "error",
          "Invalid Grpo, please select a valid Grpo"
        );
      }
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };
  const [data, setData] = useState([]);
  // const handleShowRealtiveDataGrid = qrCode => {
  //   setData(prevData => ({
  //     ...prevData,
  //     [qrCode]: !prevData[qrCode]
  //   }))
  // }
  const handleShowPoDropDetails = (qrCode) => {
    // console.log("qrcode : ",qrCode);
    setData((prevData) => ({
      ...prevData,
      [qrCode]: !prevData[qrCode],
    }));
  };


  const navigate = useNavigate();
  const handleProceed = (qrCode) => {
    console.log(qrCode);
    return navigate(`/purchases/grpo/scanItems/${qrCode}`);
  };

  const handleGrpoPoSelection = (params) => {
    console.log("from the handleGrpoPoSelection", params);
    if (params.length > 0) {
      return setSelectedRowsData(params);
    }
  };
  const handleSaveSelectedPo = () => {
    console.log("The save button has been clicked");
    if (selectedRowsData.length > 0) {
      console.log("Current selected row data", selectedRowsData);
      console.log("Close the popup window");
      setIsSelectedFromPopup(false);
      return setShowPoHelp(false);
    } else {
      return toastDisplayer("error", "Please select a PO to save and proceed");
    }
  };
  const handleCancelNoSelection = () => {
    console.log("User have clicked the cancel buttpn, clear the selection");
    setSelectedRowsData([]);
    return setShowPoHelp(false);
  };

  // scanner handlers
  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };
  useEffect(() => {
    setLoading(true);
    const fetchAllPo = async () => {
      const poListData = await getPoLists();
      if (poListData.length > 0) {
        await setGridDataSourceForPopup(poListData);
        console.log(poListData);
      } else {
        toastDisplayer("error", "Something went wrong please tyr again later.");
      }
      return setLoading(false);
    };
    fetchAllPo();
  }, []);
  const [decodedResults, setDecodedResults] = useState([]);
  
  const onNewScanResult = (decodedText) => {
    alert("decodedText : ", decodedText);
    // console.log("App [result]", decodedResult);
    // setDecodedResults((prev) => [...prev, decodedResult]);
    console.log("decodedText : ", decodedText);
    setSelectedPo(decodedText);
  };

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      {showPoHelp && (
        <Popup
          visible={true}
          showCloseButton={true}
          contentRender={() => <PopupContent onSave={handleGrpoPoSelection} />}
                  >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={cancelButtonOptions}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={saveButtonOptions}
            cssClass={"tootlbar-save-button"}
          />
        </Popup>
      )}
      {
        showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="container"
            showScan={showScanner}
            HandleCloseQrScanner1={HandleCloseQrScanner}
          ></TransparentContainer>
        </div>
      )}
      <div className="content-block dx-card responsive-paddings grpo-content-wrapper">
        <div className="title-section">
          <span className="title-name">Grpo</span>
          <span className="title-description">
            Type or scan the purchase order to make an entry
          </span>
        </div>

        <div className="actions-section">
          <div className="search-section">
            <TextBox
              className="dx-field-value"
              stylingMode="outlined"
              placeholder="Search by purchase order"
              width={250}
              showClearButton={true}
              onValueChanged={handleTextValueChange}
              value={
                selectedRowsData.length > 0 ? selectedRowsData[0].qrCodeID : ""
              }
              // disabled={selectedRowsData.length > 0 ? false : true}
            >
              <TextBoxButton
                name="currency"
                location="after"
                options={helpOptions}
              />
            </TextBox>

            <Button
              width={33}
              height={33}
              type="normal"
              stylingMode="outlined"
              icon="search"
              onClick={handlePoVerification}
            />

            {/* {The scanner opener button} */}
            <Button
              width={33}
              height={33}
              type="normal"
              stylingMode="outlined"
              icon={GRPOScanner}
              onClick={handleScan}
            />
          </div>
        </div>

        {/* Tabs section */}
        {grpoList1.size > 0 && (
          <div className="po-list-section">
            {[...grpoList1].map((qrCode, index) => (
              <div key={index} className="single-po">
                <div className="single-po1">
                  <div className="single-po-delete">
                    <Button icon="trash"></Button>
                  </div>
                  <div className="single-po-name">
                    <span className="po-name">{qrCode["qrCodeID"]}</span>
                    <Button
                      icon="custom-chevron-down-icon"
                      onClick={() =>
                        handleShowPoDropDetails(qrCode["docEntry"])
                      }
                    ></Button>
                  </div>
                  <div className="single-po-proceed">
                    <Button
                      text="Proceed"
                      onClick={() => handleProceed(qrCode["qrCodeID"])}
                    ></Button>
                  </div>
                </div>
                <div className="single-po2">
                  {data[qrCode["docEntry"]] && (
                    <div className="data-grid-drop-down">
                      <QtcDataGrid Data={[qrCode]} keyExpr="docEntry" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GrpoMain;
