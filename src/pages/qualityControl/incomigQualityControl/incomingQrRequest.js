import { Popup, ScrollView } from "devextreme-react";
import React from "react";

function incomingQrRequest(isCommonPopupVisible) {
  return (
    <>
      <Popup
        maxWidth={850}
        height={500}
        visible={isCommonPopupVisible}
        // onHiding={hideInfo}
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={true}
        shading={true}
        container=".dx-viewport"
        className="item-master-popup-container"
      >
        <ScrollView ScrollView width="100%" height="100%">
          <div
            className={
              "dx-card content-block responsive-paddings pop-content-container"
            }
          ></div>
        </ScrollView>
      </Popup>
    </>
  );
}

export default incomingQrRequest;
