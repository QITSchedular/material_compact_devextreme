import React from 'react'
import error404 from '../../assets/images/error404.svg'
import './NotFound.scss'

function NotFound() {
    return (
        <>
            <div className="errorcontent">
                <img src={error404} height={280} width={400} alt={'404'} className='image404' />
                <div className="line1">OOOPS ! PAGE NOT FOUND</div>
                <div className="line2">Perhaps it's on a coffee break.</div>
            </div>
        </>
    )
}

export default NotFound

