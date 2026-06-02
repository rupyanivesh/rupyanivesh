import React from 'react';
import { Navigate } from 'react-router-dom';
import { authStorage } from '../utils/authStorage';

const ProtectedRoute = ({ children }) => {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/mfd/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

