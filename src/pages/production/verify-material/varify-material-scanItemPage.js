import React from 'react'
import Varify_Header from './varify-header'
import Varify_Material_ScanItem from './varify-material-scanItem'

function VarifyMaterialScanItemPage() {
  return (
    <>
        <div className="content-block dx-card responsive-paddings">
            <div className="content-blocks qcCSS">
                <Varify_Header header_title="Verify Material" header_content="Header here" />
            </div>

            <div className="VarifyMaterialSearchSection">
                <Varify_Material_ScanItem />
            </div>
        </div>
    </>
  )
}

export default VarifyMaterialScanItemPage