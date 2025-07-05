// src/components/layout/Breadcrumbs.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('front').filter((x) => x);

  return (
    <nav className="breadcrumb-container">
      <Link to="front" className="breadcrumb-link">Dashboard</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = value.charAt(0).toUpperCase() + value.slice(1);
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span className="breadcrumb-current" key={to}>{label}</span>
        ) : (
          <Link className="breadcrumb-link" to={to} key={to}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
