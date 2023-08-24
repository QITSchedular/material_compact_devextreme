import React from 'react'
import IncomingQc_Header from './IncomingQc-Header'
import IncommingQcScanItem from './IncommingQcScanItem'

function IncomingQcScanItemsPage() {
  return (
    <>
        <div className="content-block dx-card responsive-paddings">
            <div className="content-blocks qcCSS">
                <IncomingQc_Header header_title="Incoming Quality Control" header_content="Ckeck the quality and make the decision" />
            </div>

            <div className="inQCDropDownSection">
                <IncommingQcScanItem />
            </div>
        </div>
    </>
  )
}

export default IncomingQcScanItemsPage