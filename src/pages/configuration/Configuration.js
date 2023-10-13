import React, { useEffect, useState } from 'react'
import './configuration.scss'
import { Button, LoadPanel, Tabs } from 'devextreme-react'
import { UseSettingContext } from '../../contexts/settingConfig';
import { toastDisplayer } from "../../api/qrgenerators";
import { Item } from 'devextreme-react/accordion';
import ConfigTab from './TabContent/ConfigTab';
import QCTab from './TabContent/QCTab';


export default function Configuration() {
    const { SettingValues, isValueUpdated } = UseSettingContext();

    const handleSaveClick = async () => {
        try {
            // const response = await setSettingConfig(SettingValues);
            // console.log('Settings saved:', response);
            console.log('Settings saved:', SettingValues);
        } catch (error) {
            console.error('API Error:', error);
            return toastDisplayer('error', error.message);
        }
    };

    const [loading, setloading] = useState(true);
    useEffect(() => {
        if (SettingValues) {
            setloading(false);
        }
    }, [SettingValues]);

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="custom-card">
            <div className="card-header">
                <Tabs
                    selectedIndex={0}
                    onItemClick={(e) => setActiveTab(e.itemIndex)}
                    id="selectTab"
                >
                    <Item text="Configuration"></Item>
                    <Item text="Quality Control"></Item>
                </Tabs>
            </div>
            <div className="card-body" id='configuration'>
                {
                    loading ? (
                        <LoadPanel
                            shadingColor="rgba(0,0,0,0.4)"
                            position={{ of: '#configuration' }}
                            visible={loading}
                            showIndicator={true}
                            shading={false}
                            showPane={true}
                        />
                    ) : activeTab === 0 ? (
                        <ConfigTab />
                    ) : activeTab === 1 ? (
                        <QCTab />
                    ) : null
                }


            </div>
            <div className="card-footer">
                <div className='btn-group'>
                    <Button
                        text={'Save'}
                        stylingMode='contained'
                        type='default'
                        className='my-button save-button'
                        onClick={handleSaveClick}
                    // disabled={!isValueUpdated}
                    />
                </div>
            </div>
        </div>
    )
}
