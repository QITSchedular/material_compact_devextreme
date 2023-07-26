import React ,{useState ,useContext} from 'react'
import MastersHeaderContent from '../../../components/masters-header-content/MastersHeaderContent'
import PopupForm from "../../../components/popup-form/PopupForm";
import { AppContext } from '../../../contexts/dataContext';

function Itemsubgroupmaster() {
  const [showItemGroupMasterBox, setShowItemGroupMasterBox] = useState(false);
  const { isCommonPopupVisible, openCommonPopup } = useContext(AppContext);

  const handleClick = () => {
    setShowItemGroupMasterBox(true);
    openCommonPopup();
};

  return (
    <>
<div className="content-block dx-card responsive-paddings">
        <div className="content-blocks">
          <MastersHeaderContent
            title={"Items Sub Group Master"}
            subtitle={"You are viewing the total number of sub item groups"}
            
            handleAddClick={handleClick}
          />
        </div>
      </div>
      
      {showItemGroupMasterBox && <PopupForm
                title={"Item Sub Group Master"}
                field = {[
                  { feildType: "dxTextBox", label: 'Item Name', isValidate: true },
                  { feildType: "dxTextBox", label: 'Item type', isValidate: true },
                  { feildType: "dxCheckBox", label: 'Locked', isValidate: false },
                ]}
            />}

    </>
  )
}

export default Itemsubgroupmaster