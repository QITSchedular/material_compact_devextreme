import { Button, Form, NumberBox, Popup, ScrollView, TextBox } from "devextreme-react";
import React, { useRef, useState } from "react";
import {
    PopupHeaderText,
    PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Item } from "devextreme-react/accordion";
import { RequiredRule } from "devextreme-react/data-grid";
import { toastDisplayer } from "../../../api/qrgenerators";
import { SavePoListsIQC } from "../../../utils/incoming-QC";
import "./inprocessQC.scss";

function IncomingQrRequest({
    handleCancelQrRequest,
    requestData,
    approveWareHouse,
    rejectWareHouse,
}) {
    const formPopup = useRef(null);
    const [approveQty, setapproveQty] = useState(0);
    const [RejectQty, setRejectQty] = useState(0);
    const [RejectComment, setRejectComment] = useState("");
    // console.log("ertyu", requestData);
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
        // console.log("approveQty:", approveQty);
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
                    if (response["errorText"] == "GRPO Details not found") {
                        toastDisplayer("error", "GRPO Details not found");
                    } else if (response["statusCode"] == "200") {
                        if (index == 0) {
                            toastDisplayer("succes", "Approve processed successfully..!!");
                        } else if (index == 1) {
                            toastDisplayer("succes", "Reject processed successfully..!!");
                        }
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
                    <hr />
                    <div className="detailsWrapper">
                        <div className="particularDetail">
                            <div>
                                <p className="titleTxt">Approved Quantity</p>
                                <p>{approveWareHouse}</p>
                            </div>
                            <NumberBox
                                label="Qty"
                                value={0}
                                labelMode="floating"
                                onValueChanged={onValueChangedApprove}
                            ></NumberBox>
                        </div>
                        <div className="particularDetail">
                            <div>
                                <p className="titleTxt">Rejected Quantity</p>
                                <p>{rejectWareHouse}</p>
                            </div>
                            <NumberBox
                                label="Qty"
                                value={0}
                                labelMode="floating"
                                onValueChanged={onValueChangedReject}
                            ></NumberBox>
                        </div>
                        <TextBox
                            // value={this.state.textBoxValue}
                            onValueChanged={handleValueChange}
                        />
                        <div
                            className="buttons-section"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "0.5rem",
                            }}
                        >
                            <Button
                                text="Cancel"
                                width={500}
                                height={45}
                                onClick={handleCancelQrRequest}
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
