import React, { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import api from "@/api/api";

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

  /* 🔥 REQUIRED STATE (MOVED INSIDE COMPONENT) */
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  /* 🔥 REQUIRED FETCH (MOVED INSIDE COMPONENT) */
  const fetchPendingHospitals = async () => {
    const res = await api.get("/admin/pending-hospitals");
    setPendingHospitals(res.data);
  };
  const fetchApprovedHospitals = async () => {
  const res = await api.get("/admin/approved-hospitals");
  setApprovedHospitals(res.data);
};
const fetchHospitals = async () => {
  const res = await api.get(
    `/admin/hospitals?status=${statusFilter}&search=${search}&page=${page}&limit=${limit}`
  );

  setHospitals(res.data.hospitals);
  setTotalPages(res.data.pagination.totalPages);
};



  /* 🔥 FETCH ONLY WHEN VIEW IS HOSPITALS */
  useEffect(() => {
    if (view === "hospitals") {
      fetchPendingHospitals();
      fetchApprovedHospitals(); // 🔥 ADD
      fetchHospitals();

    }
}, [view, statusFilter, search,page]);
 

  const assignPA = (id, pa) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, assignedPA: pa, status: "Assigned" }
          : r
      )
    );
  };

 const approveHospital = async (id) => {
  await api.patch(`/admin/approve-hospital/${id}`);
  fetchHospitals();
};

const rejectHospital = async (id) => {
  if (!window.confirm("Reject this hospital?")) return;
  await api.patch(`/admin/reject-hospital/${id}`);
  fetchHospitals();
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
              <button onClick={() => { setOpen(false); navigate('/dashboard/admin'); }}>
                Dashboard
              </button>
              <button onClick={() => { setOpen(false); navigate('/profile'); }}>
                Profile
              </button>
              <button>Settings</button>
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
          <h3 className="sidebar-title">Tasks</h3>

          <nav className="sidebar-nav">
            <button
              className={view === null ? "active" : ""}
              onClick={() => setView(null)}
            >
              Dashboard
            </button>

            <button
              className={view === "users" ? "active" : ""}
              onClick={() => setView("users")}
            >
              User Management
            </button>

            <button
              className={view === "hospitals" ? "active" : ""}
              onClick={() => setView("hospitals")}
            >
              Hospital Verification
            </button>

            <button
              className={view === "analytics" ? "active" : ""}
              onClick={() => setView("analytics")}
            >
              System Analytics
            </button>

            <button
              className={view === "requests" ? "active" : ""}
              onClick={() => setView("requests")}
            >
              Consultation Requests
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="dashboard-container">
          {view === "users" && <UserManagement />}

          {view === "hospitals" && (
  <>
    <h3>Hospital Verification</h3>

    {/* 🔍 Search + Filter */}
    <div className="hospital-filters">
      <input
        placeholder="Search hospital"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    {hospitals.length === 0 && <p>No hospitals found</p>}

    {/* 🏥 HOSPITAL CARDS */}
    {hospitals.map((h) => (
      <div key={h._id} className="dashboard-card">
        <b>{h.name}</b>
        <p>{h.email}</p>

        {h.hospitalStatus === "pending" && (
          <>
            <button
              className="user-btn enable"
              onClick={() => approveHospital(h._id)}
            >
              Approve
            </button>

            <button
              className="user-btn disable"
              onClick={() => rejectHospital(h._id)}
            >
              Reject
            </button>
          </>
        )}

        {h.hospitalStatus === "approved" && (
          <span className="user-status active">Approved</span>
        )}

        {h.hospitalStatus === "rejected" && (
          <span className="user-status disabled">Rejected</span>
        )}
      </div>
    ))}

    {/* ✅ PAGINATION – OUTSIDE THE MAP */}
    {totalPages > 1 && (
      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${
              page === i + 1 ? "active" : ""
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    )}
  </>
)}




          {view === "analytics" && <h3>System Analytics</h3>}

          {view === "requests" && <h3>Consultation Requests</h3>}

          {!view && <p>Select a task from the sidebar</p>}
        </main>
      </div>
    </div>
  );
}
