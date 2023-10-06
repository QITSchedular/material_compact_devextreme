import React from 'react'
import { Button } from 'devextreme-react/button';
import { useNavigate } from 'react-router-dom';

function BackBtn() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // Navigates back to the previous page in the browser history
    };

    const canGoBack = window.history.length > 1;
    return (
        <>
            <Button
                width={33}
                height={33}
                type="normal"
                stylingMode="outlined"
                onClick={handleBackClick}
                disabled={!canGoBack}
            >
                <span class="material-symbols-outlined">
                    arrow_back
                </span>
            </Button>
        </>
    )
}

export default BackBtn