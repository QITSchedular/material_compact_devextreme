import React from 'react'
import { Button } from 'devextreme-react/button';
import './MachineInOut.scss';
function MachineInOut() {
    return (
        <>
            <div className="card">
                <div className="content-block-wrapper">
                    <div className="content-block-1">
                        <div className="content-text">
                            <div className="content-text-header">Login and Logout</div>
                            <div className="content-text-info">Please enter login and logout time</div>
                            <div className="Btndiv">
                                <Button className="my-btn" text="Login" type="default" width={124} height={44} />

                                <Button className="my-btn" text="Log out" type="default" width={124} height={44} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default MachineInOut