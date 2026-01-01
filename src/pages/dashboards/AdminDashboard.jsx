import React, { useState } from "react";
import "../styles/Dashboard.css";

const users = [
  { id: 1, name: "John Doe", role: "Patient", active: true },
  { id: 2, name: "Fatima Ali", role: "Patient", active: false },
  { id: 3, name: "Dr. Neha Kapoor", role: "Doctor", active: true },
];

const doctors = [
  { id: 1, name: "Dr. Arjun Patel", specialization: "Urology" },
  { id: 2, name: "Dr. Meera Shah", specialization: "Cosmetic Surgery" },
];

const assistants = ["Rahul Menon", "Anjali Nair", "Suresh Kumar"];

const consultations = [
  {
    id: 1,
    patient: "Ahmed Khan",
    doctor: "Dr. Rajesh Menon",
    surgery: "Proctology",
    status: "Pending",
    assignedPA: null,
  },
  {
    id: 2,
    patient: "Fatima Ali",
    doctor: "Dr. Sneha Iyer",
    surgery: "Laparoscopy",
    status: "Pending",
    assignedPA: null,
  },
];

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [requests, setRequests] = useState(consultations);

  const assignPA = (id, pa) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, assignedPA: pa, status: "Assigned" }
          : r
      )
    );
  };

  return (
    <div className="dashboard">

      {/* Top Header */}
      <div className="dashboard-topbar">
        <div className="dashboard-title">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="profile-area" onClick={() => setOpen(!open)}>
          <img
            src="https://i.pravatar.cc/40?img=11"
            alt="Admin"
            className="profile-avatar"
          />
          <span className="profile-name">Admin</span>

          {open && (
            <div className="profile-dropdown">
              <button>Profile</button>
              <button>Settings</button>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">

        {/* MAIN CARDS */}
        {!view && (
          <div className="dashboard-grid">
            <div className="dashboard-card" onClick={() => setView("users")}>
              <h3>User Management</h3>
              <p>Create, update, or deactivate users.</p>
              <span className="dashboard-btn">Manage</span>
            </div>

            <div className="dashboard-card" onClick={() => setView("doctors")}>
              <h3>Doctor Verification</h3>
              <p>Approve and review doctors.</p>
              <span className="dashboard-btn">Review</span>
            </div>

            <div className="dashboard-card" onClick={() => setView("analytics")}>
              <h3>System Analytics</h3>
              <p>Platform usage overview.</p>
              <span className="dashboard-btn">View</span>
            </div>

            <div className="dashboard-card" onClick={() => setView("requests")}>
              <h3>Consultation Requests</h3>
              <p>Assign care assistants.</p>
              <span className="dashboard-btn">Open</span>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT */}
        {view === "users" && (
          <div>
            <h3>User Management</h3>
            {users.map((u) => (
              <div key={u.id} className="dashboard-card">
                <p><b>{u.name}</b> ({u.role})</p>
                <p>Status: {u.active ? "Active" : "Inactive"}</p>
                <button className="dashboard-btn">
                  {u.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* DOCTOR VERIFICATION */}
        {view === "doctors" && (
          <div>
            <h3>Doctor Verification</h3>
            {doctors.map((d) => (
              <div key={d.id} className="dashboard-card">
                <p><b>{d.name}</b></p>
                <p>{d.specialization}</p>
                <button className="dashboard-btn">Approve</button>
                <button className="dashboard-btn" style={{ marginLeft: "10px" }}>
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {view === "analytics" && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Users</h3>
              <p>128</p>
            </div>
            <div className="dashboard-card">
              <h3>Doctors</h3>
              <p>42</p>
            </div>
            <div className="dashboard-card">
              <h3>Appointments</h3>
              <p>67</p>
            </div>
          </div>
        )}

        {/* CONSULTATION REQUESTS */}
        {view === "requests" && (
          <div>
            <h3>Consultation Requests</h3>

            {requests.map((r) => (
              <div key={r.id} className="dashboard-card">
                <p><b>Patient:</b> {r.patient}</p>
                <p><b>Doctor:</b> {r.doctor}</p>
                <p><b>Surgery:</b> {r.surgery}</p>
                <p><b>Status:</b> {r.status}</p>

                {!r.assignedPA && (
                  <select
                    onChange={(e) => assignPA(r.id, e.target.value)}
                    defaultValue=""
                    style={{ marginTop: "10px" }}
                  >
                    <option value="" disabled>
                      Assign Care Assistant
                    </option>
                    {assistants.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                )}

                {r.assignedPA && (
                  <p><b>Assigned PA:</b> {r.assignedPA}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* BACK */}
        {view && (
          <button
            className="dashboard-btn"
            style={{ marginTop: "20px" }}
            onClick={() => setView(null)}
          >
            Back to Dashboard
          </button>
        )}

      </div>
    </div>
  );
}
