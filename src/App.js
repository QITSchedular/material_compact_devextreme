import "devextreme/dist/css/dx.common.css";
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
import "./themes/custom-theme/dx.material.custom-scheme-material-compact.css";
import React from "react";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
// import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";
import { AppContextProvider } from "./contexts/dataContext";
import { ToastContainer } from "react-toastify";
import "animate.css/source/animate.css";
import "react-toastify/dist/ReactToastify.css";
import { SettingProvider } from "./contexts/settingConfig";
import { HeaderProvider } from "./contexts/headerContext";

// const Loading = () => {
//     const loadingStyles = {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         width: '100%',
//         background: '#f2f2f2',
//     };

//     const textStyle = {
//         color: '#4371B7',
//         fontSize: '24px',
//         marginLeft: '16px',
//     };

//     return (
//         <div style={loadingStyles}>
//             <div style={textStyle}>Loading...</div>
//         </div>
//     );
// };

function App() {
    const { user, loading } = useAuth();

    // const [isConnected, setIsConnected] = useState(navigator.onLine);
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     function getLocalIPAddress() {
    //         window.RTCPeerConnection =
    //             window.RTCPeerConnection ||
    //             window.mozRTCPeerConnection ||
    //             window.webkitRTCPeerConnection; // Set up the RTCPeerConnection constructor.

    //         const pc = new RTCPeerConnection({ iceServers: [] });

    //         pc.createDataChannel(''); // Create a dummy data channel.

    //         pc.onicecandidate = (e) => {
    //             if (e.candidate && e.candidate.address === "7140f0b5-9b7a-4de5-8ae3-29c529181b4c.local") {
    //                 setIsConnected(true)
    //                 return setIsLoading(false);
    //             }
    //             else {
    //                 setIsConnected(false);
    //                 return setIsLoading(true);
    //             }
    //         };

    //         pc.createOffer()
    //             .then((offer) => pc.setLocalDescription(offer))
    //             .catch((error) => console.error('Error:', error));
    //     }

    //     getLocalIPAddress();
    // }, []);

    // if (isLoading || !isConnected) {
    //     return (
    //         <Loading />
    //     );
    // }

    if (user) {
        return <Content />;
    }

    return <UnauthenticatedContent />;
}

export default function Root() {
    const screenSizeClass = useScreenSizeClass();

    return (
        <Router>
            <ToastContainer />
            <AuthProvider>
                <NavigationProvider>
                    <AppContextProvider>
                        <SettingProvider>
                            <div className={`app ${screenSizeClass}`}>
                                <HeaderProvider>
                                    <App />
                                </HeaderProvider>
                            </div>
                        </SettingProvider>
                    </AppContextProvider>
                </NavigationProvider>
            </AuthProvider>
        </Router>
    );
}
