import React from "react";
import MastersHeaderContent from "../masters-header-content/MastersHeaderContent";

const MastersForm = () => {
  const handleAddClick = () => {
    console.log("hello there");
  };
  return (
    <div className="content-block dx-card responsive-paddings">
      <div className="content-blocks">
        <MastersHeaderContent
          title={"Items Group Master"}
          subtitle={"You are viewing the total number of item groups"}
          handleAddClick={handleAddClick}
        />
      </div>
    </div>
  );
};

export default MastersForm;
