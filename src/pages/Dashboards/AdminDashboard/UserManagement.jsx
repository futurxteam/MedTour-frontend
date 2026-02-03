import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  toggleUserStatus,
} from "@/api/api";
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
      <h3 className="user-management-title">User Management</h3>

      {/* TOP CONTROLS */}
      <div className="user-management-controls">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
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

        <button onClick={() => setShowCreate(!showCreate)}>
          + Add User
        </button>
      </div>

      {/* CREATE USER PANEL */}
      {showCreate && (
        <div className="create-user-form">
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="assistant">Assistant</option>
            <option value="hospital">Hospital</option>
          </select>

          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <input
            placeholder="Temporary Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* USER LIST */}
      <div className="user-list">
        {users.map((u) => (
          <div key={u._id} className="dashboard-card user-card">
            <div className="user-card-header">
              <span>
                <span className="user-card-name">{u.name}</span> ({u.role})
              </span>
            </div>
            <p className="user-card-email">{u.email}</p>

            <div className="user-card-actions">
              <button
                className={`user-status-btn ${u.active ? "disable" : "enable"}`}
                onClick={async () => {
                  // Confirmation only for enabling
                  if (!u.active && !window.confirm("Enable this user?")) return;

                  await toggleUserStatus(u._id, !u.active);
                  loadUsers();
                }}
              >
                {u.active ? "Disable" : "Enable"}
              </button>

              <span
                className={`user-status ${u.active ? "active" : "disabled"}`}
              >
                {u.active ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
