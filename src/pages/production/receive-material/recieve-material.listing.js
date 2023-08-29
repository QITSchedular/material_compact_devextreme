import { Button } from "devextreme-react";
import React, { useState } from "react";
import ListingDatagrid from "./listing-datagrid";

const RecievematerialListing = ({
  listingDataSource,
  onDeleteItem,
  onProceed,
}) => {
  console.log("New updated data", listingDataSource);

  const [visibleDataGridIndexes, setVisibleDataGridIndexes] = useState([]);

  const handleDownClick = (index) => {
    if (visibleDataGridIndexes.includes(index)) {
      setVisibleDataGridIndexes(
        visibleDataGridIndexes.filter((i) => i !== index)
      );
    } else {
      setVisibleDataGridIndexes([...visibleDataGridIndexes, index]);
    }
  };

  const handleDeleteItem = (index) => {
    onDeleteItem(index);
  };
  const proceedHandler = (headerQRCodeID) => {
    return onProceed(headerQRCodeID);
  };
  return (
    <div>
      {listingDataSource.map((item, index) => (
        <div className="pending-list-section" key={index}>
          <div className="single-pending">
            <div className="single-pending-delete">
              <Button
                icon="trash"
                onClick={() => handleDeleteItem(index)}
              ></Button>
            </div>

            <div className="single-pending-name">
              <span className="pending-name">{item[0].batchSerialNo}</span>
              <Button
                icon="custom-chevron-down-icon"
                onClick={() => handleDownClick(index)}
              ></Button>
            </div>

            <div className="single-pending-proceed">
              <Button
                text="Proceed"
                onClick={() => proceedHandler(item[0].headerQRCodeID)}
              ></Button>
            </div>
          </div>
          {visibleDataGridIndexes.includes(index) && (
            <div className="data-grid-drop-down">
              <ListingDatagrid dataSource={item} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecievematerialListing;
