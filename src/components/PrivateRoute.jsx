import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get authentication state from context

  return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;


















