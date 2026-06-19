import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  toggleUserStatus,
} from "@/api/api";
import { adminLocalize } from "../../../utils/adminLocalize";
import "../styles/UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  /* filters */
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  /* pagination */
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  /* create user */
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    role: "",
    email: "",
    password: "",
  });

  /* =========================
     FETCH USERS
  ========================= */
  const loadUsers = async () => {
    const res = await fetchUsers({
      page,
      limit,
      role,
      search,
    });

    setUsers(res.data.users);
    setTotalPages(res.data.pagination.totalPages);
  };

  useEffect(() => {
    loadUsers();
  }, [page, role, search]);

  /* =========================
     CREATE USER
  ========================= */
  const handleCreate = async () => {
    await createUser(newUser);
    setShowCreate(false);
    setNewUser({ role: "", email: "", password: "" });
    setPage(1);
    loadUsers();
  };

  /* =========================
     PAGINATION HELPERS
  ========================= */
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="user-management-container">
      <div className="view-header">
        <h3>👥 User Management</h3>
        <p className="subtitle">Manage system users, roles and access permissions</p>
      </div>

      {/* TOP CONTROLS */}
      <div className="dashboard-card status-card no-hover" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="filter-group">
            <label className="field-label">Search Users</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}>🔍</span>
              <input
                className="modern-input"
                placeholder="Name or email..."
                style={{ width: '250px', paddingLeft: '40px' }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="field-label">Filter Role</label>
            <select
              className="modern-select"
              style={{ width: '180px' }}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="assistant">Assistant</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
        </div>

        <button className="dashboard-btn" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "✕ Close Panel" : "➕ Add New Member"}
        </button>
      </div>

      {/* CREATE USER PANEL */}
      {showCreate && (
        <div className="dashboard-card add-surgery-card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--accent-light)', padding: '10px', borderRadius: '12px', fontSize: '1.25rem' }}>➕</div>
            <h4 style={{ margin: 0 }}>Add New System Member</h4>
          </div>
          <div className="modern-form">
            <div className="form-grid">
              <div className="form-group">
                <label>👤 Select Role</label>
                <select
                  className="modern-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="">Select Role...</option>
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  <option value="assistant">Assistant</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>

              <div className="form-group">
                <label>✉️ Email Address</label>
                <input
                  className="modern-input"
                  placeholder="Primary email..."
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>🔑 Temporary Password</label>
                <input
                  className="modern-input"
                  type="password"
                  placeholder="At least 6 characters..."
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="dashboard-btn" style={{ marginTop: '24px' }} onClick={handleCreate}>
              💾 Create Member Account
            </button>
          </div>
        </div>
      )}

      {/* USER LIST */}
      <div className="hospital-list">
        {users.map((u) => (
          <div key={u._id} className="dashboard-card registry-card">
            <div className="registry-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <b style={{ fontSize: '1.1rem' }}>{adminLocalize(u.name) || "Unnamed User"}</b>
                <span className="spec-pill" style={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>{u.role}</span>
                <span className={`status-pill ${u.active ? "approved" : "rejected"}`} style={{ fontSize: '0.65rem' }}>
                  {u.active ? "• Active" : "• Disabled"}
                </span>
              </div>
              <p className="registry-desc" style={{ marginTop: '8px' }}>✉️ {u.email}</p>
            </div>

            <div className="registry-actions">
              <button
                className="dashboard-btn"
                style={{
                  background: u.active ? '#fee2e2' : 'var(--accent-light)',
                  color: u.active ? '#991b1b' : 'var(--accent-dark)',
                  boxShadow: 'none',
                  padding: '8px 16px',
                  fontSize: '0.85rem'
                }}
                onClick={async () => {
                  if (!u.active && !window.confirm("Enable this user?")) return;
                  await toggleUserStatus(u._id, !u.active);
                  loadUsers();
                }}
              >
                {u.active ? "🚫 Disable Account" : "✅ Activate Account"}
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" disabled={page === 1} onClick={() => goToPage(page - 1)}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
