import React, { useState } from "react";
import "../styles/Dashboard.css";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">

      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=11"
            alt="Admin"
            className="profile-avatar"
          />
          <span className="profile-name">Admin</span>

          {open && (
            <div className="profile-dropdown">
              <button>Profile</button>
              <button>Settings</button>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>User Management</h3>
            <p>Create, update, or deactivate user accounts.</p>
            <span className="dashboard-btn">Manage</span>
          </div>

          <div className="dashboard-card">
            <h3>Doctor Verification</h3>
            <p>Approve and review registered doctors.</p>
            <span className="dashboard-btn">Review</span>
          </div>

          <div className="dashboard-card">
            <h3>System Analytics</h3>
            <p>Monitor platform usage and activity.</p>
            <span className="dashboard-btn">View</span>
          </div>
        </div>
      </div>
    </div>
  );
}
