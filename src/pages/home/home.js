import React from "react";
import "./home.scss";
import CreateAccountForm from "../../components/create-account-form/CreateAccountForm";
import { SingleCard } from "../../layouts";
export default function Home() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Home</h2>
      <div
        className={"content-block"}
        style={{ display: "flex", justifyContent: "center", gap: "15px" }}
      >
        <SingleCard />
        <SingleCard />
        <SingleCard />
      </div>
    </React.Fragment>
  );
}
