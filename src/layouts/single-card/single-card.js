import React from "react";
import ScrollView from "devextreme-react/scroll-view";
import "./single-card.scss";
import { Button } from "devextreme-react/button";

export default function SingleCard({
  title,
  description,
  children,
  extraCustomClass,
  headerText,
}) {
  return (
    <ScrollView
      height={"100%"}
      width={"100%"}
      className={"with-footer single-card"}
    >
      <div className={`dx-card content ${extraCustomClass}`}>
        <span className="dx-card-upper-header">{headerText}</span>
        <div className={"header"}>
          <div className={"title"}>{title}</div>
          <div className={"description"}>{description}</div>
        </div>
        {children}

        {/**
      
        <div className="dx-card-style">
          <div className="dx-card-style-line"></div>
          <span>OR</span>
          <div className="dx-card-style-line"></div>
        </div>
        <div className="template-auh-btn">
          <Button
            className="google-auth-btn"
            icon="home"
            text="Continue With Google"
            width={"100%"}
          ></Button>
        </div>
      */}
      </div>
    </ScrollView>
  );
}
