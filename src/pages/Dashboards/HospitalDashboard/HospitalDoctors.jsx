// pages/Dashboards/HospitalDashboard/HospitalDoctors.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api/api";

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/hospital/doctors");
      setDoctors(res.data);
    } catch {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    await API.patch(`/hospital/doctors/${id}/toggle`);
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-card">
      <h3>Hospital Doctors</h3>

      {doctors.length === 0 && <p>No doctors added yet.</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specializations</th>
            <th>Profile</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.name}</td>
              <td>{doc.specializations?.join(", ") || "—"}</td>
              <td>
                {doc.profileCompleted ? (
                  <span className="badge success">Completed</span>
                ) : (
                  <span className="badge warning">Incomplete</span>
                )}
              </td>
              <td>
                {doc.active ? (
                  <span className="badge success">Active</span>
                ) : (
                  <span className="badge danger">Disabled</span>
                )}
              </td>
              <td>
                <button onClick={() => toggleStatus(doc._id)}>
                  {doc.active ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
