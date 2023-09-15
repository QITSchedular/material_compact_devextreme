import React, { useEffect, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../../../components/typographyTexts/TypographyComponents";
import { Button, LoadPanel, TextBox } from "devextreme-react";
import { GRPOScanner } from "../../../assets/icon";
import IssueMaterialListing from "./issue-material-listings";
import { useNavigate } from "react-router-dom";
import { toastDisplayer } from "../../../api/qrgenerators";
import { testGetDetailsByProductionNumber } from "../../../api/test-apis";
import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import IssueMaterialPoHelpPopup from "./issue-material-pohelp";
import {
  getProductionOrderItemList,
  getProductionOrderList,
} from "../../../api/production.api";

const IssueMaterialMain = () => {
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [inputQrValue, setInputQrValue] = useState("");
  const [inputPoValue, setInputPoValue] = useState([]);
  const [listingDataSource, setListingDataSource] = useState([]);
  const [infogridDataSource, setInfogridDataSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPoHelpPopup, setShowPoHelpPopup] = useState(false);
  const [poHelpDataSource, setPoHelpDataSource] = useState("");

  const navigate = useNavigate();

  const helpOptions = {
    icon: HelpIcons,
    onClick: () => {
      showPopupHandler();
    },
  };

  const showPopupHandler = async () => {
    /* hit the api to populate the data grid*/
    const apiRes = await poDataSourceFetcher();
    if (apiRes.hasError) {
      return toastDisplayer(
        "error",
        apiRes.errorMessage
          ? apiRes.errorMessage
          : "Something went wrong, please try again later"
      );
    }
    await setPoHelpDataSource(apiRes.responseData);

    await setShowPoHelpPopup(!showPoHelpPopup);
  };

  const poDataSourceFetcher = async () => {
    try {
      const response = await getProductionOrderList();
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const inputQrValueChangedCallback = ({ value }) => {
    if (value) {
      setIsSearchButtonDisabled(false);
      setInputQrValue(value);
      console.log(value);
    } else if (!value) {
      setInputQrValue("");
      setIsSearchButtonDisabled(false);
    }
  };

  const handleSearch = async () => {
    /* ----------- validator --------- */
    setLoading(true);
    if (!inputQrValue) {
      setLoading(false);
      return toastDisplayer("error", "Search value cannot be empty");
    }
    /* ----------- validator --------- */

    /* ----------- hit api --------- */
    // console.log(inputQrValue, "from handle search");

    const listData = await getProductionOrderItemList(inputPoValue[0].docEntry);

    if (listData.hasError) {
      setInputQrValue("");
      setLoading(false);
      return toastDisplayer(
        "error",
        listData.errorMessage ? listData.errorMessage : "Something went wrong"
      );
    }
    // Check if the item already exists in the listingDataSource
    const isDuplicate = listingDataSource.some(
      (item) => item[0].docEntry === inputPoValue[0].docEntry
    );

    if (isDuplicate) {
      // Item already exists, show a message or handle as needed
      setLoading(false);
      return toastDisplayer("error", "Duplicate Production order Entry");
    } else {
      // Item doesn't exist, add it to the listingDataSource
      setLoading(false);
      setListingDataSource([...listingDataSource, inputPoValue]);
    }

    await setInfogridDataSource(listData.responseData);
    setLoading(false);
  };

  const handleDeleteItem = (index) => {
    const updatedListingData = listingDataSource.filter((_, i) => i !== index);
    setListingDataSource(updatedListingData);
  };

  const handleProceed = (headerQrId) => {
    navigate(`/issue-material/scanitems/${headerQrId}`); // Use navigate function
  };
  useEffect(() => {
    async function selectedInputValueSetter() {
      const data = await inputPoValue;
      // console.log("From use effect", data);
      setInputPoValue(data);
      console.log("To use effect", data);
    }
    selectedInputValueSetter();
  }, [inputPoValue]);
  return (
    <>
      <div className="content-block dx-card responsive-paddings default-main-conatiner issue-material-container ">
        {loading && <LoadPanel visible={true} />}
        {/*----header Section ------*/}

        <div className="header-section">
          <PopupHeaderText text={"Issue Material"} />
          <PopupSubText text={"Search the production number to proceed"} />
        </div>

        {/*----Input Textbox search/ scan section ------*/}
        <div className="search-section">
          <TextBox
            className="dx-field-value"
            stylingMode="outlined"
            placeholder="Click help icon to choose.."
            width={250}
            showClearButton={true}
            valueChangeEvent="keyup"
            onValueChanged={inputQrValueChangedCallback}
            value={inputPoValue.length > 0 ? inputPoValue[0].itemCode : ""}
          >
            <TextBoxButton
              name="currency"
              location="after"
              options={helpOptions}
            />
          </TextBox>
          <Button
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon="search"
            onClick={handleSearch}
            disabled={isSearchButtonDisabled}
            value={inputQrValue}
          />
          <Button
            width={33}
            height={33}
            type="normal"
            stylingMode="outlined"
            icon={GRPOScanner}
            onClick={() => console.log("You have cliced the scanner")}
          />
        </div>

        {/*------- LISTING SECTION -----*/}
        {listingDataSource.length > 0 ? (
          <IssueMaterialListing
            listingDataSource={listingDataSource}
            onDeleteItem={handleDeleteItem}
            onProceed={handleProceed}
            infogridDataSource={infogridDataSource}
          />
        ) : (
          ""
        )}
      </div>
      {showPoHelpPopup && (
        <IssueMaterialPoHelpPopup
          poHelpDataSource={poHelpDataSource}
          setShowPoHelpPopup={setShowPoHelpPopup}
          inputPoValue={inputPoValue}
          setInputPoValue={setInputPoValue}
        />
      )}
    </>
  );
};

export default IssueMaterialMain;
