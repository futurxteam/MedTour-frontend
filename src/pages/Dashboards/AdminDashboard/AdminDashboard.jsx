import React, { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import { logout } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import api from "@/api/api";
import AdminEnquiries from "./AdminEnquiries";



export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);

  /* 🔥 REQUIRED STATE (MOVED INSIDE COMPONENT) */
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/hospitals?status=${statusFilter}&search=${search}&page=${page}&limit=${limit}`
      );
      setHospitals(res.data.hospitals);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };



  /* 🔥 FETCH ONLY WHEN VIEW IS HOSPITALS */
  useEffect(() => {
    if (view === "hospitals") {
      fetchPendingHospitals();
      fetchApprovedHospitals(); // 🔥 ADD
      fetchHospitals();

    }
  }, [view, statusFilter, search, page]);


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
          <div className="profile-avatar-initial">A</div>
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

            <button
              className={view === "analytics" ? "active" : ""}
              onClick={() => setView("analytics")}
            >
              📊 Data Analytics
            </button>

            <button
              className={view === "requests" ? "active" : ""}
              onClick={() => setView("requests")}
            >
              📑 Booking Requests
            </button>

          </nav>
        </aside>

        {/* Main content */}
        <main className="dashboard-container">
          {view === "users" && <UserManagement />}

          {view === "hospitals" && (
            <div className="admin-hospitals-view">
              <div className="view-header">
                <h3>Hospital Verification</h3>
                <div className="stats-header">
                  <div className="mini-stat">Hospitals: <strong>{hospitals.length}</strong></div>
                  <div className="mini-stat">Page: <strong>{page}</strong> of {totalPages}</div>
                </div>
              </div>

              {/* 🔍 Search + Filter */}
              <div className="hospital-filters">
                <input
                  className="modern-input"
                  placeholder="Search by hospital name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />

                <select
                  className="pa-select"
                  style={{ width: '200px' }}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loading && <p className="loading-msg">Refreshing list...</p>}
              {!loading && hospitals.length === 0 && <div className="empty-state"><p>No hospitals found matching your criteria</p></div>}

              {/* 🏥 HOSPITAL CARDS */}
              <div className="hospital-list">
                {hospitals.map((h) => (
                  <div key={h._id} className="dashboard-card hospital-card">
                    <div className="hospital-info">
                      <b>{h.name}</b>
                      <p>✉️ {h.email}</p>
                    </div>

                    <div className="hospital-actions">
                      {h.hospitalStatus === "pending" ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => approveHospital(h._id)}
                          >
                            ✅ Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() => rejectHospital(h._id)}
                          >
                            ❌ Reject
                          </button>
                        </>
                      ) : (
                        <span className={`status-pill ${h.hospitalStatus}`}>
                          {h.hospitalStatus}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

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
                      className={`pagination-btn ${page === i + 1 ? "active" : ""
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
            </div>
          )}




          {view === "analytics" && <h3>System Analytics</h3>}

          {view === "requests" && <AdminEnquiries />}

          {!view && (
            <div className="overview-grid">
              <div className="view-header">
                <h3>General Overview</h3>
                <span className="stats-header">
                  <div className="mini-stat">Today: <strong>{new Date().toLocaleDateString()}</strong></div>
                </span>
              </div>

              <div className="enquiries-group">
                <div className="dashboard-card status-card">
                  <div className="card-icon">👥</div>
                  <div className="card-details">
                    <span className="label">Managed Members</span>
                    <strong className="value">124</strong>
                    <span className="trend positive">↑ 12% from last month</span>
                  </div>
                </div>

                <div className="dashboard-card status-card">
                  <div className="card-icon">🏥</div>
                  <div className="card-details">
                    <span className="label">Verified Centers</span>
                    <strong className="value">42</strong>
                    <span className="trend">Across 12 Countries</span>
                  </div>
                </div>

                <div className="dashboard-card status-card">
                  <div className="card-icon">📑</div>
                  <div className="card-details">
                    <span className="label">Pending Requests</span>
                    <strong className="value">18</strong>
                    <span className="trend urgent">Requires Attention</span>
                  </div>
                </div>
              </div>

              <div className="welcome-banner">
                <div className="banner-content">
                  <h4>Welcome back, Admin 👋</h4>
                  <p>Your healthcare network is performing optimally. There are 5 new hospital verification requests waiting for your review.</p>
                  <button className="dashboard-btn" onClick={() => setView("hospitals")}>Review Requests</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
