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
    return (
        <React.Fragment>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks">
                    <MastersHeaderContent
                        title={"UOM Master"}
                        subtitle={"You are viewing the total number of sub items groups"}
                        handleAddClick={handleClick}
                    />

                </div>
            </div>
            
            {showItemGroupMasterBox && <PopupForm
                title={"UOM Master"}
                field={[
                    { feildType: "dxTextBox", label: 'UOM Code', isValidate: true },
                    { feildType: "dxTextBox", label: 'UOM Name', isValidate: true },
                    { feildType: "dxCheckBox", label: 'Locked', isValidate: false },
                ]}
            />}
        </React.Fragment>
    );
}