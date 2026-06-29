import React, { useState, useEffect } from "react";
import i18n from "i18next";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /* 🔥 ENSURE HOSPITAL DASHBOARD IS ALWAYS ENGLISH */
  useEffect(() => {
    i18n.changeLanguage("en");
  }, []);

  const adminViewAs = localStorage.getItem("adminViewAsHospitalId");
  const [open, setOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard/hospital") {
      return location.pathname === "/dashboard/hospital";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard">
      {/* 🏥 ADMIN IMPERSONATION BANNER */}
      {adminViewAs && (
        <div style={{
          background: '#0ea5e9',
          color: 'white',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <span>🛡️ ADMIN IMPERSONATION MODE: You are managing this hospital's clinical and staff details.</span>
          <button
            onClick={() => {
              localStorage.removeItem("adminViewAsHospitalId");
              navigate("/dashboard/admin");
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            ← Back to Admin Panel
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <button className="home-back-btn" onClick={() => navigate("/")} title="Go to Homepage">
            🏠 Home
          </button>
          <h2>Medical Hub</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>H</div>
          <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="profile-name">Hospital Partner</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Institutional Admin</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <div style={{ borderTop: '1px solid var(--border-soft)', margin: '8px 0' }}></div>

              <button
                className="logout-btn"
                onClick={() => logout(navigate)}
                style={{ color: '#ef4444' }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div style={{ padding: '0 10px 20px 10px' }}>
            <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>INSTITUTIONAL</h3>
          </div>
          <nav className="sidebar-nav">
            <button
              className={isActive("/dashboard/hospital") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital")}
            >
              🏢 Overview
            </button>

            <button
              className={isActive("/dashboard/hospital/doctors") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/doctors")}
            >
              👨‍⚕️ Hospital Doctors
            </button>

            <button
              className={isActive("/dashboard/hospital/profiles") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/profiles")}
            >
              📋 Doctor Profiles
            </button>

            <div style={{ padding: '20px 10px 10px 10px' }}>
              <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CLINICAL SERVICES</h3>
            </div>

            <button
              className={isActive("/dashboard/hospital/surgeries") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/surgeries")}
            >
              💉 Surgeries & Costing
            </button>

            <button
              className={isActive("/dashboard/hospital/assignments") ? "active" : ""}
              onClick={() => navigate("/dashboard/hospital/assignments")}
            >
              🔗 Skill Assignments
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
