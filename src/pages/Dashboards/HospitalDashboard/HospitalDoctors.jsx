import React, { useEffect, useState } from "react";
import api from "../../../api/api";
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
      name: selectedDoctor.name || "",
      designation: selectedDoctor.designation || "",
      experience: selectedDoctor.experience || "",
      consultationFee: selectedDoctor.consultationFee || "",
      about: selectedDoctor.about || "",
      qualifications: selectedDoctor.qualifications || "",
      licenseNumber: selectedDoctor.licenseNumber || "",
      specializations: selectedDoctor.specializationIds || [],
    });
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/hospital/doctors/${selectedDoctor.id}/profile`, editForm);
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
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specializations?.some(s => s.toLowerCase().includes(search.toLowerCase()))
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
                  <div className="item-info">
                    <strong>{doc.name}</strong>
                    <span className="designation">{doc.designation || "Doctor"}</span>
                    <span className="specs">{doc.specializations?.join(", ") || "No specialization"}</span>
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
                  <h4>Edit Profile: {selectedDoctor.name}</h4>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
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
                          <span>{spec.name}</span>
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
                  <div className="header-main">
                    <h4>{selectedDoctor.name}</h4>
                    <span className="badge badge-secondary">{selectedDoctor.designation || "Doctor"}</span>
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
                    <p>{selectedDoctor.about || "No biography provided yet."}</p>
                  </div>

                  <div className="detail-grid">
                    <div className="info-box">
                      <label>Qualifications</label>
                      <p>{selectedDoctor.qualifications || "—"}</p>
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
                        <span key={idx} className="spec-pill">{s}</span>
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
            background: #eff6ff;
            border-left: 4px solid var(--primary);
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
            color: var(--primary);
            margin-top: 4px;
        }
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        .status-dot.active { background: #22c55e; }
        .status-dot.inactive { background: #ef4444; }

        /* Detail Side */
        .doctor-detail-container {
            flex: 1;
            overflow-y: auto;
            background: white;
        }
        .empty-detail {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
        }
        .profile-detail, .profile-editor {
            padding: 30px;
        }
        .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
        }
        .header-main h4 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header-actions {
            display: flex;
            gap: 10px;
        }
        .detail-section {
            margin-bottom: 30px;
        }
        .detail-section h5 {
            font-size: 16px;
            margin-bottom: 10px;
            color: var(--text-main);
        }
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f8fafc;
            padding: 15px;
            border-radius: var(--radius);
        }
        .info-box label {
            font-size: 12px;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 5px;
        }
        .pills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .spec-pill {
            background: #e0f2fe;
            color: #0369a1;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
        }

        /* Editor Styles */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .full-width {
            grid-column: span 2;
        }
        .specs-editor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        .checkbox-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #f1f5f9;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
        }
        .checkbox-pill:hover { background: #e2e8f0; }
        .checkbox-pill input:checked + span { color: var(--primary); font-weight: 600; }

        .form-actions {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
            .doctor-management-container { flex-direction: column; height: auto; }
            .doctor-list-container { width: 100%; height: 300px; }
            .grid-2 { grid-template-columns: 1fr; }
            .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
