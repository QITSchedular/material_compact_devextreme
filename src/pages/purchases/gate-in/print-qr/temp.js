import { TextBox, Button as NormalButton, LoadPanel } from "devextreme-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import DropDownButton from "devextreme-react/drop-down-button";
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Selection,
    Editing,
    AsyncRule,
    Button,
} from "devextreme-react/data-grid";
// import "../gate-in-styles.scss";
import "./printqr-styles.scss";
//sample data Things

import { toast } from "react-toastify";
import {
    callUpdatePoApi,
    getPeriodIndicator,
    getPurchaseOrder,
    getSeriesPo,
} from "../../../../utils/gate-in-purchase";
import PrintPopup from "./print-popup";
import { AppContext } from "../../../../contexts/dataContext";
import ItemsQrDisplayer from "./qr-displayer";
import { fetchItemQrCode } from "../../../../utils/qr-generation";

const buttonDropDownOptions = { width: 230 };

const PrintQrMainComp = () => {
    const { isQrPopupVisible, openQrPopUp, closeQrPopUp } =
        useContext(AppContext);

    const [poDetailsfull, setPoDetailsFull] = React.useState("");
    const [scrollingMode, setScrollingMode] = React.useState("standard");
    const [periodIndicators, setPeriodIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriodIndicator, setSelectedPeriodIndicator] = useState("");
    const [selectedSeries, setSelectedSeries] = useState("");
    const [seriesList, setSeriesList] = useState([]);
    const [poNumber, setPoNumber] = useState("");
    const [poData, setPoData] = useState(null);
    const [objType, setobjType] = useState(null);
    const [docEntry, setDocEntry] = useState(null);
    const [selectedValue, setSelectedValue] = useState({
        periodIsSelected: false,
        seriesIsSelected: false,
        poIsEntered: false,
    });
    const [updatedItems, setUpdatedItems] = useState([]);
    const [viewQr, setViewQr] = useState(false);
    const [itemQrCode, setItemQrCode] = useState([]);

    const handleSearchPurchasedOrder = async () => {
        const { periodIsSelected, seriesIsSelected, poIsEntered } = selectedValue;
        const flag = "Y";
        setLoading(true);
        const poResponse = await getPurchaseOrder(
            poNumber,
            selectedSeries.series,
            flag
        );
        if (poResponse.hasError) {
            return toast.error(poResponse.errorText, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        const poDetArrayWithRecQty = await poResponse[0].poDet.map((item) => ({
            ...item,
            recQty: 0,
        }));
        // console.log("This is the data", poDetArrayWithRecQty);
        await setPoData(poDetArrayWithRecQty);
        await setPoDetailsFull(poResponse);
        setLoading(false);
    };

    // handle dropdown items click
    const periodItemsClick = async (e) => {
        await setSelectedPeriodIndicator(e.itemData.indicator || e.itemData);
        const seriesData = await getSeriesPo(e.itemData.indicator, 1);
        // console.log(seriesData);
        if (seriesData.hasError) {
            return toast.error(seriesData.errorText, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        // the dropdown should be series name
        setSeriesList(seriesData);
        setSelectedValue({ periodIsSelected: true });
        console.log("This is series data", seriesData);
    };

    const handleSeriesSelectionClick = async (e) => {
        await setSelectedSeries(e.itemData);
        // await setSelectedSeries(e.itemData.seriesNum);
        setSelectedValue({ seriesIsSelected: true });
    };

    const handlePurchaseOrderEntry = async (enteredPoNum) => {
        await setPoNumber(enteredPoNum.value);
        setSelectedValue({ poIsEntered: true });
    };

    // Handle the editing of the cell recieved qty
    const asyncValidation = (params) => {
        return new Promise((resolve, reject) => {
            const { qty, recQty, openQty } = params.data;
            if (recQty > openQty) {
                reject("Received Quantity should Not be greater than open quantity");
            } else {
                resolve(recQty);
            }
        });
    };

    const handleGateIn = async () => {
        const callLoop = callUpdatePoApi(updatedItems);
    };

    const handleGridSaving = useCallback((e) => {
        console.log(e.changes[0]);
        const newData = {
            key: e.changes[0].key,
            recQty: e.changes[0].data.recQty,
        };

        setUpdatedItems((prevData) => [...prevData, newData]);
    });

    //fetch the searches data
    const getSeriesData = async () => {
        const data = await getPeriodIndicator();
        // console.log(data);
        await setPeriodIndicators(data);
    };
    useEffect(() => {
        console.log("object");
        getSeriesData();
    }, []);

    // qr Visible handlers
    const handleClone = async (e) => {
        // console.log("This is the selected row data", e.row.data);
        await setSelectedQrRowData(e.row.data);
        if (e.row.data) {
            const iqstr = await fetchItemQrCode(
                e.row.data,
                poDetailsfull,
                seriesList
            );
            // console.log("Ye le bahi", iqstr);
            if (!iqstr.length > 0) {
                console.log("in if");
                toast.error("No Qr Data Found", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return toast.error("Please generate the Qr Code first", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                console.log("nested else");
                setViewQr(true);
                setItemQrCode(iqstr);
            }
        } else {
            return alert("Row data not exist");
        }
    };

    const handleQrPopUpClose = async () => {
        setItemQrCode("");
        return setViewQr(false);
    };

    //qr Generator popup section and handlers
    const [showPrintPop, setShowPrintPop] = useState(false);
    const [printQrVisibility, setPrintQrVisibility] = useState(false);
    const [selectedQrRowData, setSelectedQrRowData] = useState("");
    const handleQrGenerate = async (e) => {
        console.log(e.row.data, poDetailsfull);
        setSelectedQrRowData(e.row.data);
        setShowPrintPop(true);
    };
    const qrVisibilityHandler = async (data) => {
        // console.log(data);
        return await setShowPrintPop(data);
    };

    return (
        <div className="content-block dx-card responsive-paddings main-container">
            {showPrintPop && (
                <PrintPopup
                    qrVisibilityHandler={qrVisibilityHandler}
                    selectedQrRowData={selectedQrRowData}
                    poDetailsfull={poDetailsfull}
                    seriesList={seriesList}
                />
            )}
            {viewQr && (
                <ItemsQrDisplayer
                    itemQrCode={itemQrCode}
                    handleQrPopUpClose={handleQrPopUpClose}
                    displayerFlag={selectedQrRowData.qrMngBy}
                />
            )}
            <div className="title-section">
                <h3 className="title-name">Generate & Print QR Code</h3>
                <span className="title-description">
                    Select and Enter field values to get P.O
                </span>
            </div>

            <div className="actions-section">
                <div className="buttons-section">
                    <DropDownButton
                        text={
                            selectedPeriodIndicator
                                ? selectedPeriodIndicator
                                : "Select Period"
                        }
                        dropDownOptions={buttonDropDownOptions}
                        keyExpr="indicator"
                        displayExpr={"indicator"}
                        items={periodIndicators}
                        onItemClick={periodItemsClick}
                        className="period-indicator"
                    />
                    <DropDownButton
                        text={selectedSeries ? selectedSeries.seriesName : "Select Series"}
                        dropDownOptions={buttonDropDownOptions}
                        items={seriesList}
                        keyExpr={"series"}
                        displayExpr={"seriesName"}
                        onItemClick={handleSeriesSelectionClick}
                        className="series-indicator"
                    />
                </div>
                <div className="search-section">
                    <TextBox
                        className="dx-field-value"
                        stylingMode="outlined"
                        placeholder="Search by purchase order"
                        width={250}
                        showClearButton={true}
                        onValueChanged={handlePurchaseOrderEntry}
                    />

                    <NormalButton
                        width={33}
                        height={33}
                        type="normal"
                        stylingMode="outlined"
                        icon="search"
                        onClick={handleSearchPurchasedOrder}
                    />
                </div>
            </div>
            <div className="data-grid-section">
                {loading && <LoadPanel />}
                {poData ? (
                    <>
                        <DataGrid
                            id="data-grid-container-local"
                            dataSource={poData}
                            keyExpr={"itemCode"}
                            showBorders={false}
                            focusedRowEnabled={true}
                            defaultFocusedRowIndex={0}
                            columnAutoWidth={true}
                            columnHidingEnabled={false}
                            remoteOperations={true}
                            onSaving={handleGridSaving}
                        >
                            <Scrolling mode={scrollingMode} />
                            <Paging defaultPageSize={10} />
                            <Selection mode="multiple" />

                            <Column
                                dataField={"itemCode"}
                                caption={"Item Code"}
                                allowEditing={false}
                            />
                            <Column
                                dataField={"itemName"}
                                caption={"Item Name"}
                                allowEditing={false}
                            />
                            <Column
                                caption={"Project Name"}
                                dataField={"project"}
                                allowEditing={false}
                            />
                            <Column
                                caption={"UOM"}
                                dataField={"uomCode"}
                                allowEditing={false}
                            />
                            <Column
                                caption={"Wharehouse"}
                                dataField={"whsCode"}
                                allowEditing={false}
                            />
                            {/* Bind this to any respective values */}
                            <Column
                                caption={"Qr Managed By"}
                                dataField={"qrMngBy"}
                                allowEditing={false}
                            />

                            <Column
                                dataField={"qty"}
                                caption={"Ordered Qty."}
                                allowEditing={false}
                            />
                            <Column
                                dataField={"openQty"}
                                type={"number"}
                                caption={"Received Qty"}
                                // allowEditing={
                                //   poData && parseInt(poData.openQty) > 0 ? true : false
                                // }
                                allowEditing={true}
                            >
                                <AsyncRule
                                    message="Email address is not unique"
                                    validationCallback={asyncValidation}
                                />
                            </Column>
                            <Column
                                dataField={"recDate"}
                                caption={"Rec. Date"}
                                allowEditing={false}
                            />
                            <Column type="buttons" width={110} caption={"Actions"}>
                                <Button
                                    hint="Generate QrCode..."
                                    icon="fa-solid fa-qrcode"
                                    visible={true}
                                    onClick={handleQrGenerate}
                                />
                                <Button
                                    hint="Clone"
                                    icon="fa-solid fa-print"
                                    visible={true}
                                    onClick={handleClone}
                                />
                            </Column>
                        </DataGrid>
                    </>
                ) : (
                    <div className="no-po-section">
                        {/* <h3>Nothing to Display</h3>
            <img src={NodataImg} alt="No Data Found" /> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintQrMainComp;