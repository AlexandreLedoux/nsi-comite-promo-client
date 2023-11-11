import React, { useContext, useEffect } from 'react';
import authAPI from '../../services/authAPI';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Logout = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        authAPI.lock();
        setIsAuthenticated(false);
        navigate('/', { replace: true });
    }, []);
};

export default Logout;
