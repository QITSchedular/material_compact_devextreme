import {
  Button,
  Form,
  LoadPanel,
  Popup,
  ScrollView,
  SelectBox,
} from "devextreme-react";
import { ButtonItem, GroupItem, Item, SimpleItem } from "devextreme-react/form";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./items-master.scss";
import TabbedItemComponent from "./tabbed-item-component";
import {
  addNewItem,
  getItemGroup,
  getItemSubGroup,
  getQrManagedBy,
  getUom,
} from "../../utils/items-master-data";
import ArrayStore from "devextreme/data/array_store";
import { AppContext } from "../../contexts/dataContext";
import NotificationToast from "../notification/notification";
import Notify from "devextreme/ui/notify";
import {
  SuccessToast,
  showToastNotifications,
} from "../../utils/showToastsNotifications";
import { RequiredRule } from "devextreme-react/data-grid";
const ItemMasterForm = () => {
  const { isPopupVisible, isItemAdded, openPopup, closePopup, newItemIsAdded } =
    useContext(AppContext);
  const [popupVisible, setPopupVisible] = useState(true);
  const [itemsGrpData, setItemsgrpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const sampleUoMData = [
    { id: 1, name: 5 },
    { id: 2, name: 4 },
    { id: 3, name: 3 },
  ];
  const itemMangedByData = [
    { id: 1, name: "S" },
    { id: 2, name: "N" },
    { id: 3, name: "b" },
  ];

  //editor Options values for all the selecBoxes
  const [itemsGroupEditorOptions, setItemsGroupEditorOptions] = useState("");
  const [qrManagedByOptions, setQrManagedByOptions] = useState("");
  const [itemsSubGroupOptions, setItemsSubGroupOptions] = useState("");
  const [toastIsVisible, setToastIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uomOptions, setUomOptions] = useState({
    dataSource: sampleUoMData,
    stylingMode: ["outlined"],
    displayExpr: "name",
    valueExpr: "name",
  });
  const [itemsManagedByOptions, setitemsManagedByOptions] = useState({
    dataSource: itemMangedByData,
    stylingMode: ["outlined"],
    displayExpr: "name",
    valueExpr: "name",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //form Validation Rules
  let validationRules = {
    itemCode: [{ type: "required", message: "Item Code is required." }],
    uom: [{ type: "required", message: "Uom is required." }],
  };

  // Button - input options
  const saveButtonOptions = {
    text: "Save",
    type: "default",
    useSubmitBehavior: true,
  };
  const cancelButtonOptions = {
    text: "cancel",
    useSubmitBehavior: false,
    onClick: async () => {
      await handleClosePopUp();
    },
  };

  const dropdownOptions = {
    stylingMode: ["outlined"],
    labelModes: ["static"],
  };
  const textEditorOptions = {
    stylingMode: ["outlined"],
    cssClass: "myEditor",
  };
  const onHandEditorOptions = {
    stylingMode: ["outlined"],
    disabled: true,
    value: 10,
  };

  // pop visibility handler
  const handleShowPopup = () => {
    setPopupVisible(true);
  };
  const handleClosePopUp = async () => {
    const form = formRef.current.instance;
    // form.resetValidationStatus();
    form.resetValues();
    return await closePopup();
  };
  // const handleCloseButton = async () => {
  //   const form = formRef.current.instance;
  //   return await closePopup();
  // };
  const hideInfo = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowWidth]);

  //api call for pop fill data
  useEffect(() => {
    openPopup();
    getItemGroup();
    getItemSubGroup();
    getQrManagedBy();
    getUom();
    const getData = async () => {
      setLoading(true);
      const getItemGroupData = await getItemGroup();
      const getItemSubGroupData = await getItemSubGroup();
      const getUomData = await getUom();
      const getQrManagedByData = await getQrManagedBy();

      await setItemsGroupEditorOptions({
        dataSource: getItemGroupData,
        stylingMode: ["outlined"],
        displayExpr: "itmsGrpNam",
        valueExpr: "itmsGrpCod",
      });
      //itesm managed by and qr managed by will be same api bases
      await setQrManagedByOptions({
        dataSource: getQrManagedByData,
        stylingMode: ["outlined"],
        displayExpr: "qrMngByName",
        valueExpr: "qrMngById",
      });

      await setItemsSubGroupOptions({
        dataSource: getItemSubGroupData,
        stylingMode: ["outlined"],
        displayExpr: "itmsSubGrpNam",
        valueExpr: "itmsSubGrpNam",
      });
      await setUomOptions({
        dataSource: getUomData,
        stylingMode: ["outlined"],
        displayExpr: "uomCode",
        valueExpr: "uomEntry",
      });

      setLoading(false);
    };
    getData();
  }, []);

  // handle Form data
  const formRef = useRef(null);
  const clearFormData = () => {
    const form = formRef.current.instance;
    // form.resetValidationStatus();
    form.resetValues();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current.instance;
    const formData = form.option("formData");
    const transformedData = {
      itemCode: formData["Item Code"],
      itemName: formData["Item Name"],
      itmsGrpCod: formData["Item Group"],
      uomEntry: formData["UOM"],
      qrMngBy: formData["Qr Managed By"],
      itemMngBy: formData["Item Managed By"],
      isActive: "Y",
      atcEntry: 0,
    };
    try {
      const response = await addNewItem(transformedData);

      if (response.statusCode === "200") {
        newItemIsAdded();
      }

      await showToastNotifications(response);
      setIsSubmitted(true);
      form.resetValues();
      setIsSubmitted(false);
    } catch (error) {
      await form.resetValues();
      console.log(error);
    }
  };
  return (
    <>
      <Popup
        maxWidth={850}
        height={500}
        visible={isPopupVisible}
        onHiding={hideInfo}
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={true}
        shading={true}
        container=".dx-viewport"
        className="item-master-popup-container"
      >
        {loading ? (
          <LoadPanel visible={true} />
        ) : (
          <ScrollView width="100%" height="100%">
            <div
              className={
                "dx-card content-block responsive-paddings pop-content-container"
              }
            >
              <div className="popup-header">
                <div className="popUp-header-title">Add New Item</div>
                <Button icon="close" onClick={handleClosePopUp} />
              </div>

              <form onSubmit={handleSubmit} id="popupform">
                <Form
                  ref={formRef}
                  labelLocation={"top"}
                  id="form"
                  labelMode="floating"
                  style={{ boxShadow: "none" }}
                  className="form-element"
                >
                  <GroupItem>
                    <Item
                      dataField="Item Name"
                      editorOptions={textEditorOptions}
                      cssClass={"textItems"}
                    >
                      <RequiredRule message="Item Name is required" />
                    </Item>
                    <Item
                      dataField="Item Code"
                      editorOptions={textEditorOptions}
                      cssClass={"textItems"}
                    >
                      <RequiredRule message="Item Code is required" />
                    </Item>
                  </GroupItem>
                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={2}
                    stylingMode={"outlined"}
                    cssClass={"textitems"}
                  >
                    <Item
                      dataField="Item Group"
                      editorType="dxSelectBox"
                      editorOptions={itemsGroupEditorOptions}
                      cssClass={"textitems"}
                    />
                    <Item
                      dataField="Item Sub Group"
                      editorType="dxSelectBox"
                      editorOptions={itemsSubGroupOptions}
                      cssClass={"textitems"}
                    />
                    <Item
                      dataField="UOM"
                      editorType="dxSelectBox"
                      editorOptions={uomOptions}
                      cssClass={"textitems"}
                    >
                      <RequiredRule message="Uom is required" />
                    </Item>
                    <Item
                      dataField="Item Managed By"
                      editorType="dxSelectBox"
                      editorOptions={qrManagedByOptions}
                      cssClass={"textitems"}
                    />
                    <Item
                      dataField="Qr Managed By"
                      editorType="dxSelectBox"
                      editorOptions={qrManagedByOptions}
                      cssClass={"textitems"}
                    />
                    <SimpleItem
                      dataField="On Hand"
                      editorOptions={onHandEditorOptions}
                      cssClass={"textitems"}
                    />
                  </Item>
                  <GroupItem cssClass={"tabbed-items-group"}>
                    <h4 style={{ color: "#525252" }}>Warehouse Details</h4>
                    <TabbedItemComponent />
                  </GroupItem>

                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={1}
                    cssClass={"bottom-button-section submit-section"}
                  >
                    <ButtonItem
                      horizontalAlignment="right"
                      buttonOptions={cancelButtonOptions}
                      cssClass={"popup-btn-cancel"}
                    />
                    <ButtonItem
                      horizontalAlignment="right"
                      buttonOptions={saveButtonOptions}
                      cssClass={"popup-btn-save"}
                    />
                  </Item>
                  {/* <GroupItem cssClass={"submit-section"}>
                    <Button
                      text="Cancel"
                      icon="close"
                      onClick={handleClosePopUp}
                      className="cancel-button"
                    />
                    <Button
                      type="default"
                      text="Save"
                      icon="save"
                      useSubmitBehavior={true}
                      className="save-button"
                    />
                  </GroupItem> */}
                </Form>
              </form>
            </div>
          </ScrollView>
        )}
      </Popup>
    </>
  );
};

export default ItemMasterForm;
