
import { React } from 'react';

const LinkCard = ({ link }) => {
    return(
        <>
            <h2>Link</h2>
            <p>Shorty: <a href={link.to} target='_blank' rel='noopener noreferrer'>{link.to}</a></p>
            <p>Long: <a href={link.from} target='_blank' rel='noopener noreferrer'>{link.from}</a></p>
            <p>Clicks: <strong>{link.clicks}</strong></p>
            <p>Date: <strong>{new Date (link.date).toLocaleDateString()}</strong></p>

        </>
    )
}

export default LinkCard