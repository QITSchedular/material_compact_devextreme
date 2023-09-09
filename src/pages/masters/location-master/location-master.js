import { Button, DataGrid } from "devextreme-react";
import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import { getMasterData } from "../../../utils/items-master-data";
import PopupForm from "../../../components/popup-form/PopupForm";
import "../../../themes/custom-theme/dx.custom-material.scss";

export default function LocationMasterPage() {

    const { isPopupVisible, openCommonPopup, closeCommonPopup } = useContext(AppContext);


    const [showLocationMasterBox, setShowLocationMasterBox] = useState(false);
    const showLocationMasterPopup = () => {
        setShowLocationMasterBox(true);
        openCommonPopup();
    };
    const columns = [
        {
            "caption": "Locations",
            "field": "location"
        },
        {
            "caption": "GSTIN",
            "field": "gstin"
        },
        {
            "caption": "Actions",
            "field": ""
        },
    ]
    const keyArray = [
        { input: 'location' },
        { input: 'gstin' },
    ];

    const data = [{
        Location: "Alphanumeric",
        GSTIN: "Alphanumeric",
    }]

    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"Location"}
                        subtitle={"You are viewing the total number of locations"}
                        columns={columns}
                        handleAddClick={showLocationMasterPopup}
                        masterType={"Locations"}
                        keyExpr={"code"}
                        data={data}
                        key={"code"}
                        heading={"File input for Location"}
                    />
                </div>
            </div>



            {showLocationMasterBox && <PopupForm
                title={'Location Master'}
                field={[
                    { fieldType: "dxTextBox", label: "Location", isValidate: true },
                    { fieldType: "dxTextBox", label: "GSTIN", isValidate: true }
                ]}
                clientMasterType={"Locations"} // Locations is dynamic api param for add data
                showDeleteButton={false}
                keyArray={keyArray}


            />}
        </React.Fragment>
    );
}

