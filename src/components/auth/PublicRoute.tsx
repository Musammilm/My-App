import React, { ReactNode,ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps): ReactElement | null => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? <Navigate to="/Home" replace /> : <>{children}</>;
};

export default PublicRoute;
