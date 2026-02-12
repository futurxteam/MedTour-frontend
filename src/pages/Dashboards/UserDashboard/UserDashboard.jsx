import React, { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { logout, getAuthUser } from "../../../utils/auth";
import { getMyJourney, getMyJourneyRecords } from "../../../api/api";
import api from "../../../api/api";
import TimelineStepper from "../../../components/TimelineStepper";

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("service"); // service, journey, profile
  const [journey, setJourney] = useState(null);
  const [records, setRecords] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = getAuthUser();
  const [userName, setUserName] = useState("User");

  // Profile state
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [form, setForm] = useState({
    dob: "",
    nationality: "",
    country: "",
    phone: "",
    preferredLanguage: "",
    emergencyContact: "",
  });

  // Get user name from localStorage
  useEffect(() => {
    const userObj = localStorage.getItem("user");
    if (userObj) {
      try {
        const parsed = JSON.parse(userObj);
        setUserName(parsed.name || "User");
        setProfileData(parsed);

        // Set form data if profile exists
        if (parsed.profile) {
          setForm({
            dob: parsed.profile.dob ? parsed.profile.dob.split('T')[0] : "",
            nationality: parsed.profile.nationality || "",
            country: parsed.profile.country || "",
            phone: parsed.profile.phone || "",
            preferredLanguage: parsed.profile.preferredLanguage || "",
            emergencyContact: parsed.profile.emergencyContact || "",
          });
        }
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  // Fetch journey data
  useEffect(() => {
    fetchJourney();
    fetchRecords();
  }, []);

  const fetchJourney = async () => {
    try {
      const res = await getMyJourney();
      setJourney(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch journey:", err);
      setError(err.response?.data?.message || "Failed to load journey");
      setJourney(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await getMyJourneyRecords();
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const getUserInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : "U";
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = (phone) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  const getCurrentStageTitle = () => {
    if (!journey || !journey.stages || journey.stages.length === 0) {
      return "No active stage";
    }
    const currentStage = journey.stages.find((s) => s.status === "in-progress");
    return currentStage ? currentStage.title : journey.stages[0]?.title || "Getting Started";
  };

  // Profile handlers
  const age = form.dob
    ? new Date().getFullYear() - new Date(form.dob).getFullYear()
    : "";

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setError("");

    try {
      const res = await api.put("/user/profile", form);

      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setProfileData(res.data.user);
          setUserName(res.data.user.name);
        }
        setIsEditing(false);
        setError("Profile updated successfully!");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Welcome Back, {userName}</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <div className="profile-avatar-initial" title={userName}>
            {getUserInitial()}
          </div>
          <span className="profile-name">{userName}</span>

          {open && (
            <div className="profile-dropdown">
              <button
                className="logout-btn"
                onClick={() => {
                  setOpen(false);
                  logout(navigate);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="user-dashboard-layout">
        {/* Sidebar */}
        <aside className="user-sidebar">
          <nav className="user-sidebar-nav">
            <button
              className={activeTab === "service" ? "active" : ""}
              onClick={() => setActiveTab("service")}
            >
              <span className="nav-icon">🚀</span>
              <span className="nav-text">My Service</span>
            </button>
            <button
              className={activeTab === "journey" ? "active" : ""}
              onClick={() => setActiveTab("journey")}
            >
              <span className="nav-icon">🗺️</span>
              <span className="nav-text">Journey Details</span>
            </button>
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">My Profile</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="user-main-content">
          {/* SERVICE TAB */}
          {activeTab === "service" && (
            <div className="service-view">
              <h3>My Service Journey</h3>

              {loading && (
                <div className="loading-state">Loading your journey...</div>
              )}

              {!loading && error && (
                <div className="empty-journey-state">
                  <div className="empty-icon">📋</div>
                  <h4>No Active Service Journey</h4>
                  <p>
                    You don't have an active service journey yet. Your personal
                    assistant will create one once your consultation begins.
                  </p>
                </div>
              )}

              {!loading && !error && journey && (
                <>
                  {/* Current Stage Card */}
                  <div className="current-stage-card">
                    <div className="stage-header">
                      <h4>Current Stage</h4>
                      <span className="stage-badge">
                        {getCurrentStageTitle()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-section">
                      <div className="progress-info">
                        <span className="progress-label">Overall Progress</span>
                        <span className="progress-value">
                          {journey.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="styled-progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${journey.progressPercentage || 0}%` }}
                        >
                          <div className="progress-shine"></div>
                        </div>
                      </div>
                      <div className="progress-stats">
                        <span>
                          {journey.stages?.filter((s) => s.status === "completed")
                            .length || 0}{" "}
                          of {journey.stages?.length || 0} stages completed
                        </span>
                        <span>Day {journey.currentDay || 0} of {journey.totalDuration || 0} total</span>
                      </div>
                    </div>
                  </div>

                  {/* PA Details Card */}
                  {journey.assignedPA && (
                    <div className="pa-details-card">
                      <div className="pa-header">
                        <div className="pa-avatar">
                          {(journey.assignedPA?.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="pa-info">
                          <h4>Your Personal Assistant</h4>
                          <p className="pa-name">
                            {journey.assignedPA?.name || "Personal Assistant"}
                          </p>
                        </div>
                      </div>

                      <div className="pa-contact-actions">
                        <button
                          className="contact-btn call-btn"
                          onClick={() => handleCall("9876543210")}
                        >
                          <span className="btn-icon">📞</span>
                          <span className="btn-text">Call</span>
                        </button>
                        <button
                          className="contact-btn whatsapp-btn"
                          onClick={() => handleWhatsApp("9876543210")}
                        >
                          <span className="btn-icon">💬</span>
                          <span className="btn-text">WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Medical Records Card (Trigger) */}
                  <div className="medical-records-summary-card" onClick={() => setIsPanelOpen(true)}>
                    <div className="summary-left">
                      <span className="summary-icon">📄</span>
                      <div className="summary-text">
                        <h4>Medical Records</h4>
                        <p>{records.length} Clinical Document{records.length !== 1 ? 's' : ''} Uploaded</p>
                      </div>
                    </div>
                    <div className="summary-right">
                      <span className="view-all-text">View All</span>
                      <span className="arrow-icon">→</span>
                    </div>
                  </div>

                  {/* Side Panel Overlay */}
                  {isPanelOpen && (
                    <div className="panel-overlay" onClick={() => setIsPanelOpen(false)}>
                      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="panel-header">
                          <h3>📄 Clinical Documents</h3>
                          <button className="close-panel-btn" onClick={() => setIsPanelOpen(false)}>×</button>
                        </div>
                        <div className="panel-body">
                          {records.length === 0 ? (
                            <div className="panel-empty">
                              <p>No records uploaded yet.</p>
                            </div>
                          ) : (
                            <div className="panel-records-list">
                              {records.map((record) => (
                                <div key={record._id} className="panel-record-item">
                                  <div className="record-main-info">
                                    <h6>{record.description}</h6>
                                    <span className="record-date">{new Date(record.date).toLocaleDateString()}</span>
                                  </div>
                                  <a
                                    href={record.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="record-download-link"
                                  >
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View Full Journey Button */}
                  <button
                    className="view-journey-btn"
                    onClick={() => setActiveTab("journey")}
                  >
                    View Full Journey Timeline
                  </button>
                </>
              )}
            </div>
          )}

          {/* JOURNEY DETAILS TAB */}
          {activeTab === "journey" && (
            <div className="journey-details-view">
              <h3>Journey Timeline</h3>

              {loading && (
                <div className="loading-state">Loading journey details...</div>
              )}

              {!loading && (error || !journey) && (
                <div className="empty-journey-state">
                  <div className="empty-icon">🗺️</div>
                  <h4>No Active Journey</h4>
                  <p>You don't have an active service journey yet.</p>
                  <p>Your personal assistant will create one once your consultation begins.</p>
                </div>
              )}

              {!loading && !error && journey && (
                <div className="journey-content">
                  {/* Stats Cards */}
                  <div className="journey-stats">
                    <div className="stat-card">
                      <div className="stat-value">{journey.currentDay || 0}</div>
                      <div className="stat-label">Current Day</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{journey.totalDuration || 0}</div>
                      <div className="stat-label">Total Days</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{journey.stages?.length || 0}</div>
                      <div className="stat-label">Stages</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-container">
                    <div className="progress-label">
                      Overall Progress: {journey.progressPercentage || 0}%
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${journey.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="journey-timeline">
                    {journey.stages && journey.stages.length > 0 ? (
                      <TimelineStepper
                        stages={journey.stages}
                        currentStageIndex={journey.stages.findIndex(
                          (s) => s.status === "in-progress"
                        )}
                      />
                    ) : (
                      <p>No stages have been added to your journey yet.</p>
                    )}
                  </div>

                  {/* PA Info */}
                  {journey.assignedPA && (
                    <div className="pa-info-box">
                      <p>
                        <strong>Your Personal Assistant:</strong> {journey.assignedPA.name}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="profile-view-tab">
              <div className="profile-header">
                <h3>My Profile</h3>
                {profileData?.profileCompleted && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={form.dob || ""}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input value={age || ""} disabled />
                  </div>

                  <div className="form-group">
                    <label>Nationality *</label>
                    <input
                      required
                      placeholder="e.g., Indian"
                      value={form.nationality || ""}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      required
                      placeholder="e.g., India"
                      value={form.country || ""}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., +91 9876543210"
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Language *</label>
                    <input
                      required
                      placeholder="e.g., English"
                      value={form.preferredLanguage || ""}
                      onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact *</label>
                    <input
                      required
                      placeholder="Name and Phone"
                      value={form.emergencyContact || ""}
                      onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                    />
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <button type="submit" disabled={profileLoading} className="submit-btn">
                    {profileLoading ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              ) : (
                <div className="profile-details">
                  {profileData && profileData.profile ? (
                    <>
                      <div className="detail-item">
                        <span className="label">Date of Birth:</span>
                        <span className="value">
                          {profileData.profile.dob
                            ? new Date(profileData.profile.dob).toLocaleDateString()
                            : "Not provided"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Age:</span>
                        <span className="value">{profileData.profile.age || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Nationality:</span>
                        <span className="value">{profileData.profile.nationality || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Country:</span>
                        <span className="value">{profileData.profile.country || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Phone:</span>
                        <span className="value">{profileData.profile.phone || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Preferred Language:</span>
                        <span className="value">{profileData.profile.preferredLanguage || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Emergency Contact:</span>
                        <span className="value">{profileData.profile.emergencyContact || "Not provided"}</span>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <p>No profile information available yet.</p>
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                      >
                        Create Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
