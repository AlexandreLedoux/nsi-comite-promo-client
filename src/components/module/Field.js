import React from 'react';
import { Link } from 'react-router-dom';

const doForceLowercase = (element) => {
    element.value = element.value.toLowerCase();
};

const Field = ({
    name,
    label,
    value,
    onChange,
    placeholder = "",
    type = "text",
    error = "",
    required = true,
    options = [],
    help,
    helpUrl,
    forceLowercase
}) => {
    return (
        <div className="mb-3d">
            <label htmlFor={name} className='form-label'>
                {label}
            </label>
            {type === "select" ? ( // Vérifie le type du champ
                <select
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={name}
                    className={"form-select" + (error && " is-invalid")}
                    required={required}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            ) : type === "checkbox" ? (
                <div className="form-check">
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={onChange}
                        name={name}
                        id={name}
                        className={"form-check-input" + (error && " is-invalid")}
                        required={required}
                    />
                    <label htmlFor={name} className="form-check-label">
                        {label}
                    </label>
                </div>
            ) : type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder || label}
                    name={name}
                    id={name}
                    className={"form-control force-lowercase" + (error && " is-invalid")}
                    required={required}
                    onInput={forceLowercase ? (e) => doForceLowercase(e.target) : null}
                    rows={4}
                />
            ) : (
                // Champ de saisie par défaut
                <input
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder || label}
                    name={name}
                    id={name}
                    className={"form-control" + (error && " is-invalid")}
                    required={required}
                    onInput={forceLowercase ? (e) => doForceLowercase(e.target) : null}
                />
            )}
            { }
            {help && (
                <div className="form-help">
                    {help}
                </div>
            )}
            {error && <p className="invalid-feedback mt-0">{error}</p>}
        </div>
    );
};

export default Field;
