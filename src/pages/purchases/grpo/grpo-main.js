import React, { useEffect, useState } from "react";
import "./grpo-styles.scss";
import {
  TextBox,
  Button as NormalButton,
  Button as TextBoxButton,
} from "devextreme-react/text-box";
import { Button } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import { HelpIcons } from "./icons-exporter";
import { customers, generateData } from "./sample-data";
import DataGrid, {
  Pager,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import ScrollView from "devextreme-react/scroll-view";
import { getPoLists } from "../../../utils/gate-in-purchase";
import { TransformerLoader } from "../../../components/custom-loaders/CoinLoader";
import LoadPanel from "devextreme-react/load-panel";
import { toastDisplayer } from "../../../api/qrgenerators";
import { useNavigate } from "react-router-dom";

const PopupContent = ({ onSelectRow }) => {
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDataGridRowSelection = ({ selectedRowsData }) => {
    console.log(selectedRowsData);
    onSelectRow(selectedRowsData);
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
        <div className="responsive-paddings">
          <DataGrid
            dataSource={dataSource}
            keyExpr="docEntry"
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onSelectionChanged={handleDataGridRowSelection}
          >
            <Selection mode="single" />
            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>
        </div>
      )}
    </>
  );
};

const GrpoMain = () => {
  const [grpoList, setGrpoList] = useState(new Set()); // State to store the selected row data
  const [showPoHelp, setShowPoHelp] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // State to store the selected row data
  const [selectedPo, setSelectedPo] = useState(""); // State to store the selection indicator
  const [loading, setLoading] = useState(false); // State to store the selection indicator

  // get all the data
  const dataGridDataHandler = async (qrCode) => {
    setLoading(true);
    try {
      const poListData = await getPoLists();

      if (poListData.length > 0) {
        const qrCodeIds = poListData.map((item) => item.qrCodeID);
        const doPoExists = qrCodeIds.includes(qrCode);
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
  const outSideHandler = () => {
    setShowPoHelp(false);
    return true;
  };
  const helpOptions = {
    icon: HelpIcons,
    onClick: async () => {
      showPopupHandler();
    },
  };

  // Function to handle the selection and update the state
  const handleRowSelection = (selectedRows) => {
    setSelectedRowsData(selectedRows);
    outSideHandler();
  };
  // handle the search value change event

  const handleTextValueChange = (e) => {
    // console.log(e.previousValue);
    // console.log(e.value);
    return setSelectedPo(e.value);
  };

  // handle the hit search event
  const handlePoVerification = async (e) => {
    if (selectedPo) {
      const doPoExists = await dataGridDataHandler(selectedPo);
      if (grpoList.has(selectedPo)) {
        // Show an alert or a message to inform the user about the duplicate value
        alert("QR Code already exists in the list!");
      } else {
        // Add the selectedPo to the grpoList using the Set's add method
        setGrpoList((prevGrpoList) => new Set(prevGrpoList).add(selectedPo));
      }
      console.log("PO Exists:", doPoExists);
    } else {
      return toastDisplayer("error", "Please type/scan P.O");
    }
  };

  const navigate = useNavigate();
  const handleProceed = (qrCode) => {
    console.log(qrCode);
    return navigate(`/purchases/grpo/scanItems/${qrCode}`);
  };
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      {showPoHelp && (
        <Popup
          maxHeight={300}
          minWidth={300}
          maxWidth={720}
          visible={true}
          contentRender={() => (
            <PopupContent onSelectRow={handleRowSelection} />
          )}
          showCloseButton={true}
          hideOnOutsideClick={outSideHandler}
        />
      )}

      <div className="content-block dx-card responsive-paddings grpo-content-wrapper">
        <div className="title-section">
          <h3 className="title-name">Grpo</h3>
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
          </div>
        </div>

        {/* Tabs section */}
        {grpoList.size > 0 && (
          <div className="po-list-section">
            {[...grpoList].map((qrCode, index) => (
              <div key={index} className="single-po">
                <div className="single-po-delete">
                  <Button icon="trash"></Button>
                </div>
                <div className="single-po-name">
                  <span className="po-name">{qrCode}</span>
                </div>
                <div className="single-po-proceed">
                  <Button
                    text="Proceed"
                    onClick={() => handleProceed(qrCode)}
                  ></Button>
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
