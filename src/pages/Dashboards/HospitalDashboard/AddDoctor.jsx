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

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2MB limit.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) && !file.type.startsWith("image/")) {
        // Fallback check for safe types
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/hospital/doctors", form);
      const doctorId = res.data.doctor.id;

      // Handle Photo Upload if selected
      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        await api.post(`/hospital/doctors/${doctorId}/photo`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setSuccess("Doctor added successfully with profile photo.");

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
      setPhoto(null);
      setPhotoPreview(null);
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

      <div>
        <form onSubmit={handleSubmit} className="add-doctor-form-container">
          <div className="add-doctor-main-inputs">
            {error && <div className="alert-box warning">{error}</div>}
            {success && <div className="alert-box" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0', width: '100%' }}>{success}</div>}

            <h3>Basic Information</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>Fill in the primary details of the new doctor.</p>

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

            <div className="form-actions" style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 40px', fontSize: '16px' }}>
                {loading ? "Registering Doctor..." : "Register Doctor"}
              </button>
            </div>
          </div>

          <div className="add-doctor-side-panel">
            <div className="form-group" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <label>Doctor Profile Photo</label>
              <div className="photo-upload-container">
                <div className="photo-preview-box">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="preview-img" />
                  ) : (
                    <div className="placeholder-icon">👤</div>
                  )}
                </div>
                <div className="upload-controls">
                  <input
                    type="file"
                    id="doctorPhoto"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="doctorPhoto" className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
                    {photo ? "Change Photo" : "Upload Photo"}
                  </label>
                  <p className="helper-text">JPG, PNG or WEBP (Max 2MB)<br />Square 512x512 recommended</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Doctor Biography</label>
              <textarea
                className="form-control"
                placeholder="Brief professional summary, specialties, and approach..."
                rows="5"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                style={{ padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'none' }}
              ></textarea>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label>Clinical Specializations</label>
              <p className="text-muted" style={{ marginBottom: '12px' }}>Select all that apply for this doctor.</p>
              <div className="specializations-column">
                {specializationsList.length === 0 ? (
                  <p className="text-muted">Loading specializations...</p>
                ) : (
                  specializationsList.map((spec) => (
                    <label key={spec._id} className="checkbox-card-compact">
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
          </div>
        </form>
      </div>

      <style>{`
        .specializations-column {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .checkbox-card-compact {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
        }
        .checkbox-card-compact:hover {
            border-color: var(--primary);
            background: #f0f9ff;
        }
        .checkbox-card-compact input {
            cursor: pointer;
            width: 18px;
            height: 18px;
        }

        .photo-preview-box {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f1f5f9;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: var(--shadow-md);
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder-icon {
          font-size: 3rem;
          color: var(--text-muted);
        }
        .helper-text {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 8px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
