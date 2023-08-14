import React from "react";
// import { HelpIcons } from "../../purchases/grpo/icons-exporter";
import "./incomingQC.scss";
import IncomingQCComponent from "./incomingQC";

const HeaderContent = () => {
    return (

        <div className="content-blocks headeQC">
            <div className="content-block-wrapper">
                <div className="content-block-1">
                    <div className="content-text">
                        <div className="content-text-header qcTitle">
                            Incoming Quality Control
                        </div>
                        <div className="content-text-info qcDesc">
                            Ckeck the quality and make the decision
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

function IncomingQCPage() {

    return (
        <>
            <div className="content-block dx-card responsive-paddings">
            <div>{window.innerWidth}</div>
                    <div>{window.innerHeight}</div> 
                <div className="content-blocks qcCSS">
                    
                    <HeaderContent />
                </div>

                <div className="inQCDropDownSection">
                    <IncomingQCComponent />
                </div>
            </div>
        </>
    );
}

export default IncomingQCPage;
