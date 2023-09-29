import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import QtcSearchColumn from '../../../components/qtcCommonComponent/qtcSearchColumn'
// import "./inventory-transfer.styles.scss";
import QtcMainColumn from "../../../components/qtcCommonComponent/qtcMainColumn";

import { getPoLists, searchPoListsIQC } from '../../../utils/gate-in-purchase'
import { toastDisplayer } from "../../../api/qrgenerators";
import { Navigate, useNavigate } from "react-router-dom";
import { GRPOScanner } from "../../../assets/icon";
import TransparentContainer from "../../../components/qr-scanner/transparent-container";

const PickPackMain = () => {
  const [grpoList, setGrpoList] = useState(new Set())
  const [selectedPo, setSelectedPo] = useState('')
  const [showScanner, setShowScanner] = useState(false);
  const handleScan = () => {
    setShowScanner(true);
    console.log("Handle Scan");
  };
  const handleTextValueChange=(data)=>{
    setSelectedPo(data.value);
  }
  const keyArray1 = [
    {
      feildType: 'textBox',
      handlefunc: handleTextValueChange,
      placeholder: 'Type the sales order',
      selectedRowsData: selectedPo,
      TextWithIcon: true,
      textValue : selectedPo
    },
    { feildType: 'button', handlefunc: "handlePoVerification", btnIcon: 'search' },
    { feildType: 'button', handlefunc: handleScan, btnIcon: GRPOScanner }
  ]

  
  const columns = [
    {
      caption: "Vendor Code",
      field: "cardCode",
    },
    {
      caption: "Vendor Ref No.",
      field: "cardCode",
    },
    {
      caption: "Vendor Name",
      field: "cardName",
    },
    {
      caption: "Doc Series",
      field: "series",
    },
    {
      caption: "Doc No.",
      field: "docNum",
    },
    {
      caption: "Doc Date",
      field: "docDate",
    },
    {
      caption: "Post Date",
      field: "postDate",
    },
    {
      caption: "Project",
      field: "project",
    },
    {
      caption: "Remark",
      field: "project",
    },
    {
      caption: "Doc Entry",
      field: "docEntry",
    },
  ];
  const navigate = useNavigate();
  const proceedToItemsScan = (param,param1) => {
    return navigate(`/inventory/pick-pack/pick-pack-Process/${param}/${param1}`);
  };

  const handlePoVerification = async param => {
    if (param.length > 0 && param) {
      setSelectedPo(param[0].qrCodeID)
      const doPoExists = await searchPoListsIQC(param[0].qrCodeID)
      if(doPoExists.hasError){
        return toastDisplayer('error', doPoExists.errorText)
      }
      var doProuctExist
      if (grpoList.size > 0) {
        doProuctExist = false
        grpoList.forEach(value => {
          if (value.headerQRCodeID == param[0].qrCodeID) {
            doProuctExist = true
            return
          }
        })
      } else {
        doProuctExist = false
      }
      if (doProuctExist && doPoExists) {
        return toastDisplayer('error', 'QR Code already exists in the list!')
      } else if (doPoExists && !doProuctExist) {
        setGrpoList(prevGrpoList => {
          const updatedSet = new Set(prevGrpoList)
          doPoExists.forEach(response => {
            updatedSet.add(response)
          })
          return updatedSet
        })
      } else if (doProuctExist === 'No data found') {
        return toastDisplayer(
          'error',
          'The scanned item does not belong to this P.O'
        )
      }
    } else if(selectedPo!=null){
      if(!selectedPo){
        return toastDisplayer('error', 'Please type/scan P.O')
      }
      const doPoExists = await searchPoListsIQC(selectedPo)
      if(doPoExists.hasError){
        return toastDisplayer('error', doPoExists.errorText)
      }
      var doProuctExist
      if (grpoList.size > 0) {
        doProuctExist = false
        grpoList.forEach(value => {
          if (value.headerQRCodeID == param[0].qrCodeID) {
            doProuctExist = true
            return
          }
        })
      } else {
        doProuctExist = false
      }
      if (doProuctExist && doPoExists) {
        return toastDisplayer('error', 'QR Code already exists in the list!')
      } else if (doPoExists && !doProuctExist) {
        setGrpoList(prevGrpoList => {
          const updatedSet = new Set(prevGrpoList)
          doPoExists.forEach(response => {
            updatedSet.add(response)
          })
          return updatedSet
        })
      } else if (doProuctExist === 'No data found') {
        return toastDisplayer(
          'error',
          'The scanned item does not belong to this P.O'
        )
      }
    }
     else {
      return toastDisplayer('error', 'Please type/scan P.O')
    }
  }

  const HandleCloseQrScanner = () => {
    setShowScanner(false);
  };
  const HandleDecodedData1 = async (data) => {
    // setSelectedPo(data);
    console.log("data after scanning  : ",data)
    setSelectedPo(data);
    // alert(data);
    // await handlePoVerification(data);
    // setProductionNumberInput(data);
    // setShowPO(true);
    setShowScanner(false);
  };
  return (
    <div className="content-block dx-card responsive-paddings default-main-conatiner inventory-transfer-main-container ">
       {showScanner && (
        <div>
          <TransparentContainer
            mountNodeId="containerInventry"
            showScan={showScanner}
            HandleCloseQrScanner1={HandleCloseQrScanner}
            HandleDecodedData={HandleDecodedData1}
          ></TransparentContainer>
        </div>
      )}
      <div className="title-section">
        <PopupHeaderText text={"Pick & Packer"} />
        <PopupSubText text={"Search the sales order to pick the items "} />
      </div>

      <QtcSearchColumn
        popupHeaderText='Pick & Packer'
        popupSubHeaderText='Search the sales order to pick the items'
        keyArray={keyArray1}
        PopUpContent={getPoLists()}
        getparamFunc={handlePoVerification}
      />

    <QtcMainColumn IQCList={grpoList} columns={columns} handleProceed1={proceedToItemsScan} displayname="headerQRCodeID" DownArrowKey="docEntry"/>

    </div>
  );
};

export default PickPackMain;
