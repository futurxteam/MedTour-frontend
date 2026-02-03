import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../styles/PADashboard.css";
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
            >
              <h3>Assigned Patients ({patients.length})</h3>
              <p>View and manage patients under your care</p>
              <span className="dashboard-btn">View Patients</span>
            </div>
            <div
              className="dashboard-card"
              onClick={() => setView("appointments")}
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
            <h3 className="patient-list-title">Assigned Patients</h3>
            <div className="patient-list">
              {patients.map((p) => (
                <div
                  key={p.id}
                  className="dashboard-card patient-card"
                >
                  <div className="patient-card-header">
                    <div>
                      <div className="patient-card-name">{p.name}</div>
                      <p className="patient-card-contact">{p.contact}</p>
                    </div>
                    <span className="patient-card-from">{p.from}</span>
                  </div>
                  <div className="patient-card-details">
                    <p><strong>{p.surgery}</strong></p>
                    <p>
                      Current: {p.steps[p.currentStep]}
                    </p>
                  </div>

                  <div className="patient-card-buttons">
                    <button
                      className="dashboard-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="patient-notify-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotify(p);
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

        {/* Patient Details View */}
        {selectedPatient && (
          <div>
            <div className="dashboard-card patient-detail-header">
              <div className="patient-detail-name">{selectedPatient.name}</div>
              <p className="patient-detail-info"><b>Contact:</b> {selectedPatient.contact}</p>
              <p className="patient-detail-info"><b>Doctor:</b> {selectedPatient.doctor}</p>
              <p className="patient-detail-info"><b>Surgery:</b> {selectedPatient.surgery}</p>
              <p className="patient-detail-info"><b>Hospital:</b> {selectedPatient.hospital}</p>
              <p className="patient-detail-info"><b>Origin:</b> {selectedPatient.from}</p>
            </div>

            <div className="dashboard-card patient-detail-journey">
              <h3>Procedure Progress</h3>
              {selectedPatient.steps.map((step, index) => (
                <div
                  key={index}
                  className={`journey-step ${index === selectedPatient.currentStep ? 'current' : ''}`}
                >
                  <div className="journey-step-number">Step {index + 1}</div>
                  <div className="journey-step-title">{step}</div>
                  {index < selectedPatient.currentStep && <div>✓ Completed</div>}
                  {index === selectedPatient.currentStep && <div><b>Current</b></div>}
                </div>
              ))}
            </div>

            <button
              className="dashboard-btn"
              onClick={() => alert("Status update feature coming soon!")}
            >
              Update Progress
            </button>

            <button
              className="dashboard-btn"
              onClick={() => setSelectedPatient(null)}
            >
              Back to Patients List
            </button>
          </div>
        )}

        {/* Appointments View */}
        {view === "appointments" && (
          <>
            <h3 className="appointments-title">Upcoming Appointments</h3>
            <div className="appointments-list">
              {appointments.map((a) => (
                <div key={a.id} className="dashboard-card appointment-card">
                  <p className="appointment-card-details"><b>Patient:</b> {a.patient}</p>
                  <p className="appointment-card-details"><b>Contact:</b> {a.patientContact}</p>
                  <p className="appointment-card-details"><b>Doctor:</b> {a.doctor}</p>
                  <p className="appointment-card-details"><b>Surgery:</b> {a.surgery}</p>
                  <p className="appointment-card-details"><b>Time:</b> <span className="appointment-card-time">{a.time}</span></p>
                  <div className="patient-card-buttons">
                    <button className="dashboard-btn" onClick={() => alert(`Calling patient: ${a.patientContact}`)}>
                      Call Patient
                    </button>
                    <button className="dashboard-btn" onClick={() => alert(`Calling doctor: ${a.doctorContact}`)}>
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
            onClick={handleBack}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* NOTIFICATION MODAL */}
      {notifyPatient && (
        <div className="notify-modal-overlay" onClick={() => setNotifyPatient(null)}>
          <div
            className="dashboard-card notify-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="notify-panel-title">Notify {notifyPatient.name}</h3>
            <p className="notify-panel-contact">
              Contact: {notifyPatient.contact}
            </p>

            <div className="notify-templates">
              <label className="notify-templates-label">Quick Messages</label>
              {notificationTemplates.map((template, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedTemplate(template.message);
                    setCustomMessage("");
                  }}
                  className={`notify-template-btn ${selectedTemplate === template.message ? 'active' : ''}`}
                >
                  <strong>{template.label}</strong>
                  <br />
                  <small>{template.message}</small>
                </button>
              ))}
            </div>

            <div className="notify-custom-message">
              <label className="notify-custom-label">Or Custom Message</label>
              <textarea
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => {
                  setCustomMessage(e.target.value);
                  setSelectedTemplate("");
                }}
                className="notify-custom-textarea"
              />
            </div>

            <div className="notify-buttons">
              <button
                className="notify-send-btn"
                onClick={sendNotification}
                disabled={!selectedTemplate && !customMessage}
              >
                Send Notification 📩
              </button>
              <button
                className="notify-cancel-btn"
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