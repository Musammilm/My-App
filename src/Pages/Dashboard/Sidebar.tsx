import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBuilding, FaBox, FaChartBar, FaBars, FaTachometerAlt,FaCashRegister  } from 'react-icons/fa';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/front', Icon:  FaTachometerAlt },
    { label: 'Company', path: '/company', Icon: FaBuilding },
    { label: 'Products', path: '/manageproducts', Icon: FaBox },
    { label: 'Reports', path: '/reports', Icon: FaChartBar },
    { label: 'Billing', path: '/product', Icon:FaCashRegister  },
  
  ];

  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      {!collapsed && <h3 className="sidebar-title">My APP</h3>}
      <ul className="sidebar-menu">
        {navItems.map(({ label, path, Icon }) => (
          <li
            key={path}
            className={`sidebar-item ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon className="sidebar-icon" />
            {!collapsed && <span>{label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
