import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavButton = ({ links, backLink = false }) => {
    const defaultBackLink = {
        text: 'Accueil',
        url: '/',
        btnLink: true,
        icon: 'home',
    };

    if (backLink) {
        // Si backLink est vrai, ajoutez le lien backLink en premier dans la liste de liens.
        links = [defaultBackLink, ...links];
    }


    const text = (link) => {
        return (
            <>
                {link.icon && (
                    <i className={'fa-regular fa-' + link.icon + ' mr-6'}></i>
                )}
                {link.text}
            </>
        );
    };

    return (
        <div>
            <div className='container-lg'>
                <div className='row'>
                    {links.map((link, index) => (
                        <div key={index}>
                            {link.url ? (
                                <Link to={link.url} className={'my-20' + (index !== 0 ? ' ml-20' : '') + (link.btnLink ? ' btn-link text-black' : ' btn')}>
                                    {text(link)}
                                </Link>
                            ) : (
                                <button onClick={link.onClick} className={'my-20' + (index !== 0 ? ' ml-20' : '') + (link.btnLink ? ' btn-link text-black' : ' btn')}>
                                    {text(link)}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavButton;
