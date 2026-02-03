import React, { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import "../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { logout, getAuthUser } from "../../../utils/auth";

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();
  const [userName, setUserName] = useState("User");

  // Get user name from localStorage
  useEffect(() => {
    const userObj = localStorage.getItem("user");
    if (userObj) {
      try {
        const parsed = JSON.parse(userObj);
        setUserName(parsed.name || "User");
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  // Get user initial for avatar
  const getUserInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Welcome Back</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" title={userName}>
            {getUserInitial()}
          </div>
          <span className="profile-name">{userName}</span>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}>
                My Profile
              </button>
              <button onClick={() => {
                setOpen(false);
                navigate("/appointments");
              }}>
                Appointments
              </button>

              <button
                className="logout-btn"
                onClick={() => {
                  setOpen(false);
                  logout(navigate);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Cards */}
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div
            className="dashboard-card user-dashboard-card"
            onClick={() => navigate("/services")}
          >
            <h3>Book a Procedure</h3>
            <p>Explore surgeries, treatments, and medical services.</p>
            <span className="dashboard-btn">Explore</span>
          </div>

          <div
            className="dashboard-card user-dashboard-card"
            onClick={() => navigate("/appointments")}
          >
            <h3>My Appointments</h3>
            <p>View and manage upcoming consultations and surgery plans.</p>
            <span className="dashboard-btn">View</span>
          </div>
        </div>
      </div>
    </div>
  );
}


