import React from "react";
import "./home.scss";
import CreateAccountForm from "../../components/create-account-form/CreateAccountForm";
export default function Home() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Home</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <CreateAccountForm />
        </div>
      </div>
    </React.Fragment>
  );
}
