import React, { useContext, useEffect, useState } from 'react';
import authAPI from '../../services/authAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import SimpleForm from '../../components/module/SimpleForm';
import FormCover from '../../components/pages/FormCover';
import NavButton from '../../components/module/NavButton';

const Login = () => {
    const storedData = JSON.parse(window.localStorage.getItem("authLockEmail"));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get('next');
    const [lock, setLock] = useState(authAPI.hasLockEmail());
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }

        if (lock) {
            setFormData({ ...formData, ['email']: storedData.email });
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsSubmitted(true);

        authAPI.authenticate(formData)
            /**
                SELECT * 
                FROM user 
                WHERE email = 'a@a.com' AND password = 'motDePasseHaché'; 
            */
            .then(response => {
                setIsAuthenticated(true);
                if (next) {
                    navigate(next, { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            })
            .catch(error => {
                if (error.response.status == 401) {
                    setError(
                        "Email ou mot de passe invalide."
                    );
                } else if (error.response.status == 403) {
                    setError(
                        "Vous n\'avez pas validé votre email."
                    );
                }
                setIsSubmitted(false);
            });
    };

    const links = [
        {
            text: 'S\'inscrire',
            url: '/register',
            btnLink: true,
            icon: 'user-plus',
        }
    ];

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
            value: formData.imapasswordge,
            onChange: handleChange,
            placeholder: "Mot de passe",
            type: 'password',
            error: error.password,
        },
    ];

    const formsLock = [
        {
            name: "password",
            label: "Mot de passe",
            value: formData.imapasswordge,
            onChange: handleChange,
            placeholder: "Mot de passe",
            type: 'password',
            error: error.password,
        },
    ]

    const deleteLock = () => {
        authAPI.deleteLock();
        setLock(false);
        setFormData({
            email: '',
            password: '',
        });
    };

    if (lock) {
        links.push({
            text: 'Oublier ce compte',
            onClick: deleteLock,
            btnLink: true,
            icon: 'trash',
        });
    }

    if (authAPI.hasLockEmail()) {
        return (
            <div>
                <NavButton links={links} />
                <FormCover
                    content={<SimpleForm forms={formsLock} onSubmit={handleSubmit} isSubmitted={isSubmitted} button='Se connecter' errorMessage={error} btnColor='noir' />}
                    title={'Bonjour ' + storedData.name}
                    backLink={false}
                />
            </div>
        )
    } else {
        return (
            <div>
                <NavButton links={links} />
                <FormCover
                    content={<SimpleForm forms={forms} onSubmit={handleSubmit} isSubmitted={isSubmitted} button='Se connecter' errorMessage={error} btnColor='noir' />}
                    title='Connexion'
                    backLink={false}
                />
            </div>
        );
    }
};

export default Login;
