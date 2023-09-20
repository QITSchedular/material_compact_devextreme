import React, { useState } from 'react'
import { Button } from 'devextreme-react/button';
import './MachineInOut.scss';
import {
    Popup
} from 'devextreme-react/popup';
import { TextArea } from 'devextreme-react/text-area';
import scanner from "./scanner.png";
import { MultiView } from 'devextreme-react';



const QrCodes = ({ QrArray }) => {
    console.log(QrArray.data.detailQRcode)
    return (
        <>
            <div className='qrCodeSection'>
                <div className='qrCodeSectionSub1'>

                    <div>
                        <img src={scanner} height={100} width={100} />
                    </div>
                </div>
                <div className='qrCodeSectionSub2'>
                    <div className='qrCodeSectionSubSub1'>
                        <div>
                            <span className='detailHeaderTxt'>{QrArray.data.detailQRcode}</span>
                        </div>
                        <div>
                            <span className='timeTxt'>{QrArray.data.time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function MachineInOut() {
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const [statusLogin, setstatusLogin] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const togglePopup = () => {
        setstatusLogin(true);
        setPopupVisibility(!isPopupVisible);
    }
    const togglePopup1 = () => {
        setstatusLogin(false);
        setPopupVisibility(!isPopupVisible);
    }

    const handleCancel = () => {
        setPopupVisibility(false);
    }

    const QrArray = [
        {
            "detailQRcode": "CACDAHBH AH 000004 0000034",
            "time": "Time 12:00 A.m.",
            "img": scanner
        },
        {
            "detailQRcode": "CACDAHBH AH 000004 0000035",
            "time": "Time 11:00 A.m.",
            "img": scanner
        },
        {
            "detailQRcode": "CACDAHBH AH 000004 0000036",
            "time": "Time 01:00 A.m.",
            "img": scanner
        },
        {
            "detailQRcode": "CACDAHBH AH 000004 0000037",
            "time": "Time 02:00 A.m.",
            "img": scanner
        }
    ];

    const onSelectionChanged = (args) => {
        if (args.name === "selectedIndex") {
            //   setSelectedIndex(args.value);
        }
    };

    return (
        <>
            <div className="card">
                <div className="content-block-wrapper">
                    <div className="content-block-1">
                        <div className="content-text">
                            <div className="content-text-header">Login and Logout</div>
                            <div className="content-text-info">Please enter login and logout time</div>
                        </div>
                    </div>
                    <div className="Btndiv">
                        <Button className="my-btn" text="Login" type="default" width={124} height={44} onClick={togglePopup} />

                        <Button className="my-btn" text="Log out" type="default" width={124} height={44} onClick={togglePopup1} />
                    </div>
                </div>
            </div>
            {isPopupVisible && (
                <Popup
                    visible={isPopupVisible}
                    showCloseButton={true}
                    hideOnOutsideClick={false}
                    onHiding={togglePopup}
                    width={500}
                    height={520}
                >
                    <div className="content-blocks">
                        <div className='MachineInOutMainDiv'>

                            <div className="content-block-wrapper">
                                <div className="content-block-1">
                                    <div className="content-text">

                                        <div className="Machine-header">Scan the Machine QR Code</div>
                                        <div className="Machine-text-info">Please place the camera near Qr code</div>
                                    </div>
                                    <div className="close-btn-section">
                                        <Button icon="close" onClick={handleCancel} />
                                    </div>
                                </div>
                            </div>
                            <div className='qrCodeSection'>
                                <div class="container-qr">
                                    <div class='background-container'>
                                        <div class="qr-background1"></div>
                                        <div class="qr-background2"></div>
                                    </div>
                                    <div class='background-container'>
                                        <div class="qr-background3"></div>
                                        <div class="qr-background4"></div>
                                    </div>
                                    <div class="overlay">
                                        <img src={scanner} height={100} width={100} />
                                    </div>
                                </div>
                                {/* <div className='qrCodeSectionSub1'>
                                    <img src={scanner} height={100} width={100} />
                                </div> */}
                                <div className='qrCodeSectionSub2'>
                                    <div className='qrCodeSectionSubSub1'>
                                        <div>
                                            <span className='detailHeaderTxt'>CACDAHBH AH 000004 0000034</span>
                                        </div>
                                        <div>
                                            <span className='timeTxt'>Time 11:00 A.m.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='qrCodeSection'>
                                <div className='qrCodeSectionSub1'>
                                    <div>
                                        <Button
                                            width={33}
                                            height={33}
                                            type="normal"
                                            stylingMode="outlined"
                                            icon="back"
                                        // onClick={SearchHandler}
                                        />
                                    </div>
                                    <div>
                                        <img src={scanner} height={100} width={100} />
                                    </div>
                                    <div>
                                        <Button
                                            width={33}
                                            height={33}
                                            type="normal"
                                            stylingMode="outlined"
                                            icon="chevronnext"
                                        // onClick={SearchHandler}
                                        />
                                    </div>
                                </div>
                                <div className='qrCodeSectionSub2'>
                                    <div className='qrCodeSectionSubSub1'>
                                        <div>
                                            <span className='detailHeaderTxt'>CACDAHBH AH 000004 0000034</span>
                                        </div>
                                        <div>
                                            <span className='timeTxt'>Time 11:00 A.m.</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className='qrCodeSection-main'>
                                <div className='qrPreBtn'>
                                    <Button
                                        width={33}
                                        height={33}
                                        type="normal"
                                        stylingMode="outlined"
                                        icon="back"
                                    // onClick={SearchHandler}
                                    />
                                </div>
                                <div>
                                    <MultiView
                                        className='qrCodeMultiview'
                                        dataSource={QrArray}
                                        selectedIndex={0}
                                        onOptionChanged={onSelectionChanged}
                                        loop={true}
                                        itemComponent={(data) => (
                                            <QrCodes QrArray={data} /> // Pass the function as a prop to QrViewBox
                                        )}
                                        animationEnabled={true}
                                    />
                                </div>
                                <div className='qrNextBtn'>
                                    <Button
                                        width={33}
                                        height={33}
                                        type="normal"
                                        stylingMode="outlined"
                                        icon="chevronnext"
                                    // onClick={SearchHandler}
                                    />
                                </div>
                            </div> */}
                            <div className='buttonSection'>
                                <div>
                                    <TextArea
                                        labelMode='floating'
                                        label='Write Remarks'
                                        className="form-element"
                                        stylingMode="outlined"
                                    >
                                    </TextArea>
                                </div>
                                <div>
                                    {
                                        statusLogin ?
                                            <Button
                                                className='Machine-btn' onClick={() => { setPopupVisibility(false) }} text={'Login'} />
                                            :
                                            <Button
                                                className='Machine-btn' onClick={() => { setPopupVisibility(false) }} text={'Logout'} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Popup>
            )}
        </>

    )
}

export default MachineInOut