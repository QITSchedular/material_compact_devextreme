import React from 'react'
import Notfound from '../../assets/images/error404.gif'
import './NotFound.scss'

function NotFound() {
    return (
        <>
            <div className="errorcontent">
                <img src={Notfound} height={250} width={250} />
                <p className="line1">OOOPS ! PAGE NOT FOUND</p>
                <p className="line2">Sorry the page you are looking for does not exists.</p>
            </div>
        </>
    )
}

export default NotFound

