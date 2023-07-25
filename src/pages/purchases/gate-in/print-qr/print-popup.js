import React, { useContext } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { AppContext } from "../../../../contexts/dataContext";
const renderContent = () => {
  return (
    <div className="responsive-paddings">
      <div className="main-section">
        <div
          className="dx-field"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <TextBox
            defaultValue={"Address"}
            stylingMode="outlined"
            width={200}
            showClearButton={true}
            placeholder="No. of Batches"
            label="No. of Batches"
          />
          <TextBox
            defaultValue={"Remarks"}
            stylingMode="outlined"
            width={400}
            showClearButton={true}
            placeholder="Add Remarks"
            label="Add Remarks"
          />
        </div>
      </div>
      <div className="action-section" style={{ paddingTop: "1rem" }}>
        <Button
          className="send"
          type="default"
          icon="fa fa-envelope-o"
          text="Generate Qr"
          width={150}
          height={35}
        />
        <Button
          className="close"
          icon="close"
          text="Close"
          width={100}
          height={35}
        />
      </div>
    </div>
  );
};
const renderTitle = () => {
  return (
    <div
      className="dx-flexbox"
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "16px",
      }}
    >
      <div>ItemCode: 45221</div>
      <div>Order Qty</div>
      <div>Recieved Qty</div>
    </div>
  );
};
const PrintPopup = () => {
  const { isQrPopupVisible, openQrPopUp, closeQrPopUp } =
    useContext(AppContext);
  return (
    <>
      {isQrPopupVisible && (
        <div className="print-qr-popup">
          <Popup
            showTitle={true}
            visible={isQrPopupVisible}
            width={720}
            height={200}
            titleRender={renderTitle}
            contentRender={renderContent}
          ></Popup>
          {/* ... */}
        </div>
      )}
    </>
  );
};

export default PrintPopup;
