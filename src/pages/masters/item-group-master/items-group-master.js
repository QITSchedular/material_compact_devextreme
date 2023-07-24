import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../../contexts/navigation";

export default function ItemGroupMaster() {
  const {
    navigationData: { currentPath },
  } = useNavigation();

  const navigate = useNavigate();
  const handleAddClick = () => {
    return navigate("/masters/additemsgroup");
  };
  useEffect(() => {
    console.log(currentPath);
  }, [currentPath]);
  return (
    <React.Fragment>
      <div className="content-block dx-card responsive-paddings">
        <div className="content-blocks">
          <MastersHeaderContent
            title={"Items Group Master"}
            subtitle={"You are viewing the total number of item groups"}
            handleAddClick={handleAddClick}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
