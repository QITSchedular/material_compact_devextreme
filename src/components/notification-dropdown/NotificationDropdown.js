import { Button } from 'devextreme-react';
import './NotificationDropdown.scss';
import { useState } from 'react';

function NotificationDropdown() {
    const notificationWords = [
        "New message received!",
        "You have a notification.",
        "Important update!",
        "Event reminder!",
        "Check your inbox!",
        "Don't forget!",
        "Meeting alert!",
        "Task completed!",
        "News just in!",
        "Action required!",
    ];

    const notificationData = [
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
            // unread: false
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
            // unread: true
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
            // unread: false
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
            // unread: true
        },
    ];

    const [rotation, setRotation] = useState(0);

    const rotateButton = () => {
        setRotation(rotation + 180);
    };

    return (
        <div className='dropdown-background'>
            <div className="notifydropdown">
                <div className="notifydropdown-header">
                    <div>
                        <div className="heading">Notifcations</div>
                        <div className="sub-heading">All the notifications at one place!</div>
                    </div>
                    <Button icon={"refresh"} onClick={rotateButton} style={{ transform: `rotate(-${rotation}deg)` }} className='rfcbtn' />
                </div>
                <div className="notifydropdown-body">
                    {
                        notificationData.map((values, index) => (
                            <>
                                <div className={`notification ${values.unread ? 'unread' : ''}`}>
                                    <div>
                                        <div className='notify-title'>{values.title}</div>
                                        <div className='notify-time'>{values.time}</div>
                                    </div>
                                    {(values.unread === "true") ? <div className='notify-unread'></div> : ""}
                                </div>
                            </>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default NotificationDropdown;
