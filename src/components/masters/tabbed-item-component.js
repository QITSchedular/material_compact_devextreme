import React from "react";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/accordion";
import { DataGrid } from "devextreme-react";
import { employee } from "./data";
import Attachmentlogo from "../../assets/images/add-img.svg";
const TabbedItemComponent = () => {
  return (
    <TabPanel className="tabpanel dx-responsive-paddings" showNavButtons={true}>
      <Item title="General" icon="floppy">
        <DataGrid dataSource={employee} />
      </Item>
      <Item title="Bin Allocation" icon="comment">
        <DataGrid dataSource={employee} />
      </Item>
      <Item title="Attachments" icon="isnotblank" badge="new">
        <div className="addimg-wrapper">
          <img
            src={Attachmentlogo}
            alt={"add-image"}
            // onClick={{ handleImageClick }}
          />
        </div>
      </Item>
    </TabPanel>
  );
};

export default TabbedItemComponent;
