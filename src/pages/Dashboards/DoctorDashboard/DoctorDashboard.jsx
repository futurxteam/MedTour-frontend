import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DoctorDashboard.css";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";



export default function DoctorDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userName = user?.name || "Doctor";
  const avatarUrl = user?.profile?.avatar || user?.photo || null;

  return (
    <div className="dashboard">

      {/* ===== TOP HEADER BAR ===== */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Doctor Dashboard</h2>
        </div>

        <div className="profile-area doctor-profile-area" onClick={() => setOpen(!open)}>
          <div className="doctor-profile-info">
            <div className="profile-avatar-initial">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="profile-name">{userName}</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/dashboard/doctor/profile")}>My Profile</button>
              <button>Settings</button>
              <button className="logout-btn" onClick={() => logout(navigate)}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Profile</h3>
            <p>Edit experience, specialization, and availability.</p>
            <span className="dashboard-btn" onClick={() => navigate("/dashboard/doctor/profile")}>Edit</span>
          </div>

          <div className="dashboard-card">
            <h3>Consultation Requests</h3>
            <p>View and respond to patient booking requests.</p>
            <span className="dashboard-btn">View</span>
          </div>

          <div className="dashboard-card">
            <h3>Treatment Pricing</h3>
            <p>Set or update procedure costs.</p>
            <span className="dashboard-btn">Manage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
