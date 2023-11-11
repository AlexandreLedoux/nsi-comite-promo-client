import React, { useState, useEffect } from 'react';

const Loading = () => {
    const icons = [
        'earth-europe',
        'compass',
        'bicycle',
        'planet-ringed',
        'person-snowboarding'
    ];

    const [randomIcon, setRandomIcon] = useState('');

    useEffect(() => {
        // Choisissez un index aléatoire pour sélectionner une icône aléatoire
        const randomIndex = Math.floor(Math.random() * icons.length);
        // Utilisez l'icône associée à l'index aléatoire
        setRandomIcon(icons[randomIndex]);
    }, [icons]);

    return (
        <div className='loading'>
            {/* Utilisez la classe CSS basée sur l'icône aléatoire choisie */}
            <i className={`fa-regular fa-${randomIcon} fa-spin`}></i>
        </div>
    );
};

export default Loading;