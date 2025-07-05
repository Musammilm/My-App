import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import img2 from '../../Assets/img2.jpg';
import img4 from '../../Assets/img4.jpg';
import img6 from '../../Assets/img6.jpg';
import img8 from '../../Assets/img8.jpg';

const FrontPage: React.FC = () => {
  return (
    <div className="frontpage-wrapper">
      {/* Navbar */}
      <nav className="frontpage-nav">
        <div className="nav-left">MyApp</div>
        <div className="nav-right">
          <Link to="" className="nav-link">About</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">ContactUs</Link>
        </div>
      </nav>

      {/* Image Slider */}
      <div className="slider">
        <div className="slides">
          <img src={img2} alt="Slide 1" />
          <img src={img4} alt="Slide 2" />
          <img src={img6} alt="Slide 3" />
          <img src={img8} alt="Slide 4" />
        </div>
      </div>

      {/* Content */}
      <div className="frontpage-content">
        <h1>Welcome to Our Application</h1>
        <p>Secure, fast, and user-friendly app for modern web experiences.</p>
      </div>

      {/* Footer */}
      <footer className="frontpage-footer">
        <p>© 2025 MyApp. All rights reserved.</p>
        <p>Your one-stop solution for seamless registration and login handling with modern UI.</p>
      </footer>
    </div>
  );
};

export default FrontPage;
