import React from 'react';
import Field from '../module/Field';

const SimpleForm = ({ forms, onSubmit, isSubmitted, button, errorMessage = '', btnColor = 'black' }) => {
    return (
        <div>

            {errorMessage && (
                <div className='idea-card mb-20 alert-danger' role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={onSubmit}>
                {forms.map((form, index) => (
                    <div key={index}>
                        <Field
                            name={form.name}
                            label={form.label}
                            value={form.value}
                            onChange={form.onChange}
                            placeholder={form.placeholder}
                            type={form.type}
                            error={form.error}
                            required={form.required}
                            help={form.help}
                            helpUrl={form.helpUrl}
                            options={form.options}
                            forceLowercase={form.forceLowercase}
                        />
                    </div>
                ))}
                <div className='mt-20'>
                    <button id="btn-submit" type="submit" className={'btn w-100 btn-' + btnColor} disabled={isSubmitted}>{button}</button>
                </div>
            </form>

        </div>
    );
};

export default SimpleForm;
