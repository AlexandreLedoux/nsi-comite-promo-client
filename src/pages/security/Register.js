import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userAPI from '../../services/userAPI';
import SimpleForm from '../../components/module/SimpleForm'
import FormCover from '../../components/pages/FormCover';
import NavButton from '../../components/module/NavButton';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsSubmitted(true);
        setError([]);

        userAPI.create(formData)
            .then(response => {
                navigate('/verify/' + response.data.id, { replace: true });
            })
            .catch(error => {
                if (error.response.status === 422) {
                    for (const violation of error.response.data.violations) {
                        setError(previousErrors => ({
                            ...previousErrors,
                            [violation.propertyPath]: violation.message
                        }));
                    }
                } else {
                    console.log(error);
                }
                setIsSubmitted(false);
            });
    };


    const forms = [
        {
            name: "email",
            label: "Email",
            value: formData.email,
            onChange: handleChange,
            placeholder: "Email de connexion",
            type: 'email',
            error: error.email,
        },
        {
            name: "password",
            label: "Mot de passe",
            value: formData.password,
            onChange: handleChange,
            placeholder: "Mot de passe",
            type: 'password',
            error: error.password,
        },
    ]

    const links = [
        {
            text: 'Se connecter',
            url: '/login',
            btnLink: true,
            icon: 'user',
        },
    ];

    return (
        <div>

            <NavButton links={links} />

            <FormCover
                content={<SimpleForm forms={forms} onSubmit={handleSubmit} isSubmitted={isSubmitted} button="S'inscrire" btnColor='noir' />}
                title='Inscription'
            />

        </div>
    );
};

export default Register;
