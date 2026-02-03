import React, { useState } from "react";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function HospitalDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active sidebar item based on URL
  const isActive = (path) => {
    // Exact match for dashboard home
    if (path === "/dashboard/hospital") {
      return location.pathname === "/dashboard/hospital";
    }
    // Partial match for sub-sections
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard">
      {/* ================= TOP BAR ================= */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Hospital Dashboard</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Hospital Admin"
            className="profile-avatar"
          />
          <span className="profile-name">Hospital</span>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/dashboard/hospital/profile")}>Profile</button>
              <button>Settings</button>
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

      {/* ================= LAYOUT ================= */}
      <div className="dashboard-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="dashboard-sidebar">
          <h3 className="sidebar-title">Hospital Tasks</h3>

          <nav className="sidebar-nav">
            <button
              className={isActive("/dashboard/hospital") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital")}
            >
              Dashboard
            </button>

            <button
              className={isActive("/dashboard/hospital/doctors") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/doctors")}
            >
              Hospital Doctors
            </button>

            <button
              className={isActive("/dashboard/hospital/profiles") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/profiles")}
            >
              Doctor Profiles
            </button>

            <button
              className={isActive("/dashboard/hospital/surgeries") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/surgeries")}
            >
              Surgeries & Packages
            </button>

            <button
              className={isActive("/dashboard/hospital/assignments") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/assignments")}
            >
              Doctor Assignments
            </button>
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="dashboard-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
