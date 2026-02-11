import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import api, { getAssignedEnquiries, updateEnquiryStatusByAssistant } from "../../../api/api";

export default function PADashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("enquiries");
  const [enquiries, setEnquiries] = useState([]);
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

  useEffect(() => {
    if (view === "enquiries") {
      fetchEnquiries();
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
          <img
            src="https://i.pravatar.cc/40?img=32"
            alt="Assistant"
            className="profile-avatar"
          />
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
            <>
              <h3>Assigned Consultation Requests</h3>
              {loading && <p>Loading enquiries...</p>}
              {!loading && enquiries.length === 0 && <p>No enquiries assigned yet.</p>}

              <div className="enquiries-grid">
                {enquiries.map((e) => (
                  <div key={e._id} className="dashboard-card enquiry-card">
                    <div className="enquiry-header">
                      <b>{e.patientName}</b>
                      <span className={`status-pill ${e.status}`}>{e.status}</span>
                    </div>

                    <p className="enquiry-detail">📞 {e.phone}</p>
                    <p className="enquiry-detail">
                      <b>Source:</b> {e.source === "homepage" ? "🏠 Homepage" : "🏥 Services"}
                    </p>

                    {e.source === "homepage" ? (
                      <>
                        <p className="enquiry-detail">� {e.city}, {e.country}</p>
                        <p className="enquiry-detail">🩺 <b>Medical Problem:</b> {e.medicalProblem}</p>
                        <p className="enquiry-detail">📅 <b>Age/DOB:</b> {e.ageOrDob}</p>
                      </>
                    ) : (
                      <>
                        <p className="enquiry-detail">
                          🏥 {e.specialtyId?.name} → {e.surgeryId?.surgeryName}
                        </p>
                        <p className="enquiry-detail">👨‍⚕️ Doctor: {e.doctorId?.name}</p>
                      </>
                    )}

                    <div className="enquiry-actions">
                      <button
                        className="action-btn call-btn"
                        onClick={() => handleCall(e.phone)}
                      >
                        📞 Make a Call
                      </button>

                      <select
                        className="status-select"
                        value={e.status}
                        onChange={(ev) => handleUpdateStatus(e._id, ev.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="assigned">Assigned</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
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