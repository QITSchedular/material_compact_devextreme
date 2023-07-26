import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import PopupForm from "../../../components/popup-form/PopupForm";


export default function LocationMaster() {

    const { isPopupVisible, openCommonPopup, closeCommonPopup } = useContext(AppContext);
    const [showLocationMasterBox, setShowLocationMasterBox] = useState(false);
    const showLocationMasterPopup = () => {
        setShowLocationMasterBox(true);
        openCommonPopup();
    };
    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"Location Master"}
                        subtitle={"You are viewing the total number of locations"}
                        handleAddClick={showLocationMasterPopup}
                    />
                </div>
            </div>
            {showLocationMasterBox && <PopupForm
                title={'Location Master'}
                field={[
                    { fieldType: "dxTextBox", label: "Location", isValidate: true },
                    { fieldType: "dxTextBox", label: "GSTIN", isValidate: true }
                ]}

            />}
        </React.Fragment>
    );
}

