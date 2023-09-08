import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import PopupForm from "../../../components/popup-form/PopupForm";
import { getMasterData } from "../../../utils/items-master-data";

export default function WarehouseMaster() {
    const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
    const { openCommonPopup } = useContext(AppContext);

    const [LocationOptions, setLocationOptions] = useState("");
    useEffect(() => {
        const getData = async () => {
            var response = await getMasterData("Locations");
            setLocationOptions(response);
        }
        getData();
    }, [])

    const handleClick = () => {
        setShowItemGroupMasterBox(true);
        openCommonPopup();
    };

    const columns = [
        {
            "caption": "Warehouse Code",
            "field": "whsCode"
        },
        {
            "caption": "Warehouse",
            "field": "whsName"
        },
        {
            "caption": "Location",
            "field": "location"
        },
        {
            "caption": "Locked",
            "field": "locked"
        },
        {
            "caption": "Bin Location",
            "field": "binActivat"
        },
        {
            "caption": "Actions",
            "field": ""
        },
    ]

    const keyArray = [
        { input: "whsCode" },
        { input: "whsName" },
        { input: "locCode" },
        { input: "location" },
        { checkbox: "locked" },
        { checkbox: "binActivat" },
    ];

    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"Warehouses Master"}
                        subtitle={"You are viewing number of sub items groups"}
                        columns={columns}
                        handleAddClick={handleClick}
                        masterType={"Warehouses"}
                        keyExpr={"whsCode"}
                    />
                </div>
            </div>

            {showItemGroupMasterBox && <PopupForm
                title={"Warehouses Master"}
                field={[
                    { feildType: "dxTextBox", label: 'Warehouse Code', isValidate: true },
                    { feildType: "dxTextBox", label: 'Warehouse Name', isValidate: true },
                    { feildType: "dxSelectBox", label: 'Location', isValidate: true, AllData: LocationOptions, dExpr: "location", vExpr: "code" },
                    { feildType: "dxCheckBox", label: 'locked', isValidate: false },
                    { feildType: "dxCheckBox", label: 'binActivat', isValidate: false },
                ]}
                keyArray={keyArray}
                clientMasterType={"Warehouses"}   // here UOMs means dynamic API Params 
            />}
        </React.Fragment>
    );
}