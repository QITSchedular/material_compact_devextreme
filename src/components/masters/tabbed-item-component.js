import React, { useEffect, useState } from "react";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/accordion";
import { DataGrid } from "devextreme-react";
import { employee } from "./data";
import Attachmentlogo from "../../assets/images/add-img.svg";
import { getAllWarehouseData, getAllWarehouseData_new } from "../../utils/items-master-data";
import { Selection } from "devextreme-react/data-grid";
const TabbedItemComponent = () => {
  //states
  const [warehouses, setWarehouses] = useState("");
  const [attachment, setAttachment] = useState(Attachmentlogo);
  //handle Selected row data
  const onSelectionChanged = ({ selectedRowsData }) => {
    //fill the bin data according to the selected warehouse
    console.log(selectedRowsData);
    console.log("selectedRowsData");
  };

  //handle file changes
  const handleFileInputClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const filePreview = event.target.result;
        // Perform actions with the file preview, such as displaying it
        console.log(filePreview);
        setAttachment(filePreview);
      };
      reader.readAsDataURL(file);
    }
  };
  //api calls for initial Fields
  useEffect(() => {
    const fetchData = async () => {
      const responseData = await getAllWarehouseData_new();
      await setWarehouses(responseData);
    };
    fetchData();
  }, []);
  return (
    <TabPanel className="tabpanel dx-responsive-paddings" showNavButtons={true}>
      <Item title="General" icon="floppy">
        <DataGrid
          dataSource={warehouses}
          hoverStateEnabled={true}
          keyExpr={"whsCode"}
          onSelectionChanged={onSelectionChanged}
        >
          <Selection mode="single" />
        </DataGrid>
      </Item>
      <Item title="Bin Allocation" icon="comment">
        <DataGrid dataSource={employee} />
      </Item>
      <Item title="Attachments" icon="isnotblank" badge="new">
        <div className="addimg-wrapper" style={{ maxHeight: "200px" }}>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
          <img
            src={attachment}
            alt={"add-image"}
            // onClick={{ handleImageClick }}
            onClick={handleFileInputClick}
          />
        </div>
      </Item>
    </TabPanel>
  );
};

export default TabbedItemComponent;
