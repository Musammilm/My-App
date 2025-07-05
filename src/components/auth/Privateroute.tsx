import React, { ReactNode,ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): ReactElement | null => {
  const token = localStorage.getItem('authToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
