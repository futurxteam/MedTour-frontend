import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/styles/Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="header-inner">
        
        {/* LOGO */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="MedTour Logo" className="site-logo" />
        </div>

        {/* NAV LINKS */}
        <nav className="nav-items">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* AUTH BUTTONS */}
        {!isLoggedIn ? (
          <div className="header-actions">
            <Link to="/login" className="header-btn-outline">
              Login
            </Link>
            <Link to="/signup" className="header-btn">
              Sign up
            </Link>
          </div>
        ) : (
          <div className="header-btn" onClick={() => navigate("/profile")}>
            My Account
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
