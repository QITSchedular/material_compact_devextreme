import React from 'react'
import InprocessQc_Header from './InprocessQc_Header'
import InprocessQcScanItem from './inprocessQcScanItem';

function InprocessQcScanItemsPage() {
    return (
        <>
            <div className="content-block dx-card responsive-paddings">
                <div className="content-blocks qcCSS">
                    <InprocessQc_Header header_title="In-process Quality Control" header_content="Ckeck the quality and make the decision" />
                </div>

                <div className="inQCDropDownSection">
                    <InprocessQcScanItem />
                </div>
            </div>
        </>
    )
}

export default InprocessQcScanItemsPage