import React from 'react'
import Notfound from '../../assets/images/error404.svg'
import './NotFound.scss'
import { BackBtn } from '../../components'

function NotFound() {
    return (
        <>
            <div className="errorcontent">
                <img src={Notfound} height={280} width={400} />
                <p className="line1">OOOPS ! PAGE NOT FOUND</p>
                <p className="line2">Sorry the page you are looking for does not exists.</p>
            </div>
        </>
    )
}

export default NotFound

