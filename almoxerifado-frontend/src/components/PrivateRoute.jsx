import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && usuario.tipo !== requiredRole) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default PrivateRoute;