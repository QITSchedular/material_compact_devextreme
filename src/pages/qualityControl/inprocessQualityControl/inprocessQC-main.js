import React from "react";
// import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import "./inprocessQC.scss";
import InprocessQCComponent from "./inprocessQC";
import InprocessQc_Header from "./InprocessQc_Header";

function InprocessQCPage() {

    return (
        <>
            <div className="content-block dx-card responsive-paddings" id="mainContainer-iQC">
                <div className="content-blocks qcCSS">
                    <InprocessQc_Header header_title="In-process Quality Control" header_content="Ckeck the quality and make the decision" />
                </div>

                <div className="inQCDropDownSection">
                    <InprocessQCComponent />
                </div>
            </div>
        </>
    );
}

export default InprocessQCPage;
