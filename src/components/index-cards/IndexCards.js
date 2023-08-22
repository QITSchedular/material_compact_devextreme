import React from 'react';
import './IndexCards.scss';
import { navigation } from '../../app-navigation';
import { Link } from 'react-router-dom';
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
                        <Link to={value['path']} key={key}>
                            <Card
                                title={value['text']}
                                description={"Here is the description for the particular card"}
                                icon={Icon[value['icon']]}
                            />
                            {/* {
                            document.write(window.innerWidth)
                        } */}
                        </Link>
                    ))}
            </div>
        </React.Fragment>
    );
}
