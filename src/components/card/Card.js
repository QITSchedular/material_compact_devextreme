import React, { useEffect, useState } from 'react';
import './Card.scss';
import { Link } from 'react-router-dom';
import { toastDisplayer } from '../../api/qrgenerators';

import debounce from "lodash/debounce";

export default function Card({ title, description, icon, path }) {
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);


    const loaderStter = () => {
        return setLoading(false);
    }

    const showSimmer = debounce(loaderStter, 2000);


    const rotateButton = () => {
        setRotation(rotation + 360);
    };

    let handlePinClick = (key) => {
        toastDisplayer("succes", `${key} pined`);
    }

    function ValueAnimator({ start, end, duration }) {
        const [currentValue, setCurrentValue] = useState(start);

        useEffect(() => {
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                setCurrentValue(Math.floor(progress * (end - start) + start));

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        }, [start, end, duration]);

        return <div id="value">{currentValue}</div>;
    }

    useEffect(() => {
        showSimmer();
    }, [])

    return (
        <>
            <div className={'dx-card content'}>
                {!loading ? (
                    <>
                        <div className={'pin'}>
                            <span className="material-symbols-outlined card-icon" onClick={() => handlePinClick(title)}>
                                push_pin
                            </span>
                        </div>
                        <Link to={path}>
                            <div className='card-header'>
                                <div className={'title'}>
                                    <span className="material-symbols-outlined card-icon">
                                        {icon}
                                    </span>
                                    <div className={'heading'}>{title}</div>
                                </div>
                            </div>
                            <div className='card-body'>
                                <div className={'description'}>{description}</div>
                            </div>
                        </Link>
                        <div className='card-footer'>
                            <div className={"refresh-part"}>
                                <span className="rfcbtn material-symbols-outlined" onClick={rotateButton} style={{ transform: `rotate(${rotation}deg)` }}>
                                    refresh
                                </span>
                                <span>
                                    {Math.floor(Math.random() * 10)} mins ago
                                </span>
                            </div>
                            <div className={"number-part"}>
                                <ValueAnimator start={0} end={Math.floor(Math.random() * 10000)} duration={500} />
                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        <div className={'pin skeleton'}></div>
                        <div className='card-header'>
                            <div className={'title skeleton'}></div>
                        </div>
                        <div className='card-body skeleton'></div>
                        <div className='card-footer'>
                            <div className={"refresh-part skeleton"}></div>
                            <div className={"number-part skeleton"}></div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}