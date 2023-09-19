import { UseHeaderContext } from '../../contexts/headerContext';
import './NotificationDropdown.scss';
import { useEffect, useState } from 'react';

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
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
        },
        {
            title: `${notificationWords[Math.floor(Math.random() * notificationWords.length)]}`,
            time: `${Math.floor(Math.random() * 59) + 1} min ago`,
            unread: `${Boolean(Math.round(Math.random()))}`
        },
    ];

    const [rotation, setRotation] = useState(0);

    const rotateButton = () => {
        setRotation(rotation + 360);
    };

    const { notifyDropdownRef, setisNotifyDropdownOpen } = UseHeaderContext();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(event.target)) {
                const isIconClicked = event.target.classList.contains('bell-icon'); // Adjust the class name accordingly
                if (!isIconClicked || notifyDropdownRef.current.contains(event.target)) {
                    setisNotifyDropdownOpen((prev) => {
                        return !prev;
                    });
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [notifyDropdownRef, setisNotifyDropdownOpen]);

    return (
        <div className='dropdown-background'>
            <div className="notifydropdown" ref={notifyDropdownRef}>
                <div className="notifydropdown-header">
                    <div>
                        <div className="heading">Notifcations</div>
                        <div className="sub-heading">All the notifications at one place!</div>
                    </div>
                    <span className="rfcbtn material-symbols-outlined" onClick={rotateButton}
                        style={{ transform: `rotate(${rotation}deg)` }} title='Refresh'>
                        cached
                    </span>
                </div>
                <div className="notifydropdown-body">
                    {
                        notificationData.map((values) => (
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
