import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { getDoctorPhotoUrl, uploadDoctorPhoto } from "../../../api/api";
import { adminLocalize } from "../../../utils/adminLocalize";
import "../../styles/HospitalDashboard.css";

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [specializationsList, setSpecializationsList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: "",
    designation: "",
    experience: "",
    consultationFee: "",
    about: "",
    qualifications: "",
    licenseNumber: "",
    specializations: [],
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hospital/doctors");
      setDoctors(res.data);
      if (res.data.length > 0 && !selectedDoctor) {
        setSelectedDoctor(res.data[0]);
      } else if (selectedDoctor) {
        // Refresh selected doctor data
        const updated = res.data.find(d => d.id === selectedDoctor.id);
        if (updated) setSelectedDoctor(updated);
      }
    } catch {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await api.get("/hospital/specializations");
      setSpecializationsList(res.data.specializations || []);
    } catch (err) {
      console.error("Failed to fetch specializations:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/hospital/doctors/${id}/toggle`);
      fetchDoctors();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const startEditing = () => {
    setEditForm({
      name: adminLocalize(selectedDoctor.name) || "",
      designation: adminLocalize(selectedDoctor.designation) || "",
      experience: selectedDoctor.experience || "",
      consultationFee: selectedDoctor.consultationFee || "",
      about: adminLocalize(selectedDoctor.about) || "",
      qualifications: adminLocalize(selectedDoctor.qualifications) || "",
      licenseNumber: selectedDoctor.licenseNumber || "",
      specializations: selectedDoctor.specializationIds || [],
    });
    setPhoto(null);
    setPhotoPreview(selectedDoctor.hasPhoto ? getDoctorPhotoUrl(selectedDoctor.id) : null);
    setEditMode(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/hospital/doctors/${selectedDoctor.id}/profile`, editForm);

      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        await uploadDoctorPhoto(selectedDoctor.id, formData);
      }

      setEditMode(false);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialization = (specId) => {
    setEditForm((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specId)
        ? prev.specializations.filter((id) => id !== specId)
        : [...prev.specializations, specId],
    }));
  };

  const filteredDoctors = doctors.filter(doc =>
    adminLocalize(doc.name).toLowerCase().includes(search.toLowerCase()) ||
    doc.specializations?.some(s => adminLocalize(s).toLowerCase().includes(search.toLowerCase()))
  );

  if (loading && doctors.length === 0) return <div className="loading-container">Loading managed doctors...</div>;

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Managed Doctors</h3>
        <p style={{ color: "var(--text-muted)" }}>Manage and edit your medical team profiles.</p>
      </div>

      <div className="doctor-management-container">
        {/* Left Side: Doctor List */}
        <div className="doctor-list-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="list-items">
            {filteredDoctors.length === 0 ? (
              <p className="empty-msg">No doctors matching search.</p>
            ) : (
              filteredDoctors.map(doc => (
                <div
                  key={doc.id}
                  className={`doctor-item ${selectedDoctor?.id === doc.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setEditMode(false);
                  }}
                >
                  <div className="item-avatar">
                    {doc.hasPhoto ? (
                      <img src={getDoctorPhotoUrl(doc.id)} alt={doc.name} />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
                    )}
                  </div>
                  <div className="item-info">
                    <strong>{adminLocalize(doc.name)}</strong>
                    <span className="designation">{adminLocalize(doc.designation) || "Doctor"}</span>
                    <span className="specs">{doc.specializations?.map(s => adminLocalize(s)).join(", ") || "No specialization"}</span>
                  </div>
                  <div className="item-status">
                    <span className={`status-dot ${doc.active ? 'active' : 'inactive'}`}></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detail / Editor */}
        <div className="doctor-detail-container">
          {selectedDoctor ? (
            editMode ? (
              /* EDITOR MODE */
              <div className="profile-editor">
                <div className="detail-header">
                  <h4>Edit Profile: {adminLocalize(selectedDoctor.name)}</h4>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                </div>

                <div className="photo-edit-section">
                  <div className="edit-avatar-box">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" />
                    ) : (
                      <span className="placeholder">👤</span>
                    )}
                  </div>
                  <div className="upload-btn-wrapper">
                    <input
                      type="file"
                      id="editPhoto"
                      hidden
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="editPhoto" className="btn btn-outline">Change Profile Photo</label>
                    <p className="upload-hint">Square image, JPG/PNG/WEBP, Max 2MB</p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="edit-form grid-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Consultation Fee ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.consultationFee}
                      onChange={(e) => setEditForm({ ...editForm, consultationFee: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualifications</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.qualifications}
                      onChange={(e) => setEditForm({ ...editForm, qualifications: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.licenseNumber}
                      onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>About / Bio</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={editForm.about}
                      onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group full-width">
                    <label>Specializations</label>
                    <div className="specs-editor-grid">
                      {specializationsList.map(spec => (
                        <label key={spec._id} className="checkbox-pill">
                          <input
                            type="checkbox"
                            checked={editForm.specializations.includes(spec._id)}
                            onChange={() => toggleSpecialization(spec._id)}
                          />
                          <span>{adminLocalize(spec.name)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-actions full-width">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* DETAIL VIEW MODE */
              <div className="profile-detail">
                <div className="detail-header">
                  <div className="detail-avatar">
                    {selectedDoctor.hasPhoto ? (
                      <img src={getDoctorPhotoUrl(selectedDoctor.id)} alt={selectedDoctor.name} />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
                    )}
                  </div>
                  <div className="header-main">
                    <h4>{adminLocalize(selectedDoctor.name)}</h4>
                    <span className="badge badge-secondary">{adminLocalize(selectedDoctor.designation) || "Doctor"}</span>
                  </div>
                  <div className="header-actions">
                    <button className="btn btn-primary" onClick={startEditing}>Edit Profile</button>
                    <button
                      className={`btn ${selectedDoctor.active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleStatus(selectedDoctor.id)}
                    >
                      {selectedDoctor.active ? "Disable Account" : "Enable Account"}
                    </button>
                  </div>
                </div>

                <div className="detail-body">
                  <div className="detail-section">
                    <h5>Professional Summary</h5>
                    <p>{adminLocalize(selectedDoctor.about) || "No biography provided yet."}</p>
                  </div>

                  <div className="detail-grid">
                    <div className="info-box">
                      <label>Qualifications</label>
                      <p>{adminLocalize(selectedDoctor.qualifications) || "—"}</p>
                    </div>
                    <div className="info-box">
                      <label>Experience</label>
                      <p>{selectedDoctor.experience ? `${selectedDoctor.experience} Years` : "—"}</p>
                    </div>
                    <div className="info-box">
                      <label>Consultation Fee</label>
                      <p>{selectedDoctor.consultationFee ? `$${selectedDoctor.consultationFee}` : "—"}</p>
                    </div>
                    <div className="info-box">
                      <label>License Number</label>
                      <p>{selectedDoctor.licenseNumber || "—"}</p>
                    </div>
                    <div className="info-box">
                      <label>Email</label>
                      <p>{selectedDoctor.email}</p>
                    </div>
                    <div className="info-box">
                      <label>Profile Status</label>
                      <p>{selectedDoctor.profileCompleted ? "✅ Completed" : "⚠️ Incomplete"}</p>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h5>Assigned Specializations</h5>
                    <div className="pills-list">
                      {selectedDoctor.specializations?.map((s, idx) => (
                        <span key={idx} className="spec-pill">{adminLocalize(s)}</span>
                      )) || "None"}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="empty-detail">
              <p>Select a doctor to view and manage their profile.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .doctor-management-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
            background: white;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            height: calc(100vh - 250px);
            min-height: 600px;
            overflow: hidden;
        }

        /* List Side */
        .doctor-list-container {
            width: 350px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            background: #f8fafc;
        }
        .search-bar {
            padding: 15px;
            border-bottom: 1px solid var(--border);
            background: white;
        }
        .list-items {
            flex: 1;
            overflow-y: auto;
        }
        .doctor-item {
            padding: 15px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
        }
        .doctor-item:hover {
            background: #f1f5f9;
        }
        .doctor-item.active {
            background: rgba(13, 148, 136, 0.05); /* Match accent light */
            border-left: 4px solid var(--accent);
        }
        .item-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .item-info .designation {
            font-size: 13px;
            color: var(--text-muted);
        }
        .item-info .specs {
            font-size: 12px;
            color: var(--accent);
            margin-top: 4px;
        }
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        .status-dot.active { background: #10b981; }
        .status-dot.inactive { background: #ef4444; }

        /* Detail Side */
        .doctor-detail-container {
            flex: 1;
            overflow-y: auto;
            background: white;
            border-radius: var(--radius-xl);
        }
        .empty-detail {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
        }
        .profile-detail, .profile-editor {
            padding: 32px;
        }
        .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--border-soft);
            padding-bottom: 20px;
        }
        .header-main h4 {
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }
        .header-actions {
            display: flex;
            gap: 12px;
        }
        .detail-section {
            margin-bottom: 32px;
        }
        .detail-section h5 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-main);
            letter-spacing: -0.01em;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }
        .info-box {
            background: var(--bg-main);
            padding: 20px;
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-soft);
        }
        .info-box label {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 6px;
        }
        .pills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .spec-pill {
            background: var(--accent-light);
            color: var(--accent-dark);
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
        }

        /* Editor Styles */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        .full-width {
            grid-column: span 2;
        }
        .specs-editor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
            margin-top: 12px;
        }
        .checkbox-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background: var(--bg-main);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 14px;
            font-weight: 500;
            border: 1px solid var(--border-soft);
        }
        .checkbox-pill:hover { 
            background: white; 
            border-color: var(--accent);
            box-shadow: var(--shadow-sm); 
        }
        .checkbox-pill input {
            accent-color: var(--accent);
            width: 16px;
            height: 16px;
        }
        .checkbox-pill input:checked + span { 
            color: var(--accent-dark); 
            font-weight: 700; 
        }

        .form-actions {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--border-soft);
        }

        @media (max-width: 1024px) {
            .doctor-management-container { flex-direction: column; height: auto; }
            .doctor-list-container { width: 100%; height: 350px; }
            .grid-2 { grid-template-columns: 1fr; }
            .full-width { grid-column: span 1; }
        }

        /* Avatar Styles */
        .item-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--border-soft);
          overflow: hidden;
          margin-right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder { font-size: 24px; color: var(--text-muted); }

        .detail-avatar {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 24px;
          border: 4px solid white;
          box-shadow: var(--shadow-md);
        }
        .detail-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .photo-edit-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding: 24px;
          background: var(--bg-main);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-soft);
        }
        .edit-avatar-box {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .edit-avatar-box img { width: 100%; height: 100%; object-fit: cover; }
        .edit-avatar-box .placeholder { font-size: 40px; color: var(--text-muted); }
        .btn-outline {
          border: 2px solid var(--accent);
          color: var(--accent-dark);
          background: white;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-outline:hover {
          background: var(--accent-light);
          box-shadow: inset 0 0 0 1px rgba(13, 148, 136, 0.1);
        }
        .upload-hint { font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 500; }

      `}</style>
    </div>
  );
}
