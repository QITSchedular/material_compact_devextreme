import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    PopupHeaderText,
    PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { GRPOScanner } from "../../../assets/icon";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { getPoLists, searchPoListsIQC } from "../../../utils/gate-in-purchase";
import QtcMainColumn from "../../../components/qtcCommonComponent/qtcMainColumn";
import QtcSearchColumn from "../../../components/qtcCommonComponent/qtcSearchColumn";
import "./delivery.scss";
import { toastDisplayer } from "../../../api/qrgenerators";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

export default function Delivery() {
    const [grpoList, setGrpoList] = useState(new Set());
    const [selectedPo, setSelectedPo] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gridDataSourceForPopup, setGridDataSourceForPopup] = useState([]);
    const [showPO, setShowPO] = useState();

    const helpOptions = {
        icon: HelpIcons,
        onClick: async () => {
            // showPopupHandler();
            alert();
        },
    };

    const handlePoVerification = async param => {
        if (param.length > 0 && param) {
            setSelectedPo(param[0].qrCodeID)
            const doPoExists = await searchPoListsIQC(param[0].qrCodeID)
            if (doPoExists.hasError) {
                return toastDisplayer('error', doPoExists.errorText)
            }
            var doProuctExist
            if (grpoList.size > 0) {
                doProuctExist = false
                grpoList.forEach(value => {
                    if (value.headerQRCodeID == param[0].qrCodeID) {
                        doProuctExist = true
                        return
                    }
                })
            } else {
                doProuctExist = false
            }
            if (doProuctExist && doPoExists) {
                return toastDisplayer('error', 'QR Code already exists in the list!')
            } else if (doPoExists && !doProuctExist) {
                setGrpoList(prevGrpoList => {
                    const updatedSet = new Set(prevGrpoList)
                    doPoExists.forEach(response => {
                        updatedSet.add(response)
                    })
                    return updatedSet
                })
            } else if (doProuctExist === 'No data found') {
                return toastDisplayer(
                    'error',
                    'The scanned item does not belong to this P.O'
                )
            }
        } else if (selectedPo != null) {
            if (!selectedPo) {
                return toastDisplayer('error', 'Please type/scan P.O')
            }
            const doPoExists = await searchPoListsIQC(selectedPo)
            if (doPoExists.hasError) {
                return toastDisplayer('error', doPoExists.errorText)
            }
            var doProuctExist
            if (grpoList.size > 0) {
                doProuctExist = false
                grpoList.forEach(value => {
                    if (value.headerQRCodeID == param[0].qrCodeID) {
                        doProuctExist = true
                        return
                    }
                })
            } else {
                doProuctExist = false
            }
            if (doProuctExist && doPoExists) {
                return toastDisplayer('error', 'QR Code already exists in the list!')
            } else if (doPoExists && !doProuctExist) {
                setGrpoList(prevGrpoList => {
                    const updatedSet = new Set(prevGrpoList)
                    doPoExists.forEach(response => {
                        updatedSet.add(response)
                    })
                    return updatedSet
                })
            } else if (doProuctExist === 'No data found') {
                return toastDisplayer(
                    'error',
                    'The scanned item does not belong to this P.O'
                )
            }
        }
        else {
            return toastDisplayer('error', 'Please type/scan P.O')
        }
    }

    const handleTextValueChange = (data) => {
        setSelectedPo(data.value);
    };

    const handleScan = () => {
        setShowScanner(true);
        console.log("Handle Scan");
    };

    const keyArray1 = [
        { feildType: "textBox", handlefunc: "handleTextValueChange", placeholder: "Search by purchase order", selectedRowsData: selectedPo, TextWithIcon: true },
        { feildType: "button", handlefunc: handlePoVerification, btnIcon: "search" },
        { feildType: "button", handlefunc: handleScan, btnIcon: GRPOScanner },
    ];

    const navigate = useNavigate();
    const proceedToItemsScan = (qrCode) => {
        navigate(`/sales/delivery/delivery-process/${qrCode}`);
    };


    useEffect(() => {
        setLoading(true);
        const fetchAllPo = async () => {
            const poListData = await getPoLists();
            if (poListData.length > 0) {
                await setGridDataSourceForPopup(poListData);
            } else {
                toastDisplayer("error", "Something went wrong please tyr again later.");
            }
            return setLoading(false);
        };
        fetchAllPo();
    }, []);
    const HandleCloseQrScanner = () => {
        setShowScanner(false);
    };
    const HandleDecodedData1 = (data) => {
        setSelectedPo(data);
        setShowPO(true);
        setShowScanner(false);

    };

    const columns = [
        {
            caption: "Vendor Code",
            field: "cardCode",
        },
        {
            caption: "Vendor Ref No.",
            field: "cardCode",
        },
        {
            caption: "Vendor Name",
            field: "cardName",
        },
        {
            caption: "Doc Series",
            field: "series",
        },
        {
            caption: "Doc No.",
            field: "docNum",
        },
        {
            caption: "Doc Date",
            field: "docDate",
        },
        {
            caption: "Post Date",
            field: "postDate",
        },
        {
            caption: "Project",
            field: "project",
        },
        {
            caption: "Remark",
            field: "project",
        },
        {
            caption: "Doc Entry",
            field: "docEntry",
        },
    ];

    return (
        <>
            {showScanner && (
                <div>
                    <TransparentContainer
                        mountNodeId="container"
                        showScan={showScanner}
                        HandleCloseQrScanner1={HandleCloseQrScanner}
                        HandleDecodedData={HandleDecodedData1}
                    ></TransparentContainer>
                </div>
            )}
            <div className="content-block dx-card responsive-paddings delivery-container">
                <div className="header-section">
                    <PopupHeaderText text={"Delivery"} className="headerText" />
                    <PopupSubText text={"To pick and deliver the items"} className="subText" />
                </div>

                {/* here we have to change headertext and sub text after making an new api for this page */}
                <QtcSearchColumn popupHeaderText="Delivery" popupSubHeaderText="To pick and deliver the items" optionFunc={helpOptions} keyArray={keyArray1} PopUpContent={getPoLists()} getparamFunc={handlePoVerification} valueToShowParam="qrCodeID" keyExpr="docEntry" />

                {grpoList.size > 0 &&
                    <QtcMainColumn IQCList={grpoList} columns={columns} handleProceed1={proceedToItemsScan} displayname="headerQRCodeID" DownArrowKey="docEntry" keyExpr="docEntry" />
                }

            </div>
        </>
    );
}
