import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken'); // or sessionStorage

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
