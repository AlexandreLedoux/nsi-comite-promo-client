import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import userAPI from '../../services/userAPI';
import authAPI from '../../services/authAPI';
import NavButton from '../../components/module/NavButton';
import FormCover from '../../components/pages/FormCover';
import SimpleForm from '../../components/module/SimpleForm';

const Settings = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
    });
    const [user, setUser] = useState(authAPI.getUser());

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(false);

        console.log(formData);

        userAPI.changePassword(user.id, formData)
            .then(response => {
                //navigate('/settings', { replace: false });
                console.log('ok');
            })
            .catch(error => {
                console.log(error);
                if (error.response.status == 422) {
                    for (const violation of error.response.data.violations) {
                        setError(previousErrors => ({
                            ...previousErrors,
                            [violation.propertyPath]: violation.message
                        }));
                    }
                }
            });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const forms = [
        {
            name: "password",
            label: "Nouveau mot de passe",
            value: formData.password,
            onChange: handleChange,
            placeholder: "Nouveau mot de passe",
            type: 'password',
            error: error.password,
        }
    ]

    const deleteUser = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action supprimera définitivement votre compte ainsi que toutes les données qui y sont associées. Cette action est irréversible.')) {
            userAPI.deleteUser(authAPI.getUser().id)
                .then((response) => {
                    authAPI.logout();
                    setIsAuthenticated(false);
                    navigate('/login', { replace: true });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const links = [
        {
            text: 'Accueil',
            url: '/',
            btnLink: true,
            icon: 'house',
        },
        {
            text: 'Nouvelle idée',
            url: '/idea/new',
            btnLink: true,
            icon: 'thought-bubble',
        },
        {
            text: 'Se déconnecter',
            url: '/logout',
            btnLink: true,
            icon: 'user-slash',
        }
    ];

    return (
        <div>

            <NavButton links={links} />
            <div className='container'>
                <div className='message'>
                    <h1>
                        Mon compte
                    </h1>
                    <span>{authAPI.getUser().username}</span>
                </div>
                <button onClick={deleteUser} className='btn btn-black'>Supprimer mon compte</button>

                {/*
                <SimpleForm forms={forms} onSubmit={handleSubmit} isSubmitted={isSubmitted} button='Enregistrer' />
                */}
            </div>

        </div >
    );
};

export default Settings;
