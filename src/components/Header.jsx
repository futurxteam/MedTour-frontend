import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

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

        {/* AUTH / PROFILE */}
        {!token ? (
          <div className="header-actions">
            <Link to="/login" className="header-btn-outline">
              Login
            </Link>
            <Link to="/signup" className="header-btn">
              Sign up
            </Link>
          </div>
        ) : (
          <div className="profile-wrapper">
            <div
              className="profile-avatar"
              onClick={() => setOpen(!open)}
            >
              U
            </div>

            {open && (
              <div className="profile-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </div>
                <div
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
