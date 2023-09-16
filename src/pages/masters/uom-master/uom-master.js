import React, { useContext, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import PopupForm from "../../../components/popup-form/PopupForm";

export default function UomMaster() {
    const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
    const { openCommonPopup } = useContext(AppContext);

    const handleClick = () => {
        setShowItemGroupMasterBox(true);
        openCommonPopup();
    };

    const columns = [
        {
            "caption": "UOM Code",
            "field": "uomCode"
        },
        {
            "caption": "UOM Name",
            "field": "uomName"
        },
        {
            "caption": "Locked",
            "field": "locked"
        },
        {
            "caption": "Actions",
            "field": ""
        },
    ]

    const keyObject = [
        { input: "uomCode" },
        { input: "uomName" },
        { checkbox: "locked" }
    ];

    const data = [{
        UOMCode: "Alphanumeric",
        UOMName: "Alphanumeric",
        Locked: "Y/N",
    }]

    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"UOM"}
                        subtitle={"You are viewing the total number of sub items groups"}
                        columns={columns}
                        handleAddClick={handleClick}
                        masterType={"UOMs"}
                        keyExpr={"uomEntry"}
                        data={data}
                        key={"uomEntry"}
                        heading={"File input for UOM"}
                    />
                </div>
            </div>

            {showItemGroupMasterBox && <PopupForm
                title={"UOM Master"}
                field={[
                    { feildType: "dxTextBox", label: 'UOM Code', isValidate: true },
                    { feildType: "dxTextBox", label: 'UOM Name', isValidate: true },
                    { feildType: "dxCheckBox", label: 'locked', isValidate: false },
                ]}
                keyArray={keyObject}
                clientMasterType={"UOMs"}   // here UOMs means dynamic API Params 
            />}
        </React.Fragment>
    );
}