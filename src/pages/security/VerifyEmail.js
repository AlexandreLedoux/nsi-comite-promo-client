import React, { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SimpleForm from '../../components/module/SimpleForm'
import FormCover from '../../components/pages/FormCover';
import verifyEmailAPI from '../../services/verifyEmailAPI';
import { AuthContext } from '../../contexts/AuthContext';
import authAPI from '../../services/authAPI';

const VerifyEmail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        token: '',
    });
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsSubmitted(true);
        setError([]);

        const data = {
            user: '/api/users/' + id,
            token: formData.token
        }

        verifyEmailAPI.verifyEmail(data)
            .then(response => {
                authAPI.authWithToken(response.data.token);
                setIsAuthenticated(true);
                navigate('/', { replace: true });
            })
            .catch(error => {
                console.log(error);
                setError(previousErrors => ({
                    ...previousErrors,
                    ['token']: error.response.data.message
                }));
                setIsSubmitted(false);
            });
    };

    const forms = [
        {
            name: "token",
            label: "Token",
            value: formData.token,
            onChange: handleChange,
            placeholder: "Token",
            type: 'text',
            error: error.token,
            help: 'Veuillez vérifier vos emails.'
        }
    ]

    return (
        <div>

            <FormCover
                content={<SimpleForm forms={forms} onSubmit={handleSubmit} isSubmitted={isSubmitted} button="Vérifier" />}
                title='Vérifier mon compte'
            />

        </div>
    );
};

export default VerifyEmail;
