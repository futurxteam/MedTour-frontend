import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";



export default function DoctorDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="dashboard">

      {/* ===== TOP HEADER BAR ===== */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Doctor Dashboard</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="profile"
            className="profile-avatar"
          />
          <span className="profile-name">Dr. John Doe</span>

          {open && (
            <div className="profile-dropdown">
              <button>My Profile</button>
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
            <span className="dashboard-btn">Edit</span>
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
