import React, { useState } from "react";
import "../../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../utils/auth";

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Top Bar */}
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
              <button onClick={() => navigate("/appointments")}>
                Appointments
              </button>

              <button
                className="logout-btn"
                onClick={() => logout(navigate)}
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
            className="dashboard-card"
            onClick={() => navigate("/services")}
            style={{ cursor: "pointer" }}
          >
            <h3>Book a Procedure</h3>
            <p>Explore surgeries, treatments, and medical services.</p>
            <span className="dashboard-btn">Explore</span>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/appointments")}
            style={{ cursor: "pointer" }}
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
