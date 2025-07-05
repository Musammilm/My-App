import React from 'react';
import './Frontcard.css';
import { useNavigate } from 'react-router-dom';

const Frontcard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('authToken'); // or whatever key you use
  navigate('/login');
};

  return (
    <div className="dashboard-layout">
    
      <div className="dashboard-content">
 
      

        {/* 🟩 DASHBOARD CARDS */}
        <div className="card-wrapper">
          <div className="card" onClick={() => navigate('/company')}>
            <h3>Company Details</h3>
            <p>Manage company info, address, and contacts.</p>
          </div>

          <div className="card" onClick={() => navigate('/Manageproducts')}>
            <h3>Products</h3>
            <p>Add and manage products and prices.</p>
          </div>

          <div className="card" onClick={() => navigate('/reports')}>
            <h3>Reports</h3>
            <p>View sales reports.</p>
          </div>
          <div className="card" onClick={() => navigate('/product')}>
            <h3>Product Billing</h3>
            <p> sell products and generate bills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frontcard;
