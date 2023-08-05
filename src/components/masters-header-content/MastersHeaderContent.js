import React from "react";
import Button from "devextreme-react/button";
import MasterGrid from "../master-grid/MasterGrid";
import { getLocations } from "../../utils/items-master-data";
const MastersHeaderContent = ({ title, subtitle, handleAddClick, masterType, columns, keyExpr }) => {
  const getData = async (getDataFunction) => {
    return await getDataFunction(); // Assuming the `getItemGroup`, `getItemSubGroup`, etc. functions return the data.
  };
  return (
    <div className="content-blocks">
      <div className="content-block-wrapper">
        <div className="content-block-1">
          <div className="content-text">
            <div className="content-text-header">{title}</div>
            <div className="content-text-info">{subtitle}</div>
          </div>
          <div className="button-groups">
            {/* <Button text="Export Data" icon="chevrondown" height={32} /> */}
            <Button text="Template" icon="chevrondown" height={32} />
            <Button
              text="New Item"
              type="default"
              icon="add"
              height={32}
              className="item-btn"
              onClick={handleAddClick}

            />
          </div>
        </div>
      </div>
      <MasterGrid columns={columns} masterType={masterType} keyExpr={keyExpr} />
    </div>
  );
};

export default MastersHeaderContent;
