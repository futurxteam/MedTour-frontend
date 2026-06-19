import React, { useState, useEffect } from "react";
import i18n from "i18next";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import api from "@/api/api";
import AdminEnquiries from "./AdminEnquiries";
import AdminGlobalSurgeries from "./AdminGlobalSurgeries";
import AdminSpecialties from "./AdminSpecialties";
import AdminServicePackages from "./AdminServicePackages";
import AdminHospitalManagement from "./AdminHospitalManagement";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);

  /* 🔥 DASHBOARD STATS STATE */
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHospitals: 0,
    pendingRequests: 0,
    pendingHospitalsCount: 0
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  /* 🔥 FETCH STATS WHEN OVERVIEW IS SHOWN */
  useEffect(() => {
    if (!view) {
      fetchStats();
    }
  }, [view]);

  /* 🔥 ENSURE ADMIN IS ALWAYS ENGLISH */
  useEffect(() => {
    i18n.changeLanguage("en");
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <button className="home-back-btn" onClick={() => navigate("/")} title="Go to Homepage">
            🏠 Home
          </button>
          <h2>MedTour Admin</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>A</div>
          <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="profile-name">Administrator</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Super Admin</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => { setOpen(false); navigate('/dashboard/admin'); }}>
                ⚙️ Dashboard
              </button>
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
            <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CORE MANAGEMENT</h3>
          </div>

          <nav className="sidebar-nav">
            <button
              className={view === null ? "active" : ""}
              onClick={() => setView(null)}
            >
              🏠 Dashboard Home
            </button>

            <button
              className={view === "users" ? "active" : ""}
              onClick={() => setView("users")}
            >
              👥 User Management
            </button>

            <button
              className={view === "hospitals" ? "active" : ""}
              onClick={() => setView("hospitals")}
            >
              🏥 Hospital Center
            </button>

            <div style={{ padding: '20px 10px 10px 10px' }}>
              <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CONTENT & SERVICES</h3>
            </div>

            <button
              className={view === "requests" ? "active" : ""}
              onClick={() => setView("requests")}
            >
              📑 Consultation Requests
            </button>

            <button
              className={view === "globalSurgeries" ? "active" : ""}
              onClick={() => setView("globalSurgeries")}
            >
              🩺 Global Surgeries
            </button>

            <button
              className={view === "specialties" ? "active" : ""}
              onClick={() => setView("specialties")}
            >
              🔬 Specializations
            </button>

            <button
              className={view === "servicePackages" ? "active" : ""}
              onClick={() => setView("servicePackages")}
            >
              📦 Service Packages
            </button>

          </nav>
        </aside>

        {/* Main content */}
        <main className="dashboard-container">
          {view === "users" && <UserManagement />}
          {view === "hospitals" && <AdminHospitalManagement />}
          {view === "globalSurgeries" && <AdminGlobalSurgeries />}
          {view === "specialties" && <AdminSpecialties />}
          {view === "servicePackages" && <AdminServicePackages />}
          {view === "requests" && <AdminEnquiries />}

          {!view && (
            <div className="overview-container">
              <div className="view-header">
                <h3>General Overview</h3>
                <div className="mini-stat">Today is <strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
              </div>

              <div className="enquiries-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="dashboard-card status-card">
                  <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>👥</div>
                  <div className="card-details">
                    <span className="label">Managed Members</span>
                    <strong className="value">{stats.totalUsers}</strong>
                    <span className="trend positive">↑ Live System Count</span>
                  </div>
                </div>

                <div className="dashboard-card status-card">
                  <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>🏥</div>
                  <div className="card-details">
                    <span className="label">Verified Centers</span>
                    <strong className="value">{stats.totalHospitals}</strong>
                    <span className="trend">Approved Facilities</span>
                  </div>
                </div>

                <div className="dashboard-card status-card">
                  <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📑</div>
                  <div className="card-details">
                    <span className="label">Pending Requests</span>
                    <strong className="value">{stats.pendingRequests}</strong>
                    <span className="trend urgent">Requires Assistant Assignment</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card" style={{ padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', borderRadius: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Welcome back, Admin 👋</h4>
                  <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6', marginBottom: '24px' }}>
                    Your healthcare network is performing optimally. There are {stats.pendingHospitalsCount} new hospital verification requests and {stats.pendingRequests} patient enquiries waiting for your review.
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="dashboard-btn" style={{ background: 'white', color: '#0f172a', fontWeight: '800' }} onClick={() => setView("hospitals")}>Review Hospitals</button>
                    <button className="dashboard-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setView("requests")}>View Enquiries</button>
                  </div>
                </div>
                <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', fontSize: '20rem', opacity: 0.05, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                  🏥
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
