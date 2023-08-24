import React from 'react'

function InprocessQc_Header({ header_title, header_content }) {
    return (
        <>
            <div className="content-blocks headeQC">
                <div className="content-block-wrapper">
                    <div className="content-block-1">
                        <div className="content-text">
                            <div className="content-text-header qcTitle">
                                {header_title}
                            </div>
                            <div className="content-text-info qcDesc">
                                {header_content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InprocessQc_Header