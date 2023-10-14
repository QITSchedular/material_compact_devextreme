import React from 'react'
import error404 from '../../assets/images/error404.svg'
import './NotFound.scss'
import { Button } from 'devextreme-react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <>
            <div className="errorcontent">
                <img src={error404} alt={'404'} className='image404' />
                <div className="line">OOPS ! PAGE NOT FOUND</div>
                <Link to={"/home"}>
                    <Button
                        className="back-to-home"
                        icon="arrowleft"
                        text="Back to Home"
                        type={"default"}
                        stylingMode={"outlined"}
                    />
                </Link>
            </div>
        </>
    )
}

export default NotFound
