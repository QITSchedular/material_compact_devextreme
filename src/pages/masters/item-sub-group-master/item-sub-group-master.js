import React, { useState, useContext, useEffect } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import PopupForm from "../../../components/popup-form/PopupForm";
import { AppContext } from "../../../contexts/dataContext";
import { getItemGroup } from "../../../utils/items-master-data";
// import "./item-sub-group.scss";
// import "../../../themes/custom-theme/dx.material-custom.scss"
// import "../../../themes/custom-theme/dx.custom-material.scss";
// import "../../../themes/custom-theme/dx.material-custom.css"
function Itemsubgroupmaster() {
    const [itemsGroupEditorOptions, setItemsGroupEditorOptions] = useState("");
    useEffect(() => {
        var getdata = async () => {
            const getItemGroupData = await getItemGroup();
            setItemsGroupEditorOptions(getItemGroupData);
        }
        getdata();
    }, [])
    const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
    const { openCommonPopup } = useContext(AppContext);

    const handleClick = () => {
        setShowItemGroupMasterBox(true);
        openCommonPopup();
    };
    const columns = [
        {
            caption: "Item Group Name",
            field: "itmsGrpNam",
        },
        {
            caption: "Item Sub Group",
            field: "itmsSubGrpNam",
        },
        {
            caption: "Locked",
            field: "locked",
        },
        {
            caption: "Actions",
            field: "",
        },
    ];
    const dataArray = [
        { feildType: "dxSelectBox", label: "Item Group Name ", isValidate: true, AllData: itemsGroupEditorOptions, dExpr: "itmsGrpNam", vExpr: "itmsGrpCod" },
        { feildType: "dxTextBox", label: "Item Sub Group", isValidate: true },
        { feildType: "dxCheckBox", label: "Locked", isValidate: false },
    ];

    // const keyArray = [
    //   "itmsGrpCod","itmsSubGrpNam","locked"
    // ];
    const keyArray = [
        { input: "itmsGrpCod" },
        { input: "itmsSubGrpNam" },
        { checkbox: "Locked" }
    ];
    return (
        <>
            <div className="content-block dx-card responsive-paddings">
                <div cssClass=".temp123" className="content-blocks">
                    <MastersHeaderContent
                        title={"Items Sub Group Master"}
                        subtitle={"You are viewing number of sub item groups"}
                        handleAddClick={handleClick}
                        columns={columns}
                        masterType={"ItemSubGroups"}
                        keyExpr={"itmsSubGrpCod"}
                    />
                </div>
            </div>

            {showItemGroupMasterBox && (
                <PopupForm
                    title={"Item Sub Group Master"}
                    field={dataArray}
                    clientMasterType={"ItemSubGroups"}
                    keyArray={keyArray}
                />
            )}
        </>
    );
}

export default Itemsubgroupmaster;