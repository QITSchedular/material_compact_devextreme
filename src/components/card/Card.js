import React, { useEffect, useState } from 'react';
import './Card.scss';
import { Button } from 'devextreme-react';
import { pin } from '../../assets/icon';
import { Link } from 'react-router-dom';


export default function Card({ title, description, icon, path }) {
    return (
        <>
            <div className={'dx-card content'}>
                <div className='pin' style={{ "textAlign": "right" }}>
                    <Button icon={pin} />
                </div>
                <div className='card-body'>
                    <Link to={path} >
                        <div className={'header'}>
                            <Button icon={icon} />
                            <div className={'heading'}>{title}</div>
                        </div>
                        <div className={'description'}>{description}</div>
                    </Link>
                    <div className='circle'>
                        {Math.floor(Math.random() * 100)}
                    </div>
                </div>
                <div className='card-footer'>
                    <Button icon="refresh" type='default' stylingMode="outlined" text='Refresh' />
                    <span>
                        3 mins ago
                    </span>
                </div>
            </div>

            {/* <div className={'dx-card content'}>
                <div className='pin'>
                    <Button icon={pin} />
                </div>
                <Link to={path} >
                    <div style={{ display: "flex", justifyContent: "space-between", "flex-direction": "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", "alignItems": "center" }}>
                            <div className={'circle'}>30</div>
                            <div className={'description'}>{description}</div>
                        </div>
                    </div>
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", "margin-top": "10px", "alignItems": "center" }}>
                    <Button icon="refresh" type='default' text='Refresh' style={{ "margin": "0px" }} />
                    <span>3 mins ago</span>
                </div>
            </div> */}
        </>
    )
}
