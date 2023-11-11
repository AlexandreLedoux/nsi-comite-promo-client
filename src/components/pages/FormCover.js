import React from 'react';

const FormCover = ({ content, title }) => {
    return (
        <div>
            <div className='container'>
                <div className='container-card'>
                    <h1 className='mb-20 mt-0'>{title}</h1>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default FormCover;
