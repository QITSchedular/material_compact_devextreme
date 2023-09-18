import React from "react";
import "./home.scss";
// import CreateAccountForm from "../../components/create-account-form/CreateAccountForm";
import { IndexCards } from "../../components";
export default function Home() {
  return (
    <React.Fragment>
      <div className="index-card-container">
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Master</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/masters"} />
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Purchase</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/purchases"} />
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Quality Control</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/qualityControl"} />
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Production</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/production"} />
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Inventory</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/inventory"} />
        <div className={"index-card-heading"}>
          <span className={"line"}></span>
          <span className="index-card-title">Sales</span>
          <span className={"line"}></span>
        </div>
        <IndexCards path={"/sales"} />
      </div>
    </React.Fragment>
  );
}
