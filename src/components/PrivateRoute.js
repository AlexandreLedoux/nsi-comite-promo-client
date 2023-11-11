import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import authAPI from '../services/authAPI';
import Error from '../pages/error/Error';

const PrivateRoute = ({ element, afterPath, role }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        if (afterPath) {
            return <Navigate to={'/login?next=' + afterPath} replace={true} />
        } else {
            return <Navigate to={'/login'} replace={true} />
        }
    }

    if (!authAPI.hasRole(role)) {
        return <Error code={403} />;
    }

    return element;
};

export default PrivateRoute;
