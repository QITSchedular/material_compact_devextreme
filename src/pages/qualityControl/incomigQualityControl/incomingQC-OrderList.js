import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";
import { QtcDataGrid } from "../../../components";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    caption: "Vendor Code",
    field: "cardCode",
  },
  {
    caption: "Vendor Ref No.",
    field: "cardCode",
  },
  {
    caption: "Vendor Name",
    field: "cardName",
  },
  {
    caption: "Doc Series",
    field: "series",
  },
  {
    caption: "Doc No.",
    field: "docNum",
  },
  {
    caption: "Doc Date",
    field: "docDate",
  },
  {
    caption: "Post Date",
    field: "postDate",
  },
  // {
  //   caption: "Project",
  //   field: "project",
  // },
  // {
  //   caption: "Remark",
  //   field: "project",
  // },
  {
    caption: "Doc Entry",
    field: "docEntry",
  },
];

var customers = [];

function IncomingQCOrderList({ IQCList2 }) {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const handleProceed = (headerQRCodeID,docEntry) => {
    return navigate(
      `/qualityControl/incomigQualityControl/IncomingQcScanItemsPage/${headerQRCodeID}/${docEntry}`
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
    // console.log("data",response);
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
        // setData(jsonData); // Store the array of objects in the state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch and update data
  }, [IQCList2]); // Empty dependency array means this effect runs once after initial render

  return (
    <>
      {IQCList2.size > 0 && (
        <div className="po-list-section">
          {[...IQCList2].map((item, index) => (
            <div key={index} className="single-po">
              <div className="single-po1">
                <div className="single-po-delete">
                  <Button icon="trash"></Button>
                </div>
                <div className="single-po-name">
                  <span className="po-name">{item["headerQRCodeID"]}</span>
                  <Button
                    icon="custom-chevron-down-icon"
                    onClick={() => handleShowRealtiveDataGrid(item["docEntry"])}
                  ></Button>
                </div>
                <div className="single-po-proceed">
                  <Button
                    text="Proceed"
                    onClick={() => handleProceed(item["headerQRCodeID"],item["docEntry"])}
                  ></Button>
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

export default IncomingQCOrderList;
