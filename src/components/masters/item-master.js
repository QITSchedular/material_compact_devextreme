import {
  Form,
  LoadPanel,
  Popup,
  ScrollView,
  SelectBox,
} from "devextreme-react";
import { ButtonItem, GroupItem, Item, SimpleItem } from "devextreme-react/form";
import React, { useEffect, useRef, useState } from "react";
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

const ItemMasterForm = () => {
  const [popupVisible, setPopupVisible] = useState(true);
  const [itemsGrpData, setItemsgrpData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const validationRules = {
    itemName: [{ type: "required", message: "Item Name is required." }],
    itemCode: [{ type: "required", message: "Item Code is required." }],
    uom: [{ type: "required", message: "Uom is required." }],
  };

  // Button - input options
  const saveButtonOptions = {
    text: "Save",
    type: "info",
    useSubmitBehavior: true,
  };
  const cancelButtonOptions = {
    text: "cancel",
    useSubmitBehavior: true,
  };

  const dropdownOptions = {
    stylingMode: ["outlined"],
    labelModes: ["static"],
  };
  const textEditorOptions = {
    stylingMode: ["outlined"],
  };

  // pop visibility handler
  const handleShowPopup = () => {
    setPopupVisible(true);
  };

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
  const handleSubmit = (e) => {
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

    const response = addNewItem(transformedData);
    // Access the form values using the e.component option and log them
    // console.log(e.target.value);
  };
  // const getItemGroupCode = (itemGroup) => {
  //   const data = itemsGroupEditorOptions.dataSource;
  //   //console.log(data);
  //   const foundItemGroup = data.find((item) => item.itmsGrpNam === itemGroup);
  //   if (foundItemGroup) {
  //     return foundItemGroup.itmsGrpCod;
  //   } else {
  //     // Handle case when item group is not found
  //     return null;
  //   }
  // };
  // const getUomCode = (uom) => {
  //   const data = uomOptions.dataSource;
  //   // console.log(data);
  //   const foundItemUom = data.find((uomItem) => uomItem.uomCode === uom);
  //   if (foundItemUom) {
  //     return foundItemUom.uomEntry;
  //   } else {
  //     // Handle case when item group is not found
  //     return null;
  //   }
  // };
  return (
    <>
      <Popup
        maxWidth={850}
        height={500}
        visible={popupVisible}
        onHiding={hideInfo}
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={true}
        shading={true}
        // showTitle={true}
        // title="Items Master"
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
              <h4>Add New Item</h4>
              <form onSubmit={handleSubmit} id="popupform">
                <Form
                  ref={formRef}
                  labelLocation={"top"}
                  id="form"
                  labelMode="floating"
                  style={{ boxShadow: "none" }}
                >
                  <GroupItem>
                    <Item
                      dataField="Item Name"
                      editorOptions={textEditorOptions}
                      validationRules={validationRules.itemName}
                    />
                    <Item
                      dataField="Item Code"
                      editorOptions={textEditorOptions}
                      validationRules={validationRules.itemCode}
                    />
                  </GroupItem>
                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={2}
                    stylingMode={"outlined"}
                  >
                    <Item
                      dataField="Item Group"
                      editorType="dxSelectBox"
                      editorOptions={itemsGroupEditorOptions}
                    />
                    <Item
                      dataField="Item Sub Group"
                      editorType="dxSelectBox"
                      editorOptions={itemsSubGroupOptions}
                    />
                    <Item
                      dataField="UOM"
                      editorType="dxSelectBox"
                      editorOptions={uomOptions}
                      validationRules={validationRules.uom}
                    />
                    <Item
                      dataField="Item Managed By"
                      editorType="dxSelectBox"
                      editorOptions={itemsManagedByOptions}
                    />
                    <Item
                      dataField="Qr Managed By"
                      editorType="dxSelectBox"
                      editorOptions={qrManagedByOptions}
                    />
                    <SimpleItem
                      dataField="On Hand"
                      editorOptions={textEditorOptions}
                    />
                  </Item>
                  <GroupItem cssClass={"tabbed-items-group"}>
                    <h4 style={{ color: "#525252" }}>Warehouse Details</h4>
                    <TabbedItemComponent />
                  </GroupItem>

                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={2}
                    cssClass={"bottom-button-section"}
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
