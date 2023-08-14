import React from 'react';
import './Card.scss';
import { Button } from 'devextreme-react';
import { pin } from '../../assets/icon';


export default function Card({ title, description, icon }) {
    return (
        <div className={'dx-card content'}>
            <div className='pin'>
                <Button icon={pin} />
            </div>
            <div className={'header'}>
                <Button icon={icon} />
                <div className={'heading'}>{title}</div>
            </div>
            <div className={'description'}>{description}</div>
        </div>
    )
}
