import { Button, NumberBox, TextBox } from "devextreme-react";
import React, { useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { toastDisplayer } from "../../../api/qrgenerators";
import { SavePoListsIQC } from "../../../utils/incoming-QC";

function IncomingQrRequest({
  handleCancelQrRequest,
  requestData,
  approveWareHouse,
  rejectWareHouse,
}) {
  const [approveQty, setapproveQty] = useState(0);
  const [RejectQty, setRejectQty] = useState(0);
  const [RejectComment, setRejectComment] = useState("");
  const [QrRequestData, setQrRequestData] = useState([]);
  useState(() => {
    setQrRequestData(requestData);
    // console.log("QrRequestData : ", QrRequestData);
  }, []);
  const onValueChangedApprove = async (e) => {
    // console.log("e.value", e.value);
    await setapproveQty(e.value);
  };
  const onValueChangedReject = async (e) => {
    // console.log("e.value", e.value);
    await setRejectQty(e.value);
  };
  const handleSave = async () => {
    const appQty = approveQty;
    const rejQty = RejectQty;
    const totleQty = parseInt(appQty) + parseInt(rejQty);
    if (appQty == 0) {
      return toastDisplayer("error", "Approve quantity can not be 0");
    } else if (totleQty > parseInt(QrRequestData["recQty"])) {
      return toastDisplayer("error", "Invalid quty");
    } else if (appQty > 0 && totleQty <= parseInt(QrRequestData["recQty"])) {
      const apiCalls = [];
      if (rejQty > 0) {
        const reqBodyRej = {
          branchID: 1,
          grpoDocEntry: QrRequestData["grpoDocEntry"],
          detailQRCodeID: QrRequestData["detailQRCodeID"],
          fromWhs: "QC",
          toWhs: rejectWareHouse,
          action: "R",
          qty: rejQty,
          rejectComment: RejectComment,
        };

        const rejectCall = SavePoListsIQC(reqBodyRej);
        apiCalls.push(rejectCall);
      }

      if (appQty > 0) {
        const reqBodyApp = {
          branchID: 1,
          grpoDocEntry: QrRequestData["grpoDocEntry"],
          detailQRCodeID: QrRequestData["detailQRCodeID"],
          fromWhs: "QC",
          toWhs: approveWareHouse,
          action: "A",
          qty: appQty,
          rejectComment: RejectComment,
        };

        const approveCall = SavePoListsIQC(reqBodyApp);
        apiCalls.push(approveCall);
      }

      try {
        const responses = await Promise.all(apiCalls);
        responses.forEach((response, index) => {
          if (response["statusCode"] == "200") {
            if (index == 0) {
              toastDisplayer("succes", "Approve processed successfully..!!");
            } else if (index == 1) {
              toastDisplayer("succes", "Reject processed successfully..!!");
            }
          }else{
            toastDisplayer("error", response["errorText"]);
          }
        });

        handleCancelQrRequest();
      } catch (err) {
        toastDisplayer("error", "Something went wrong");
      }
    }
  };
  const handleValueChange = async (e) => {
    await setRejectComment(e.value);
  };
  return (
    <>
      {/* {console.log("QrRequestData : ", QrRequestData)} */}
      <div className="purchaseOrderList-main-containter">
        <div className="purchaseOrderList-header">
          <div
            className="purchaseOrderList-title-section responsive-paddings"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <PopupHeaderText text={"QC Request"} />
            <PopupSubText
              text={"How much qty. are you going to approve or reject ?"}
            />
          </div>
          <div className="close-btn-section">
            <Button icon="close" onClick={handleCancelQrRequest} />
          </div>
        </div>
        <div className="QrBodyWrapper">
          {/* {QrRequestData && 
              <h3>{QrRequestData["headerQRCodeID"]}</h3>
            } */}
          <p className="summaryTxt">Summary</p>
          <div className="detailsWrapper">
            <div className="particularDetail">
              <p className="titleTxt">Vendor Name</p>
              <p className="valueTxt">{QrRequestData["cardName"]}</p>
            </div>
            <div className="particularDetail">
              <p className="titleTxt">PO</p>
              <p className="valueTxt">{QrRequestData["itemCode"]}</p>
            </div>
            <div className="particularDetail">
              <p className="titleTxt">Received Qty.</p>
              <p className="valueTxt">{QrRequestData["recQty"]}</p>
            </div>
            <div className="particularDetail">
              <p className="titleTxt">ProjectCode</p>
              <p className="valueTxt">{QrRequestData["poDocNum"]}</p>
            </div>
            <div className="particularDetail">
              <p className="titleTxt">GRN</p>
              <p className="valueTxt">{QrRequestData["grpoDocNum"]}</p>
            </div>
            <div className="particularDetail">
              <p className="titleTxt">GRN Date</p>
              <p className="valueTxt">
                {(() => {
                  const date = new Date(QrRequestData["docDate"]);
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${month}/${day}/${year}`;
                })()}
              </p>
            </div>
          </div>
          <hr className="hrLine" />
          <div className="detailsWrapper">
            <div className="particularDetail">
              <div className="particularDetail-txt">
                <p className="particularDetail-titleTxt">Approved Quantity</p>
                <p className="titleTxt">{approveWareHouse}</p>
              </div>
              <NumberBox
                // className="dx-field-value"
                className="form-element"
                stylingMode="outlined"
                // placeholder={placeholder}
                label={"Qty"}
                labelMode="floating"
                width={160}
                showClearButton={true}
                value={""}
                onValueChanged={onValueChangedApprove}
              >
                      
              </NumberBox>
            </div>
            <div className="particularDetail" style={{"marginTop":"0.5rem"}}>
              <div className="particularDetail-txt">
                <p className="particularDetail-titleTxt">Rejected Quantity</p>
                <p className="titleTxt">{rejectWareHouse}</p>
              </div>
              <NumberBox
                // className="dx-field-value"
                className="form-element"
                stylingMode="outlined"
                // placeholder={placeholder}
                label={"Qty"}
                labelMode="floating"
                width={160}
                showClearButton={true}
                value={""}
                onValueChanged={onValueChangedReject}
              >
                      
              </NumberBox>
            </div>
            <div className="particularDetail" style={{"margin":"0.5rem 0rem 0.5rem 0.5rem"}}>
              <TextBox
                // className="dx-field-value"
                className="form-element"
                stylingMode="outlined"
                label={"Remark"}
                labelMode="floating"
                // width={160}
                showClearButton={true}
                onValueChanged={handleValueChange}
                value={""}
              >
              </TextBox>

            </div>
            <div
              className="buttons-section"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "0.8rem",
              }}
            >
              <Button
                text="Cancel"
                width={500}
                height={45}
                onClick={handleCancelQrRequest}
                className="cancelQcBtn"
              />
              <Button
                text="Save"
                type="default"
                width={500}
                height={45}
                onClick={handleSave}
                className="OkQcBtn"
                // disabled={selectedRowKeys.length > 0 ? false : true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IncomingQrRequest;
