import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginContext } from '../context/LoginContextObject.js'; // Importa o Context do LoginContextObject.js

function PrivateRoute({ allowedRoles }) {
    const { isAuthenticated, userRole } = useContext(LoginContext);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;