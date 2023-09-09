import React, { useContext, useEffect, useState } from "react";
import MastersHeaderContent from "../../../components/masters-header-content/MastersHeaderContent";
import { AppContext } from "../../../contexts/dataContext";
import { PopupForm } from "../../../components";
import { getItemGroup, getQrManagedBy } from "../../../utils/items-master-data";
import "../../../themes/custom-theme/dx.custom-material.scss";

export default function ItemGroupMaster() {
  const [qrManagedByOptions, setQrManagedByOptions] = useState("");
  useEffect(() => {
    const getData = async () => {
      var response = await getQrManagedBy();
      setQrManagedByOptions(response);
    }
    getData();
  }, [])
  const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
  const { openCommonPopup } = useContext(AppContext);
  const showItemGroupMaster = () => {
    setShowItemGroupMasterBox(true);
    openCommonPopup();
  };
  const dataArray = [
    { feildType: "dxTextBox", label: 'Item Group Name', isValidate: true },
    { feildType: "dxSelectBox", label: 'QR Managed By', isValidate: false, AllData: qrManagedByOptions, dExpr: "qrMngByName", vExpr: "qrMngById" },
    { feildType: "dxCheckBox", label: 'Locked', isValidate: false }
  ];

  const columns = [
    {
      "caption": "Item Group Name",
      "field": "itmsGrpNam"
    },
    {
      "caption": "QR Managed By",
      "field": "qrMngBy"
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

  // const keyArray=["itmsGrpNam","qrMngBy","locked"]  ;
  const keyArray = [
    { input: "itmsGrpNam" },
    { input: "qrMngBy" },
    { checkbox: "Locked" }
  ];

  const data = [{
    ItemGrpName: "Alphanumeric",
    QrManagedBy: "String",
    Locked: "Y/N",
  }]

  return (
    <React.Fragment>
      <div className="content-block dx-card responsive-paddings">
        <div cssClass="iconCss" className="content-blocks" >
          <MastersHeaderContent
            title={"Item Group"}
            subtitle={"You are viewing the total number of item groups"}
            handleAddClick={showItemGroupMaster}
            columns={columns}
            masterType={"ItemGroups"}
            keyExpr={"itmsGrpCod"}
            data={data}
            key={"ItemGrpCod"}
            heading={"File input for Item Group"}
          />
        </div>
      </div>
      {showItemGroupMasterBox && <PopupForm
        title={"Item Group Master"}
        field={dataArray}
        clientMasterType={"ItemGroups"}
        keyArray={keyArray}
      />
      }
    </React.Fragment>
  );
}
