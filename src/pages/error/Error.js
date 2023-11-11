import React from 'react';

const Error = ({ code }) => {
    const errors = {
        404: {
            message: 'La page que vous cherchez est introuvale.'
        },
        403: {
            message: 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.'
        }
    };

    const errorMessage = errors[code] ? errors[code].message : 'Erreur inconnue';

    return (
        <div>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-lg-6'>
                        <h1>Erreur {code}</h1>
                        <span className='park-address'>
                            {errorMessage}
                        </span>
                        {/* <img src={Image} className='error-image' /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;
