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

    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"UOM Master"}
                        subtitle={"You are viewing number of sub items groups"}
                        columns={columns}
                        handleAddClick={handleClick}
                        masterType={"UOMs"}
                        keyExpr={"uomEntry"}
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