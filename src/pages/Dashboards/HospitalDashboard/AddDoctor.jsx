import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specializations: [],
    designation: "",
    experience: "",
    consultationFee: "",
    about: "",
    qualifications: "",
    licenseNumber: "",
  });

  const [specializationsList, setSpecializationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/hospital/specializations");
        setSpecializationsList(res.data.specializations || []);
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
      await api.post("/hospital/doctors", form);
      setSuccess("Doctor added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        specializations: [],
        designation: "",
        experience: "",
        consultationFee: "",
        about: "",
        qualifications: "",
        licenseNumber: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Add New Doctor</h3>
      </div>

      <div className="form-section">
        {error && <div className="alert-box warning">{error}</div>}
        {success && <div className="alert-box" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card-grid">
            <div className="form-group">
              <label>Doctor Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Dr. John Doe"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="doctor@hospital.com"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Temporary Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                placeholder="Senior Consultant"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                className="form-control"
                placeholder="10"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                value={form.consultationFee}
                onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              <input
                type="text"
                className="form-control"
                placeholder="MBBS, MD"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="MC123456"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>About Doctor</label>
            <textarea
              className="form-control"
              placeholder="Brief professional summary..."
              rows="3"
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Select Specializations</label>
            <div className="specializations-grid">
              {specializationsList.length === 0 ? (
                <p className="text-muted">Loading specializations...</p>
              ) : (
                specializationsList.map((spec) => (
                  <label key={spec._id} className="checkbox-card">
                    <input
                      type="checkbox"
                      checked={form.specializations.includes(spec._id)}
                      onChange={() => toggleSpecialization(spec._id)}
                    />
                    <span>{spec.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Adding Doctor..." : "Add Doctor"}
          </button>
        </form>
      </div>

      <style>{`
        .specializations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
            margin-top: 8px;
        }
        .checkbox-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.2s;
            background: white;
        }
        .checkbox-card:hover {
            border-color: var(--primary);
            background: #f0f9ff;
        }
        .checkbox-card input {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }
        .text-muted {
            color: var(--text-muted);
            font-size: 14px;
        }
      `}</style>
    </div>
  );
}
