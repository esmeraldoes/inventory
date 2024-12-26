

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth();

    // If the user is not logged in, redirect to the login page
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
