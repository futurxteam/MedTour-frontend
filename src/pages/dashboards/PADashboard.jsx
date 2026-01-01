import React, { useState } from "react";
import "../styles/Dashboard.css";

export default function PADashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">

      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Personal Assistant</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=32"
            alt="PA"
            className="profile-avatar"
          />
          <span className="profile-name">Assistant</span>

          {open && (
            <div className="profile-dropdown">
              <button>Profile</button>
              <button>Tasks</button>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Assigned Patients</h3>
            <p>View and assist patients under your care.</p>
            <span className="dashboard-btn">View</span>
          </div>

          <div className="dashboard-card">
            <h3>Travel Coordination</h3>
            <p>Manage airport pickups and accommodation.</p>
            <span className="dashboard-btn">Manage</span>
          </div>

          <div className="dashboard-card">
            <h3>Support Tasks</h3>
            <p>Track ongoing assistance and daily duties.</p>
            <span className="dashboard-btn">Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
