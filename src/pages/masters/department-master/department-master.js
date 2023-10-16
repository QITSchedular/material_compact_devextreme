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
            "caption": "Department",
            "field": "deptName"
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
    const keyArray = [
        { input: "deptName" },
        { checkbox: "locked" }
    ];

    const dataArray = [
        { feildType: "dxTextBox", label: "Department Name", isValidate: true },
        { feildType: "dxCheckBox", label: "Active", isValidate: false },
    ];


    const data = [{
        Department: "Alphanumeric",
        Locked: "Y/N",
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
                        masterType={"Department"}
                        keyExpr={"deptId"}
                        data={data}
                        key={"deptId"}
                        heading={"File input for Department"}

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
                clientMasterType={"Department"} // Locations is dynamic api param for add data
                showDeleteButton={false}
                keyArray={keyArray}
                customId={"masters-department-master"}


            />}
        </React.Fragment>
    );
}

