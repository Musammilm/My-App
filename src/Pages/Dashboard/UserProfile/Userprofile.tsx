// UserProfile.tsx
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Userprofile.css';

const UserProfile: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="user-profile-container">
      {/* Profile Button */}
      <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
        <FaUserCircle className="profile-icon" />
        <span className="profile-name">Admin</span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="profile-dropdown">
  <div className="profile-dropdown-header horizontal">
    <FaUserCircle className="profile-icon-sm" />
    <div>
      <strong className="admin-name">Admin</strong>
      <p className="role">FrontEnd Developer</p>
    </div>
  </div>
  <hr />
  <button onClick={handleLogout} className="logout-btn">Logout</button>
</div>

      )}
    </div>
  );
};

export default UserProfile;
