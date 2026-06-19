import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DoctorDashboard.css";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";

export default function DoctorDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userName = user?.name || "Doctor";

  return (
    <div className="dashboard">
      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <button className="home-back-btn" onClick={() => navigate("/")} title="Go to Homepage">
            🏠 Home
          </button>
          <h2>Doctor Console</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" style={{ background: 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="profile-name">Dr. {userName}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Specialist Partner</span>
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
            <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>PRACTICE MANAGEMENT</h3>
          </div>
          <nav className="sidebar-nav">
            <button className="active">🏠 My Console</button>
            <button>📅 Appointments</button>
            <div style={{ padding: '20px 10px 10px 10px' }}>
              <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>REVENUE & SERVICES</h3>
            </div>
            <button>💰 Treatment Pricing</button>
            <button>📊 Performance Stats</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-container">
          <div className="view-header">
            <div>
              <h3>👋 Welcome back, Dr. {userName}</h3>
              <p className="subtitle">Manage your medical practice and patient interactions</p>
            </div>
          </div>

          <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>


            <div className="dashboard-card status-card">
              <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>📑</div>
              <div className="card-details">
                <span className="label">Consultation Requests</span>
                <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>View and respond to patient booking requests.</p>
                <button className="dashboard-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View Bookings</button>
              </div>
            </div>

            <div className="dashboard-card status-card">
              <div className="card-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>💰</div>
              <div className="card-details">
                <span className="label">Treatment Pricing</span>
                <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Set or update procedure costs for your services.</p>
                <button className="dashboard-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Manage Costs</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
