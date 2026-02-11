import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/hospital/doctors");
      setDoctors(res.data);
    } catch {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    await api.patch(`/hospital/doctors/${id}/toggle`);
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <div className="loading-container">Loading doctors...</div>;
  if (error) return <div className="alert-box warning">{error}</div>;

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Managed Doctors</h3>
        <p style={{ color: "var(--text-muted)" }}>List of all doctors associated with your hospital.</p> {/* Added description */}
      </div>

      <div className="table-container">
        {doctors.length === 0 ? (
          <div className="empty-state">
            <p>No doctors found.</p>
            <p className="text-muted">Start adding doctors using the form above.</p>
          </div>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specializations</th>
                <th>Profile Status</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id}>
                  <td><strong>{doc.name}</strong></td> {/* Bold name */}
                  <td>{doc.specializations?.join(", ") || "—"}</td>
                  <td>
                    {doc.profileCompleted ? (
                      <span className="badge badge-success">Completed</span>
                    ) : (
                      <span className="badge badge-warning">Incomplete</span>
                    )}
                  </td>
                  <td>
                    {doc.active ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Disabled</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn ${doc.active ? 'btn-danger' : 'btn-success'}`} // Dynamic class
                      style={{ padding: '4px 12px', fontSize: '12px' }} // Smaller button
                      onClick={() => toggleStatus(doc._id)}
                    >
                      {doc.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--text-muted);
        }
        .loading-container {
            padding: 40px;
            text-align: center;
            font-size: 16px;
            color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
