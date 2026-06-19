import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../styles/PADashboard.css";
import { logout } from "../../../utils/auth";
import api, { getAssignedEnquiries, updateEnquiryStatusByAssistant, startService, getAssignedJourneys } from "../../../api/api";
import PAServicePackages from "./PAServicePackages";

export default function PADashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("enquiries");
  const [enquiries, setEnquiries] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEnquiry, setExpandedEnquiry] = useState(null);
  const navigate = useNavigate();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getAssignedEnquiries();
      setEnquiries(res.data);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const res = await getAssignedJourneys();
      setJourneys(res.data);
    } catch (err) {
      console.error("Failed to fetch journeys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "enquiries") {
      fetchEnquiries();
    } else if (view === "services") {
      fetchJourneys();
    }
  }, [view]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateEnquiryStatusByAssistant(id, status);
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleStartService = async (enquiryId) => {
    try {
      await startService(enquiryId);
      alert("Service journey started successfully!");
      fetchEnquiries();
      setView("services");
    } catch (err) {
      console.error("Failed to start service", err);
      alert("Failed to start service. Please try again.");
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEnquiryUpdate = (updatedEnquiry) => {
    setEnquiries((prev) =>
      prev.map((e) => (e._id === updatedEnquiry._id ? { ...e, ...updatedEnquiry } : e))
    );
  };

  return (
    <div className="dashboard">
      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <button className="home-back-btn" onClick={() => navigate("/")} title="Go to Homepage">
            🏠 Home
          </button>
          <h2>Personal Assistant</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>P</div>
          <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="profile-name">Assistant</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PA Panel</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => { setOpen(false); navigate('/dashboard/pa'); }}>
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
            <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CORE MENU</h3>
          </div>
          <nav className="sidebar-nav">
            <button
              className={view === "enquiries" ? "active" : ""}
              onClick={() => setView("enquiries")}
            >
              📥 Assigned Enquiries
            </button>
            <button
              className={view === "services" ? "active" : ""}
              onClick={() => setView("services")}
            >
              ⚡ Active Journeys
            </button>
            <div style={{ padding: '20px 10px 10px 10px' }}>
              <h3 className="sidebar-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>PATIENT CARE</h3>
            </div>
            <button
              className={view === "patients" ? "active" : ""}
              onClick={() => setView("patients")}
            >
              👥 My Patients
            </button>

          </nav>
        </aside>

        {/* Main content */}
        <main className="dashboard-container">
          {view === "enquiries" && (
            <div className="admin-enquiries-container">
              <div className="view-header">
                <div>
                  <h3>📥 Assigned Consultation Requests</h3>
                  <p className="subtitle">Track and manage patients assigned to your care</p>
                </div>
                <div className="stats-header">
                  <div className="mini-stat">Total: <strong>{enquiries.length}</strong></div>
                  <div className="mini-stat">New: <strong>{enquiries.filter(e => e.status === 'assigned').length}</strong></div>
                </div>
              </div>

              {loading && <p className="loading-msg">Refreshing enquiries...</p>}
              {!loading && enquiries.length === 0 && (
                <div className="empty-state">
                  <p>No enquiries assigned yet. They will appear here when allocated by Admin.</p>
                </div>
              )}

              <div className="enquiries-group">
                {enquiries.map((e) => (
                  <div key={e._id} className="pa-enquiry-card">
                    <div className="enquiry-patient-header">
                      <b>{e.patientName}</b>
                      <span className={`status-pill ${e.status}`}>{e.status.toUpperCase()}</span>
                    </div>

                    <div className="enquiry-main">
                      <p className="phone">📞 {e.phone}</p>
                      <p className="location">📍 {e.city}, {e.country}</p>

                      <div className="source-tag" style={{ background: e.source === "homepage" ? 'var(--accent-light)' : '#e0f2fe', color: e.source === "homepage" ? 'var(--accent-dark)' : '#0369a1' }}>
                        {e.source === "homepage" ? "🏠 Homepage Lead" : "🏥 Services Inquiry"}
                      </div>

                      <div className="services-details" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                        {e.source === "homepage" ? (
                          <>
                            <p style={{ margin: '4px 0' }}><label className="field-label" style={{ fontSize: '0.65rem' }}>Medical Problem</label></p>
                            <p style={{ margin: 0, fontWeight: '500' }}>🩺 {e.medicalProblem}</p>
                            <p style={{ marginTop: '12px' }}><label className="field-label" style={{ fontSize: '0.65rem' }}>Age / DOB</label></p>
                            <p style={{ margin: 0 }}>📅 {e.ageOrDob}</p>
                          </>
                        ) : (
                          <>
                            <p className="service-path" style={{ fontSize: '1rem', color: 'var(--accent-dark)' }}>
                              💉 {e.specialtyId?.name} → {e.surgeryId?.surgeryName}
                            </p>
                            <p style={{ marginTop: '12px' }}>👨‍⚕️ <strong>Doctor:</strong> {e.doctorId?.name}</p>
                            {e.consultationDate && (
                              <p className="consult-date" style={{ marginTop: '8px' }}>
                                📅 <strong>Scheduled:</strong> <span style={{ color: 'var(--accent)' }}>{new Date(e.consultationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="enquiry-actions">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button
                          className="action-btn call-btn"
                          onClick={() => handleCall(e.phone)}
                        >
                          📞 Call Patient
                        </button>

                        <div className="status-update-form">
                          <select
                            className="modern-select"
                            style={{ height: '100%', padding: '0 12px', fontSize: '0.85rem' }}
                            value={e.status}
                            onChange={(ev) => handleUpdateStatus(e._id, ev.target.value)}
                          >
                            <option value="assigned">Assigned</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {e.status === "contacted" && (
                        <button
                          className="action-btn start-service-btn"
                          onClick={() => handleStartService(e._id)}
                        >
                          🚀 Start Service Journey
                        </button>
                      )}

                      <button
                        className="secondary-btn"
                        style={{
                          width: '100%',
                          background: expandedEnquiry === e._id ? 'var(--accent-light)' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          color: 'var(--text-main)'
                        }}
                        onClick={() =>
                          setExpandedEnquiry(expandedEnquiry === e._id ? null : e._id)
                        }
                      >
                        {expandedEnquiry === e._id ? "🔼 Hide" : "📦 Manage"} Add-on Packages
                      </button>
                    </div>

                    {/* Service Packages Panel */}
                    {expandedEnquiry === e._id && (
                      <div className="expanded-content" style={{ animation: 'slideDown 0.3s ease-out' }}>
                        <PAServicePackages
                          enquiry={e}
                          onEnquiryUpdate={handleEnquiryUpdate}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "services" && (
            <div className="admin-enquiries-container">
              <div className="view-header">
                <div>
                  <h3>⚡ Active Service Journeys</h3>
                  <p className="subtitle">Live roadmaps for patients currently in treatment</p>
                </div>
                <div className="stats-header">
                  <div className="mini-stat">Active Jobs: <strong>{journeys.length}</strong></div>
                </div>
              </div>

              {loading && <p className="loading-msg">Loading journeys...</p>}
              {!loading && journeys.length === 0 && (
                <div className="empty-state">
                  <p>No active service journeys yet.</p>
                </div>
              )}

              <div className="enquiries-group">
                {journeys.map((j) => (
                  <div key={j._id} className="pa-enquiry-card">
                    <div className="enquiry-patient-header">
                      <b>{j.enquiryId?.patientName || "Patient"}</b>
                      <span className={`status-pill approved`}>{j.status.toUpperCase()}</span>
                    </div>

                    <div className="enquiry-main">
                      <p className="phone">📞 {j.enquiryId?.phone}</p>

                      <div className="journey-summary-grid">
                        <div className="summary-item">
                          <span>📊 Progress</span>
                          <strong>{j.progressPercentage}%</strong>
                        </div>
                        <div className="summary-item">
                          <span>📋 Stages</span>
                          <strong>{j.stages?.length || 0}</strong>
                        </div>
                        <div className="summary-item">
                          <span>⏱️ Duration</span>
                          <strong>{j.currentDay || 0}/{j.totalDuration || 0} Days</strong>
                        </div>
                      </div>
                    </div>

                    <div className="enquiry-actions">
                      <button
                        className="action-btn manage-btn"
                        onClick={() => navigate(`/dashboard/pa/journey/${j._id}`)}
                      >
                        📝 Manage Journey Roadmap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {(view === "patients" || view === "settings") && (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚧</div>
              <h4>Module Under Construction</h4>
              <p>This feature is currently being developed to provide better patient care management.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
