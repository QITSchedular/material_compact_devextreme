import React, { useState } from 'react'
import { Button } from 'devextreme-react/button';
import './MachineInOut.scss';
import {
    Popup
} from 'devextreme-react/popup';


function MachineInOut() {
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const [statusLogin, setstatusLogin] = useState(true);
    const togglePopup = () => {
        setstatusLogin(true);
        setPopupVisibility(!isPopupVisible);
    }
    const togglePopup1 = () => {
        setstatusLogin(false);
        setPopupVisibility(!isPopupVisible);
    }
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
                    hideOnOutsideClick={true}
                    onHiding={togglePopup}
                    width={500}
                    height={500}
                >
                    <div className="content-blocks">
                        <div className="content-block-wrapper">
                            <div className="content-block-1">
                                <div className="content-text">
                                    <div className="Machine-header">Scan the Machine QR Code</div>
                                    <div className="Machine-text-info">Please place the camera near Qr code</div>
                                </div>
                            </div>
                        </div>
                        <h1>QR-Code</h1>
                        {
                            statusLogin ?
                                <Button
                                    className='Machine-btn' onClick={() => { setPopupVisibility(false) }} text={'Login'} />
                                :
                                <Button
                                    className='Machine-btn' onClick={() => { setPopupVisibility(false) }} text={'Logout'} />
                        }
                    </div>
                </Popup>
            )}
        </>

    )
}

export default MachineInOut