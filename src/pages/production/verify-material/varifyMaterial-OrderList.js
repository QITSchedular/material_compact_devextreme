import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";
import { QtcDataGrid } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "../../../utils/media-query";

const columns = [
  {
    caption: "Doc Num",
    field: "docNum",
  },
  {
    caption: "Series",
    field: "series",
  },
  {
    caption: "Series Name",
    field: "seriesName",
  },
  {
    caption: "Item Code",
    field: "itemCode",
  },
  {
    caption: "Product Name",
    field: "prodName",
  },
  {
    caption: "Comments",
    field: "comments",
  },
  {
    caption: "Priority",
    field: "priority",
  },
  {
    caption: "Type",
    field: "type",
  },
  {
    caption: "Start Date",
    field: "startDate",
  },
  {
    caption: "Due Date",
    field: "dueDate",

  },
];
var customers = [];


function VerifyMaterialOrderList({ IQCList2, deleteItem }) {
  const screenSize = useScreenSize();
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const handleProceed = (itemCode, docNum) => {
    return navigate(
      `/production/verify-material/varify-material-scanItemPage/${itemCode}/${docNum}`
    );
  };

  const findObjectByUniqueCode = (uniqueCode) => {
    for (const obj of IQCList2) {
      if (obj.docEntry === uniqueCode) {
        return obj; // Return the object if the unique code matches
      }
    }
    return null; // Return null if no object with the unique code is found
  };

  const handleShowRealtiveDataGrid = (qrCode) => {
    setData((prevData) => ({
      ...prevData,
      [qrCode]: !prevData[qrCode], // Toggle the value
    }));
    customers = findObjectByUniqueCode(qrCode);
  };

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchData = async () => {
      try {
        const newData = {};
        [...IQCList2].forEach((item) => {
          var qrCode = item["docEntry"];
          newData[qrCode] = false; // Set initial value to false
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch and update data
  }, [IQCList2]); // Empty dependency array means this effect runs once after initial render

  useEffect(() => {
    console.log("The current screensize", screenSize)
  }, [screenSize])
  return (
    <>
      {IQCList2.size > 0 && (
        <div className="po-list-section">
          {[...IQCList2].map((item, index) => (
            <div key={index} className="single-po">
              {console.log("hello", item)}
              <div className="single-po1">
                <div className="single-po-delete">
                  <Button icon="trash" onClick={() => { deleteItem(item["docNum"]) }}></Button>
                </div>
                <div className="single-po-name">
                  <span className="po-name">Item Code : {item["itemCode"]}</span>
                  <div className="doc-Num">
                    <span className="po-name">Doc No. : {item["docNum"]}</span>
                  </div>
                  <Button
                    icon="custom-chevron-down-icon"
                    onClick={() => handleShowRealtiveDataGrid(item["docEntry"])}
                  ></Button>
                </div>
                <div className="single-po-proceed">
                  <Button
                    height={35}
                    width={screenSize.isSmall || screenSize.isXSmall ? 35 : 120}
                    icon="arrowright"
                    onClick={() => { handleProceed(item["itemCode"], item["docEntry"]) }}
                    stylingMode="outlined"
                    text={screenSize.isSmall || screenSize.isXSmall ? "" : "Proceed"}
                  >
                  </Button>
                </div>
              </div>
              <div className="single-po2">
                {data[item["docEntry"]] && (
                  <div className="data-grid-drop-down">
                    <QtcDataGrid
                      columns={columns}
                      Data={[item]}
                      keyExpr="docEntry"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default VerifyMaterialOrderList;
