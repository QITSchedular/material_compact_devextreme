import React from "react";
// import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import "./incomingQC.scss";
import IncomingQCComponent from "./incomingQC";
import IncomingQc_Header from "./IncomingQc-Header";

function IncomingQCPage() {

    return (
        <>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks qcCSS">
                    <IncomingQc_Header header_title="Incoming Quality Control" header_content="Ckeck the quality and make the decision" />
                </div>

                <div className="inQCDropDownSection">
                    <IncomingQCComponent />
                </div>
            </div>
        </>
    );
}

export default IncomingQCPage;
