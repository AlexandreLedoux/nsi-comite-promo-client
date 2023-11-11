import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BottomBar = ({ links }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const ButtonText = (link, index) => {
        return (
            <i className={'fa-' + (location.pathname === link.url ? 'solid' : link.selected ? 'solid' : 'regular') + ' fa-' + link.icon}></i>
        );
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>

            <div className='d-sm-none'>
                <div className='bottom-bar'>
                    {links.map((link, index) => (
                        <div key={index}>
                            {link.url && (
                                <Link to={link.url} className='bottom-bar-link' disabled={link.disabled}>
                                    {ButtonText(link, index)}
                                </Link>
                            )}
                            {link.onClick && (
                                <button onClick={link.onClick} className='bottom-bar-link' disabled={link.disabled}>
                                    {ButtonText(link, index)}
                                </button>
                            )}
                            {link.back && (
                                <button onClick={goBack} className='bottom-bar-link' disabled={link.disabled}>
                                    {ButtonText(link, index)}
                                </button>
                            )}
                            {link.multiple && (
                                <div className="dropdown">
                                    <button className="bottom-bar-link dropdown-togglea" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {ButtonText(link, index)}
                                    </button>
                                    <ul className="dropdown-menu bottom-bar-dropdown-menu">
                                        {link.multiple.map((item, indexB) => (
                                            <li key={indexB}>
                                                {item.url && (
                                                    <Link to={item.url} className={'dropdown-item bottom-bar-dropdown-item' + (indexB === 0 ? ' border-radius-top-14' : '') + (link.multiple.length === indexB + 1 ? ' border-radius-bottom-14' : '')}><i className={'fa-regular fa-' + (item.icon) + ' mr-10'}></i>{item.name}</Link>
                                                )}
                                                {item.modal && (
                                                    <>
                                                        <button data-bs-toggle='modal' data-bs-target={item.modal['data-bs-target']} className={'dropdown-item bottom-bar-dropdown-item' + (indexB === 0 ? ' border-radius-top-14' : '') + (link.multiple.length === indexB + 1 ? ' border-radius-bottom-14' : '')} onClick={item.modal.onClick}><i className={'fa-regular fa-' + (item.icon) + ' mr-10'}></i>{item.name}</button>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {link.modal && (
                                <button className='bottom-bar-link' disabled={link.disabled} data-bs-toggle='modal' data-bs-target={link.modal['data-bs-target']} onClick={link.modal.onClick}>
                                    {ButtonText(link, index)}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div >
    );
};

export default BottomBar;