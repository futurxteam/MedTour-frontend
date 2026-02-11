import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthUser } from "../utils/auth";
import GlobalSearch from "./GlobalSearch";
import "../pages/styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Re-render on route change
  const [open, setOpen] = useState(false);

  // Get user data from localStorage (re-evaluates on each render including location changes)
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const role = userData?.role;
  const displayName = userData?.name || "User";
  const avatarUrl = userData?.profile?.avatar || userData?.photo || null; // fallback check

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* LOGO */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="MedTour Logo" className="site-logo" />
        </div>

        {/* GLOBAL SEARCH */}
        <GlobalSearch />

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
              className="user-info"
              onClick={() => setOpen(!open)}
              style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}
            >
              <span className="user-name" style={{ fontWeight: 500 }}>{displayName}</span>
              <div
                className="profile-avatar"
                title={displayName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {open && (
              <div className="profile-dropdown">
                {/* Dashboard Link for Doctors, Hospital, and Users */}
                {role === "doctor" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/doctor");
                    }}
                  >
                    Dashboard
                  </div>
                )}

                {role === "hospital" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/hospital");
                    }}
                  >
                    Dashboard
                  </div>
                )}

                {role === "user" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/user");
                    }}
                  >
                    Dashboard
                  </div>
                )}

                {role === "admin" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/admin");
                    }}
                  >
                    Dashboard
                  </div>
                )}

                {role === "assistant" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/pa");
                    }}
                  >
                    Dashboard
                  </div>
                )}

                <div
                  className="dropdown-item"
                  onClick={() => {
                    setOpen(false);
                    // role-based profile routing
                    if (role === "doctor") {
                      navigate("/dashboard/doctor/profile");
                    } else if (role === "user") {
                      navigate("/profile");
                    } else if (role === "hospital") {
                      navigate("/dashboard/hospital/profile");
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  My Profile
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
