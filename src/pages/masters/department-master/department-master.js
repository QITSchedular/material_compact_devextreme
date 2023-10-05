import { Button, DataGrid } from "devextreme-react";
import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import { getMasterData } from "../../../utils/items-master-data";
import PopupForm from "../../../components/popup-form/PopupForm";
//import "../../../themes/custom-theme/dx.custom-material.scss";

import './department-master.scss'
export default function DepartmentMasterPage() {

    const { isPopupVisible, openCommonPopup, closeCommonPopup } = useContext(AppContext);


    const [showDeprtmentMasterBox, setShowDepartmentMasterBox] = useState(false);
    const showDepartmentMasterPopup = () => {
        setShowDepartmentMasterBox(true);
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
        { input: "itmsGrpCod" },
        { input: "itmsSubGrpNam" },
        { checkbox: "Locked" }
    ];

    const dataArray = [
        { feildType: "dxTextBox", label: "Department ", isValidate: true },
        { feildType: "dxCheckBox", label: "Active", isValidate: false },
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
                        title={"Department"}
                        subtitle={"You are viewing the total number of employees"}
                        columns={columns}
                        handleAddClick={showDepartmentMasterPopup}
                        masterType={"Locations"}
                        keyExpr={"code"}
                        data={data}
                        key={"code"}
                        heading={"File input for Location"}

                    />
                </div>
            </div>



            {showDeprtmentMasterBox && <PopupForm
                title={'Department Master'}
                // field={[
                //     { fieldType: "dxTextBox", label: "Department", isValidate: true },
                //     { fieldType: "dxcheckBox", label: "Active", isValidate: true }
                // ]}
                field={dataArray}
                clientMasterType={"Locations"} // Locations is dynamic api param for add data
                showDeleteButton={false}
                keyArray={keyArray}
                customId={"masters-department-master"}


            />}
        </React.Fragment>
    );
}

