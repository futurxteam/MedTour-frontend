import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { getAuthUser, logout } from "../../../utils/auth";




/* ---------------- DUMMY DATA ---------------- */
const patients = [
  {
    id: 1,
    name: "Ahmed Khan",
    contact: "+971 55 123 4567",
    doctor: "Dr. Rajesh Menon",
    surgery: "Proctology Surgery",
    hospital: "Futureace Hospital, Edapally",
    from: "Dubai",
    steps: [
      "Consultation",
      "Visa Process",
      "Travel: Dubai → Kochi",
      "Airport → Hospital",
      "Surgery",
      "Recovery",
      "Return Travel",
    ],
    currentStep: 2,
  },
  {
    id: 2,
    name: "Fatima Ali",
    contact: "+971 50 987 6543",
    doctor: "Dr. Sneha Iyer",
    surgery: "Laparoscopy",
    hospital: "Apollo Adlux Hospital, Kochi",
    from: "Abu Dhabi",
    steps: [
      "Consultation",
      "Visa Process",
      "Travel",
      "Surgery",
      "Recovery",
    ],
    currentStep: 1,
  },
  {
    id: 3,
    name: "Mohammed Noor",
    contact: "+971 52 333 8899",
    doctor: "Dr. Karthik Reddy",
    surgery: "Orthopedics – Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    from: "Dubai",
    steps: [
      "Consultation",
      "Travel",
      "Pre-op Tests",
      "Surgery",
      "Recovery",
      "Return",
    ],
    currentStep: 3,
  },
  {
    id: 4,
    name: "Sara Ibrahim",
    contact: "+971 54 777 2233",
    doctor: "Dr. Priya Nair",
    surgery: "Gynecology – Hysterectomy",
    hospital: "Lakeshore Hospital, Kochi",
    from: "Sharjah",
    steps: [
      "Consultation",
      "Medical Reports Review",
      "Visa & Travel",
      "Admission",
      "Surgery",
      "Recovery",
    ],
    currentStep: 0,
  },
];

const appointments = [
  {
    id: 1,
    patient: "Omar Hassan",
    patientContact: "+971 56 444 5566",
    doctor: "Dr. Anil Kumar",
    doctorContact: "+91 98765 43210",
    surgery: "Proctology – Laser Piles Treatment",
    time: "Today · 4:30 PM",
  },
  {
    id: 2,
    patient: "Sara Ibrahim",
    patientContact: "+971 54 777 2233",
    doctor: "Dr. Sneha Iyer",
    doctorContact: "+91 99887 66554",
    surgery: "Laparoscopy",
    time: "Tomorrow · 11:00 AM",
  },
];

/* ---------------- QUICK NOTIFICATION TEMPLATES ---------------- */
const notificationTemplates = [
  { label: "Visa Approved 🎉", message: "Great news! Your medical visa has been approved. You can now book your flight." },
  { label: "Reminder: Upload Documents", message: "Kind reminder: Please upload your latest medical reports and passport copy at your earliest." },
  { label: "Flight Booking Assistance", message: "Need help booking your flight to Kochi? Reply with your preferred dates." },
  { label: "Surgery Scheduled", message: "Your surgery has been scheduled for [Date]. We will share detailed itinerary soon." },
  { label: "Pre-Travel Guidelines", message: "Please avoid blood thinners 7 days before travel. Fasting required 8 hours before surgery." },
  { label: "Welcome to Kochi! 🛬", message: "Welcome to Kochi! Your driver is waiting at Arrivals with a name board." },
];

/* ---------------- COMPONENT ---------------- */
export default function PADashboard() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notifyPatient, setNotifyPatient] = useState(null); // Patient to notify
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const handleNotify = (patient) => {
    setNotifyPatient(patient);
    setSelectedTemplate("");
    setCustomMessage("");
  };

  const sendNotification = () => {
    const message = selectedTemplate || customMessage || "No message entered";
    alert(
      `📩 Notification Sent to ${notifyPatient.name} (${notifyPatient.contact})\n\nMessage:\n"${message}"`
    );
    setNotifyPatient(null);
  };

  const handleBack = () => {
    setSelectedPatient(null);
    setView(null);
  };

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Personal Assistant Dashboard</h2>
        </div>
        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=32"
            alt="PA"
            className="profile-avatar"
          />
          <span className="profile-name">Assistant</span>
          {open && (
            <div className="profile-dropdown">
              <button>Profile</button>
<button className="logout-btn" onClick={() => logout(navigate)}>
  Logout
</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Home */}
        {!view && (
          <div className="dashboard-grid">
            <div
              className="dashboard-card"
              onClick={() => setView("patients")}
              style={{ cursor: "pointer" }}
            >
              <h3>Assigned Patients ({patients.length})</h3>
              <p>View and manage patients under your care</p>
              <span className="dashboard-btn">View Patients</span>
            </div>
            <div
              className="dashboard-card"
              onClick={() => setView("appointments")}
              style={{ cursor: "pointer" }}
            >
              <h3>Upcoming Appointments ({appointments.length})</h3>
              <p>Follow up on booked consultations</p>
              <span className="dashboard-btn">View Appointments</span>
            </div>
          </div>
        )}

        {/* Assigned Patients List */}
        {view === "patients" && !selectedPatient && (
          <>
            <h3 style={{ marginBottom: "20px" }}>Assigned Patients</h3>
            <div className="dashboard-grid">
              {patients.map((p) => (
                <div
                  key={p.id}
                  className="dashboard-card"
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <h3>{p.name}</h3>
                  <p><strong>{p.surgery}</strong></p>
                  <p>From: {p.from}</p>
                  <p style={{ fontSize: "14px", color: "#64748b" }}>
                    Current: {p.steps[p.currentStep]}
                  </p>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                      className="dashboard-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                      }}
                      style={{ flex: 1 }}
                    >
                      View Details
                    </button>
                    <button
                      className="dashboard-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotify(p);
                      }}
                      style={{
                        flex: 1,
                        background: "#10b981",
                        border: "none",
                      }}
                    >
                      Notify 📩
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Patient Details View - Same as before */}
        {selectedPatient && (
          <div>
            <div className="dashboard-card">
              <h3>{selectedPatient.name}</h3>
              <p><b>Contact:</b> {selectedPatient.contact}</p>
              <p><b>Doctor:</b> {selectedPatient.doctor}</p>
              <p><b>Surgery:</b> {selectedPatient.surgery}</p>
              <p><b>Hospital:</b> {selectedPatient.hospital}</p>
              <p><b>Origin:</b> {selectedPatient.from}</p>
            </div>

            <div className="dashboard-card" style={{ marginTop: "20px" }}>
              <h3>Procedure Progress</h3>
              {selectedPatient.steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px 10px",
                    marginTop: "8px",
                    borderRadius: "8px",
                    background:
                      index < selectedPatient.currentStep
                        ? "#d4edda"
                        : index === selectedPatient.currentStep
                        ? "#e0f2fe"
                        : "#f8f9fa",
                    borderLeft: `4px solid ${
                      index < selectedPatient.currentStep
                        ? "#28a745"
                        : index === selectedPatient.currentStep
                        ? "#0d6efd"
                        : "#dee2e6"
                    }`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: index === selectedPatient.currentStep ? "600" : "normal" }}>
                    {step}
                  </span>
                  {index < selectedPatient.currentStep && <span style={{ color: "#28a745" }}>✓ Completed</span>}
                  {index === selectedPatient.currentStep && <b style={{ color: "#0d6efd" }}>Current</b>}
                </div>
              ))}
              <button
                className="dashboard-btn"
                style={{ marginTop: "20px", width: "100%" }}
                onClick={() => alert("Status update feature coming soon!")}
              >
                Update Progress
              </button>
            </div>

            <button
              className="dashboard-btn"
              style={{ marginTop: "20px" }}
              onClick={() => setSelectedPatient(null)}
            >
              Back to Patients List
            </button>
          </div>
        )}

        {/* Appointments View */}
        {view === "appointments" && (
          <>
            <h3 style={{ marginBottom: "20px" }}>Upcoming Appointments</h3>
            <div className="dashboard-grid">
              {appointments.map((a) => (
                <div key={a.id} className="dashboard-card">
                  <p><b>Patient:</b> {a.patient}</p>
                  <p><b>Contact:</b> {a.patientContact}</p>
                  <p><b>Doctor:</b> {a.doctor}</p>
                  <p><b>Surgery:</b> {a.surgery}</p>
                  <p><b>Time:</b> <strong>{a.time}</strong></p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button className="dashboard-btn" style={{ flex: 1 }} onClick={() => alert(`Calling patient: ${a.patientContact}`)}>
                      Call Patient
                    </button>
                    <button className="dashboard-btn" style={{ flex: 1 }} onClick={() => alert(`Calling doctor: ${a.doctorContact}`)}>
                      Call Doctor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Back Button */}
        {view && !selectedPatient && (
          <button
            className="dashboard-btn"
            style={{ marginTop: "30px" }}
            onClick={handleBack}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* NOTIFICATION MODAL */}
      {notifyPatient && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setNotifyPatient(null)}
        >
          <div
            className="dashboard-card"
            style={{
              width: "90%",
              maxWidth: "500px",
              padding: "24px",
              borderRadius: "12px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Notify {notifyPatient.name}</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              Contact: {notifyPatient.contact}
            </p>

            <h4 style={{ marginBottom: "12px" }}>Quick Messages</h4>
            <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
              {notificationTemplates.map((template, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedTemplate(template.message);
                    setCustomMessage("");
                  }}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: selectedTemplate === template.message ? "#dbeafe" : "#fff",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  <strong>{template.label}</strong>
                  <br />
                  <small style={{ color: "#64748b" }}>{template.message}</small>
                </button>
              ))}
            </div>

            <h4>Or Custom Message</h4>
            <textarea
              placeholder="Type your message here..."
              value={customMessage}
              onChange={(e) => {
                setCustomMessage(e.target.value);
                setSelectedTemplate("");
              }}
              style={{
                width: "100%",
                height: "100px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                marginBottom: "16px",
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="dashboard-btn"
                style={{ flex: 1, background: "#10b981" }}
                onClick={sendNotification}
                disabled={!selectedTemplate && !customMessage}
              >
                Send Notification 📩
              </button>
              <button
                className="dashboard-btn"
                style={{ flex: 1 }}
                onClick={() => setNotifyPatient(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}