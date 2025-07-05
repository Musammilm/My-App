import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './DashboardLayout.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import UserProfile from '../UserProfile/Userprofile'; // Adjust the import path as needed
const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

 

  // 🟨 Auto collapse for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize(); // run once
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div className={`dashboard-main ${collapsed ? 'collapsed' : ''}`}>
        <div className="top-navbar">
          <h2 className="navbar-title">Dashboard</h2>
          <UserProfile handleLogout={handleLogout} />


        </div>
        <Breadcrumbs />
        
        {/* 🟩 DASHBOARD CONTENT */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
