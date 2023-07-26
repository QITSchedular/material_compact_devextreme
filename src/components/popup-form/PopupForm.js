import React, { useContext, useRef, useState } from "react";
import "./PopupForm.scss";
import {
    Form,
    Popup,
    ScrollView,
} from "devextreme-react";
import { Button } from 'devextreme-react/button';
import { ButtonItem, GroupItem, Item } from "devextreme-react/form";
import { AppContext } from "../../contexts/dataContext";
import { RequiredRule } from "devextreme-react/form";

import success from '../../assets/images/success.gif';


const PopupForm = ({
    title,
    field,
}) => {
    const formPopup = useRef(null);

    // Button - input options
    const saveButtonOptions = {
        text: "Save",
        type: "info",
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

    const [displayState, setdisplayState] = useState(true);

    const { isCommonPopupVisible, closeCommonPopup } = useContext(AppContext);
    const [popupVisible, setCommonPopupVisible] = useState(true);
    const hideInfo = () => {
        setCommonPopupVisible(false);
    };

    const handleClosePopUp = async () => {
        const form = formPopup.current.instance;
        form.resetValues();
        return await closeCommonPopup();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = formPopup.current.instance;
        form.resetValues();
        setdisplayState(false);

        setInterval(() => {
            setdisplayState(true);
        }, 1800);
    };

    var checkBoxOptions = {
        text: "Locked",
    };

    return (
        <>
            <Popup
                maxWidth={850}
                height={500}
                visible={isCommonPopupVisible}
                onHiding={hideInfo}
                dragEnabled={false}
                hideOnOutsideClick={false}
                showCloseButton={true}
                shading={true}
                container=".dx-viewport"
                className="item-master-popup-container"
            >
                <ScrollView ScrollView width="100%" height="100%">
                    <div className={"dx-card content-block responsive-paddings pop-content-container"}>
                        {
                            (displayState)
                                ?
                                <>
                                    <div className="popup-header">
                                        <h4>{title}</h4>
                                        <Button icon="close" onClick={handleClosePopUp} />
                                    </div>

                                    <form id="popupform" onSubmit={handleSubmit}>
                                        <Form
                                            ref={formPopup}
                                            labelLocation={"top"}
                                            id="form"
                                            labelMode="floating"
                                            style={{ boxShadow: "none" }}
                                            className="form-element">
                                            <GroupItem>
                                                {field.map((item, index) => {
                                                    checkBoxOptions = {
                                                        text: item.label,
                                                    };
                                                    const key = item.feildType;
                                                    const isValidate = item.isValidate;
                                                    const label = item.label;
                                                    if (key === "dxCheckBox") {
                                                        return (
                                                            <Item
                                                                dataField="  "
                                                                editorOptions={checkBoxOptions}
                                                                editorType={key}
                                                            >
                                                                {isValidate && (
                                                                    <RequiredRule message={label + " is Required"} />
                                                                )}
                                                            </Item>
                                                        );
                                                    } else {
                                                        return (
                                                            <Item
                                                                dataField={label}
                                                                editorOptions={textEditorOptions}
                                                                editorType={key}
                                                            >
                                                                {isValidate && (
                                                                    <RequiredRule message={label + " is Required"} />
                                                                )}
                                                            </Item>
                                                        );
                                                    }
                                                })}
                                            </GroupItem>
                                            <Item
                                                itemType="group"
                                                colCount={2}
                                                colSpan={1}
                                                cssClass={"bottom-button-section submit-section"}
                                            >
                                                <ButtonItem
                                                    buttonOptions={cancelButtonOptions}
                                                    horizontalAlignment="right"
                                                    cssClass={"popup-btn-cancel"}
                                                // onClick={handleClosePopUp}
                                                />
                                                <ButtonItem
                                                    buttonOptions={saveButtonOptions}
                                                    horizontalAlignment="right"
                                                    useSubmitBehavior={true}
                                                    cssClass={"popup-btn-save"}
                                                />
                                            </Item>
                                        </Form>
                                    </form>
                                </>
                                :
                                <div className="successAlert">
                                    <span className="title">{title} Successful</span>
                                    <img src={success} alt="success" height="200" width="200" />
                                </div>
                        }
                    </div>
                </ScrollView>

            </Popup>
        </>
    );
};

export default PopupForm;