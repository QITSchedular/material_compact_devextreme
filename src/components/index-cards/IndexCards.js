import React from 'react';
// import './IndexCards.scss';
import { navigation } from '../../app-navigation';
import Card from '../../components/card/Card';
import * as Icon from '../../assets/icon';

export default function IndexCards({ path }) {
    let navobj = {}, arr = [];

    navigation.forEach((value1, key) => {
        Object.keys(value1).forEach((value2, key) => {
            if (value2 === 'items') {
                arr = value1[value2];
                navobj[value1['path']] = arr;
            }
        })
    });

    return (
        <React.Fragment>
            <div className="grid-container">
                {
                    navobj[path].map((value, key) => (
                        <>
                            {(typeof value['icon'] === "object") ? console.log(value['icon'].dark) : console.log(value['icon'])}
                            <Card
                                title={value['text']}
                                description={"Here is the description for the particular card"}
                                // icon1={value['icon'].dark}
                                icon={(typeof value['icon'] === "object") ? value['icon'].dark : value['icon']}
                                path={value['path']}
                            />
                        </>
                    ))}
            </div>
        </React.Fragment>
    );
}
