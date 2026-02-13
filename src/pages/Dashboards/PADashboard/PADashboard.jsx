import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../styles/PADashboard.css";
import { logout } from "../../../utils/auth";
import api, { getAssignedEnquiries, updateEnquiryStatusByAssistant, startService, getAssignedJourneys } from "../../../api/api";

export default function PADashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("enquiries");
  const [enquiries, setEnquiries] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
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
      fetchEnquiries(); // Refresh to remove from enquiries list
      setView("services"); // Switch to services view
    } catch (err) {
      console.error("Failed to start service", err);
      alert("Failed to start service. Please try again.");
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="dashboard">
      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Assistant Dashboard</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial">P</div>
          <span className="profile-name">Assistant</span>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => { setOpen(false); navigate('/dashboard/pa'); }}>
                Dashboard
              </button>
              <button onClick={() => { setOpen(false); navigate('/profile'); }}>
                Profile
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

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h3 className="sidebar-title">Menu</h3>
          <nav className="sidebar-nav">
            <button
              className={view === "enquiries" ? "active" : ""}
              onClick={() => setView("enquiries")}
            >
              Assigned Enquiries
            </button>
            <button
              className={view === "services" ? "active" : ""}
              onClick={() => setView("services")}
            >
              Services
            </button>
            <button
              className={view === "patients" ? "active" : ""}
              onClick={() => setView("patients")}
            >
              My Patients
            </button>
            <button
              className={view === "settings" ? "active" : ""}
              onClick={() => setView("settings")}
            >
              Settings
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="dashboard-container">
          {view === "enquiries" && (
            <div className="admin-enquiries-container">
              <div className="view-header">
                <h3>Assigned Consultation Requests</h3>
                <div className="stats-header">
                  <div className="mini-stat">Total: <strong>{enquiries.length}</strong></div>
                  <div className="mini-stat">New: <strong>{enquiries.filter(e => e.status === 'assigned').length}</strong></div>
                </div>
              </div>

              {loading && <p className="loading-msg">Loading enquiries...</p>}
              {!loading && enquiries.length === 0 && (
                <div className="empty-state">
                  <p>No enquiries assigned yet.</p>
                </div>
              )}

              <div className="enquiries-group">
                {enquiries.map((e) => (
                  <div key={e._id} className="pa-enquiry-card">
                    <div className="enquiry-patient-header">
                      <b>{e.patientName}</b>
                      <span className={`status-badge status-${e.status}`}>{e.status}</span>
                    </div>

                    <div className="enquiry-main">
                      <p className="phone">📞 {e.phone}</p>
                      <p className="location">📍 {e.city}, {e.country}</p>

                      <div className="source-tag">
                        {e.source === "homepage" ? "🏠 Homepage Lead" : "🏥 Services Inquiry"}
                      </div>

                      {e.source === "homepage" ? (
                        <div className="homepage-details">
                          <p><strong>🩺 Problem:</strong> {e.medicalProblem}</p>
                          <p><strong>📅 Age/DOB:</strong> {e.ageOrDob}</p>
                        </div>
                      ) : (
                        <div className="services-details">
                          <p className="service-path">
                            {e.specialtyId?.name} → {e.surgeryId?.surgeryName}
                          </p>
                          <p><strong>Doctor:</strong> {e.doctorId?.name}</p>
                          {e.consultationDate && (
                            <p className="consult-date">
                              📅 <strong>{new Date(e.consultationDate).toLocaleDateString()}</strong>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="enquiry-actions">
                      <button
                        className="action-btn call-btn"
                        onClick={() => handleCall(e.phone)}
                      >
                        📞 Make a Call
                      </button>

                      <div className="status-update-form">
                        <select
                          className="status-select"
                          value={e.status}
                          onChange={(ev) => handleUpdateStatus(e._id, ev.target.value)}
                        >
                          <option value="assigned">Assigned</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      {e.status === "contacted" && (
                        <button
                          className="action-btn start-service-btn"
                          onClick={() => handleStartService(e._id)}
                        >
                          🚀 Start Service Journey
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "services" && (
            <div className="admin-enquiries-container">
              <div className="view-header">
                <h3>Active Service Journeys</h3>
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
                      <span className={`status-badge status-${j.status}`}>{j.status}</span>
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
                          <span>⏱️ Day</span>
                          <strong>{j.currentDay || 0} of {j.totalDuration || 0}</strong>
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


          {view === "patients" && (
            <>
              <h3>My Patients</h3>
              <p>Patient management feature coming soon.</p>
            </>
          )}

          {view === "settings" && (
            <>
              <h3>Settings</h3>
              <p>Profile settings feature coming soon.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}