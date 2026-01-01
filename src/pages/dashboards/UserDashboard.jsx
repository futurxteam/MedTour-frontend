import React, { useState } from "react";
import "../styles/Dashboard.css";
import Avatar from "../../components/Avatar";


export default function UserDashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">

      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Welcome Back</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=68"
            alt="User"
            className="profile-avatar"
          />
          <span className="profile-name">John Doe</span>

          {open && (
            <div className="profile-dropdown">
              <button>My Profile</button>
              <button>Appointments</button>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
  <Avatar
    onSelect={(part) => {
      console.log("Selected body part:", part);
      // later → route to disease info / modal / API call
    }}
  />
</div>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Book a Procedure</h3>
            <p>Explore surgeries, treatments, and medical services.</p>
            <span className="dashboard-btn">Explore</span>
          </div>

          <div className="dashboard-card">
            <h3>My Appointments</h3>
            <p>View and manage upcoming consultations.</p>
            <span className="dashboard-btn">View</span>
          </div>

          <div className="dashboard-card">
            <h3>Travel & Stay</h3>
            <p>Manage accommodation and travel arrangements.</p>
            <span className="dashboard-btn">Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
