// pages/Dashboards/HospitalDashboard/AddDoctor.jsx
import React, { useState, useEffect } from "react";
import API from "../../../api/api";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specializations: [],
  });

  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch specializations from database on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await API.get("/hospital/specializations");
        setSpecializations(res.data.specializations || []);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
        setError("Failed to load specializations");
      }
    };
    fetchSpecializations();
  }, []);

  const toggleSpecialization = (specId) => {
    setForm((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specId)
        ? prev.specializations.filter((id) => id !== specId)
        : [...prev.specializations, specId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/hospital/doctors", form);
      setSuccess("Doctor added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        specializations: [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Add Doctor</h3>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Doctor Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Doctor Email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Temporary Password"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="checkbox-group">
          <p><strong>Specializations</strong></p>
          {specializations.length === 0 ? (
            <p style={{ color: "#999" }}>Loading specializations...</p>
          ) : (
            specializations.map((spec) => (
              <label key={spec._id}>
                <input
                  type="checkbox"
                  checked={form.specializations.includes(spec._id)}
                  onChange={() => toggleSpecialization(spec._id)}
                />
                {spec.name}
              </label>
            ))
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}
