import React, { useState } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { EmployeeItem } from './EmployeeItem.js';
import { employees } from './data.js';
import './styles.scss';
import image from './Featured icon.svg';




const App = () => {
    const renderContent = () => {
        return (
            <>
                {/* first model */}
                <div Style="margin-left:40px;">
                    <h4>Are you sure you want to delete?</h4>
                    <Button
                        text="Yes"
                        onClick={buttonClick}
                        width="100"
                    />
                    <Button
                        text="No"
                        width="100"
                    />
                </div>

                {/* last model */}
                {/* <div Style="margin-left:25px;">
                    <h4>Delete Item</h4>
                    <p>Are you sure you want to delete this item?</p>
                    <div Style="margin-top:70px;">
                        <Button
                            text="No"
                            onClick={buttonClick}
                            width={150}
                        />
                        <Button
                            className="Delete-btn"
                            text="Delete"
                            width={150}
                        />
                    </div>
                </div> */}

                {/* logo model */}
                {/* <div Style="margin-left:25px;">
                    <img src={image} height="60" width="60" />
                    <h4>Delete Item</h4>
                    <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                    <Button
                        text="No"
                        onClick={buttonClick}
                        width={150}
                    />
                    <Button
                        text="Delete"
                        className="Delete-btn"
                        width={150}
                    />
                </div> */}
            </>


        );
    }
    const [currentEmployee, setCurrentEmployee] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);
    const [positionOf, setPositionOf] = useState('');
    const showInfo = () => {
        // setCurrentEmployee(employee);
        // setPositionOf(`#image${employee.ID}`);
        setPopupVisible(true);
    };

    const buttonClick = () => {
        // ...
        setPopupVisible(false);
    }

    const hideInfo = () => {
        setCurrentEmployee({});
        setPopupVisible(false);
    };

    const sendEmail = () => {
        const message = `Email is sent to ${currentEmployee.FirstName} ${currentEmployee.LastName}`;
        notify(
            {
                message,
                position: {
                    my: 'center top',
                    at: 'center top',
                },
            },
            'success',
            3000
        );
    };

    const showMoreInfo = () => {
        const message = `More info about ${currentEmployee.FirstName} ${currentEmployee.LastName}`;
        notify(
            {
                message,
                position: {
                    my: 'center top',
                    at: 'center top',
                },
            },
            'success',
            3000
        );
    };

    const moreInfoButtonOptions = {
        text: 'More info',
        onClick: showMoreInfo,
    };

    const emailButtonOptions = {
        icon: 'email',
        text: 'Send',
        onClick: sendEmail,
    };

    const closeButtonOptions = {
        text: 'Close',
        onClick: hideInfo,
    };



    const items = employees.map((employee) => (
        <li key={employee.ID}>
            <EmployeeItem employee={employee} showInfo={showInfo} />
        </li>
    ));

    return (
        <div id="container">
            <h1>Employees</h1>
            <ul>{items}</ul>
            <Popup
                dragEnabled={false}
                hideOnOutsideClick={false}
                showCloseButton={true}
                showTitle={false}
                container=".dx-viewport"
                // width={400}
                // height={240}

                //first model
                width={350}
                height={150}

                visible={popupVisible}
                contentRender={renderContent}
            >
            </Popup>
        </div>
    );
};

export default App;
