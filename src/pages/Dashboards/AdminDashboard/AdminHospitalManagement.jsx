import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import "../../styles/Dashboard.css";

export default function AdminHospitalManagement() {
    const [hospitals, setHospitals] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    const [editingHospital, setEditingHospital] = useState(null);
    const [formData, setFormData] = useState({
        hospitalName: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        avatar: "",
        specialties: [],
    });
    const [photosFile, setPhotosFile] = useState(null);
    const [availableSpecialties, setAvailableSpecialties] = useState([]);

    const fetchSpecialties = async () => {
        try {
            const res = await api.get("/admin/specialties");
            setAvailableSpecialties(res.data);
        } catch (err) {
            console.error("Fetch specialties failed", err);
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchHospitals = async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `/admin/hospitals?status=${statusFilter}&search=${search}&page=${page}&limit=${limit}`
            );
            setHospitals(res.data.hospitals);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, [statusFilter, search, page]);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/approve-hospital/${id}`);
            fetchHospitals();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject hospital?")) return;
        try {
            await api.patch(`/admin/reject-hospital/${id}`);
            fetchHospitals();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (hosp) => {
        setEditingHospital(hosp);
        setFormData({
            hospitalName: hosp.hospitalName || hosp.name || "",
            description: hosp.description || "",
            address: hosp.address || "",
            city: hosp.city || "",
            state: hosp.state || "",
            country: hosp.country || "",
            phone: hosp.phone || "",
            avatar: hosp.avatar || "",
            specialties: hosp.specialties?.map(s => s._id || s) || [],
        });
    };

    const handleUpdateHospital = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/hospitals/${editingHospital._id}`, formData);
            alert("Hospital updated successfully");
            setEditingHospital(null);
            fetchHospitals();
        } catch (err) {
            console.error(err);
            alert("Failed to update hospital");
        }
    };

    const handleUploadPhotos = async (e) => {
        e.preventDefault();
        if (!photosFile) return alert("Select photos first");

        const uploadData = new FormData();
        for (let i = 0; i < photosFile.length; i++) {
            uploadData.append("photos", photosFile[i]);
        }

        try {
            const res = await api.post(`/admin/hospitals/${editingHospital._id}/photos`, uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Photos uploaded");
            setPhotosFile(null);
            fetchHospitals();
            // Update local state instead of closing modal
            setEditingHospital({ ...editingHospital, photos: res.data.photos });
        } catch (err) {
            console.error(err);
            alert("Failed to upload photos");
        }
    };

    const handleRemovePhoto = async (publicId) => {
        if (!window.confirm("Remove photo?")) return;
        try {
            const res = await api.delete(`/admin/hospitals/${editingHospital._id}/photos/${encodeURIComponent(publicId)}`);
            alert("Photo removed");
            fetchHospitals();
            // Update local state instead of closing modal
            setEditingHospital({ ...editingHospital, photos: res.data.photos });
        } catch (err) {
            console.error(err);
            alert("Failed to remove photo");
        }
    };

    if (editingHospital) {
        return (
            <div className="hospital-management-container">
                <div className="edit-hospital-card">
                    <div className="edit-header">
                        <h3>Edit Center: {editingHospital.hospitalName || editingHospital.name}</h3>
                        <button className="btn-secondary" onClick={() => setEditingHospital(null)}>← Back to List</button>
                    </div>

                    <form onSubmit={handleUpdateHospital}>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Hospital Name</label>
                                <input className="modern-input" type="text" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} required />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Description</label>
                                <textarea className="modern-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Street Address</label>
                                <input className="modern-input" type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input className="modern-input" type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input className="modern-input" type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Phone</label>
                                <input className="modern-input" type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            <div className="form-group full-width" style={{ marginTop: "15px" }}>
                                <label className="form-label">Provided Specialties</label>
                                <div className="specialties-grid">
                                    {availableSpecialties.map(s => (
                                        <label key={s._id} className="specialty-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.specialties.includes(s._id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    let newSpecialties = [...formData.specialties];
                                                    if (checked) {
                                                        newSpecialties.push(s._id);
                                                    } else {
                                                        newSpecialties = newSpecialties.filter(id => id !== s._id);
                                                    }
                                                    setFormData({ ...formData, specialties: newSpecialties });
                                                }}
                                            />
                                            <span>{s.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">Save All Changes</button>
                            <button type="button" className="btn-save" style={{ background: "#4f46e5" }} onClick={async () => {
                                try {
                                    await api.patch(`/admin/hospitals/${editingHospital._id}/specialties`, { specialties: formData.specialties });
                                    alert('Specialties updated directly');
                                    fetchHospitals();
                                } catch (err) {
                                    alert('Failed to update specialties');
                                }
                            }}>Update Specialties Only</button>
                        </div>
                    </form>

                    <div className="photos-section">
                        <h4 style={{ marginTop: 0, marginBottom: "20px", color: "#1e293b", fontSize: "1.2rem" }}>Hospital Gallery</h4>
                        <div className="photos-grid">
                            {editingHospital.photos?.map(p => (
                                <div key={p.publicId} className="photo-card">
                                    <img src={p.url} alt="Hosp" />
                                    <button className="btn-remove-photo" onClick={() => handleRemovePhoto(p.publicId)}>✕</button>
                                </div>
                            ))}
                        </div>
                        <form className="file-upload-form" onSubmit={handleUploadPhotos}>
                            <input className="file-input" type="file" multiple accept="image/*" onChange={e => setPhotosFile(e.target.files)} />
                            <button type="submit" className="btn-save" style={{ padding: "10px 20px" }}>Upload Photos</button>
                        </form>
                    </div>
                </div>
                {renderStyles()}
            </div>
        );
    }

    return (
        <div className="hospital-management-container section-card" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
            <div className="hospital-header-actions">
                <h3>Hospital Centers</h3>
                <div className="hospital-filters">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="hospital-filter-select">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input
                        type="text"
                        className="hospital-search-input"
                        placeholder="Search hospitals..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading centers...</p> : (
                <div className="hospital-table-card">
                    <table className="hospital-table">
                        <thead>
                            <tr>
                                <th>Hospital details</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals && hospitals.length > 0 ? (
                                hospitals.map((h, index) => (
                                    <tr key={h._id || index}>
                                        <td className="hospital-name-cell">
                                            <strong>{h.hospitalName || h.name}</strong>
                                            <small>{h.email}</small>
                                            {h.specialties && h.specialties.length > 0 && (
                                                <div className="specialty-tags">
                                                    {h.specialties.map((s, idx) => (
                                                        <span key={s._id || idx} className="specialty-tag">
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ color: "#475569", fontWeight: "500" }}>
                                            {h.city ? `${h.city}, ${h.country || ''}` : "Not Specified"}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${h.hospitalStatus}`} style={{
                                                padding: "6px 14px",
                                                borderRadius: "20px",
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                textTransform: "capitalize",
                                                display: "inline-block",
                                                background: h.hospitalStatus === 'approved' ? '#dcfce7' : h.hospitalStatus === 'pending' ? '#fef08a' : '#fee2e2',
                                                color: h.hospitalStatus === 'approved' ? '#166534' : h.hospitalStatus === 'pending' ? '#854d0e' : '#991b1b',
                                            }}>
                                                {h.hospitalStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-action btn-edit" onClick={() => handleEditClick(h)}>Edit</button>
                                                {h.hospitalStatus === "pending" && (
                                                    <>
                                                        <button className="btn-action btn-approve" onClick={() => handleApprove(h._id)}>Approve</button>
                                                        <button className="btn-action btn-reject" onClick={() => handleReject(h._id)}>Reject</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                        No hospitals found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination" style={{ padding: "20px", display: "flex", justifyContent: "center", gap: "10px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                            <button className="btn-secondary" style={{ padding: "8px 16px" }} disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                            <span style={{ alignSelf: "center", fontWeight: "600", color: "#475569" }}>{page} / {totalPages}</span>
                            <button className="btn-secondary" style={{ padding: "8px 16px" }} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    )}
                </div>
            )}
            {renderStyles()}
        </div>
    );
}

function renderStyles() {
    return (
        <style>{`
            .hospital-management-container {
                font-family: 'Inter', sans-serif;
            }
            .hospital-header-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                padding: 24px 30px;
                border-radius: 20px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                margin-bottom: 24px;
            }
            .hospital-header-actions h3 { margin: 0; font-size: 1.6rem; color: #0f172a; font-weight: 800; }
            .hospital-filters {
                display: flex;
                gap: 12px;
            }
            .hospital-filter-select, .hospital-search-input {
                padding: 12px 18px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                background: #f8fafc;
                font-size: 0.95rem;
                outline: none;
                transition: all 0.2s;
                font-weight: 500;
                color: #334155;
            }
            .hospital-filter-select:focus, .hospital-search-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                background: white;
            }

            .hospital-table-card {
                background: white;
                border-radius: 20px;
                box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
                overflow: hidden;
            }
            
            .hospital-table {
                width: 100%;
                border-collapse: collapse;
            }
            .hospital-table th {
                background: #f8fafc;
                padding: 18px 24px;
                text-align: left;
                font-size: 0.8rem;
                font-weight: 700;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #e2e8f0;
            }
            .hospital-table td {
                padding: 20px 24px;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: middle;
            }
            .hospital-table tr:hover td {
                background: #f8fafc;
            }
            .hospital-name-cell strong {
                display: block;
                color: #0f172a;
                font-size: 1.05rem;
                margin-bottom: 4px;
                font-weight: 700;
            }
            .hospital-name-cell small {
                color: #64748b;
                font-size: 0.85rem;
            }
            
            .specialty-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 10px;
                max-width: 300px;
            }
            .specialty-tag {
                font-size: 0.7rem;
                background: #f1f5f9;
                color: #475569;
                padding: 4px 10px;
                border-radius: 20px;
                font-weight: 700;
                border: 1px solid #e2e8f0;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
            }
            .btn-action {
                padding: 8px 16px;
                border-radius: 10px;
                font-size: 0.85rem;
                font-weight: 700;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }
            .btn-edit { background: #eff6ff; color: #3b82f6; }
            .btn-edit:hover { background: #dceafe; transform: translateY(-1px); }
            .btn-approve { background: #ecfdf5; color: #10b981; }
            .btn-approve:hover { background: #d1fae5; transform: translateY(-1px); }
            .btn-reject { background: #fef2f2; color: #ef4444; }
            .btn-reject:hover { background: #fee2e2; transform: translateY(-1px); }

            /* EDIT FORM */
            .edit-hospital-card {
                background: white;
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
                max-width: 1000px;
                margin: 0 auto;
            }
            .edit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e2e8f0;
            }
            .edit-header h3 { margin: 0; font-size: 1.8rem; color: #0f172a; font-weight: 800;}
            
            .form-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
            }
            .form-group.full-width { grid-column: span 2; }
            
            .modern-input, .modern-textarea {
                width: 100%;
                padding: 14px 18px;
                border-radius: 14px;
                border: 1px solid #e2e8f0;
                background: #f8fafc;
                font-size: 0.95rem;
                transition: all 0.2s;
                outline: none;
            }
            .modern-input:focus, .modern-textarea:focus {
                border-color: #3b82f6;
                background: white;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            }
            .modern-textarea { resize: vertical; min-height: 120px; }
            .form-label {
                display: block;
                font-size: 0.85rem;
                font-weight: 700;
                color: #475569;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .specialties-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 12px;
                background: #f8fafc;
                padding: 24px;
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                max-height: 350px;
                overflow-y: auto;
            }
            .specialty-checkbox-label {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: white;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .specialty-checkbox-label:hover { border-color: #cbd5e1; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .specialty-checkbox-label input { width: 18px; height: 18px; cursor: pointer; accent-color: #0f172a; }
            .specialty-checkbox-label span { font-size: 0.95rem; font-weight: 600; color: #334155; }

            .form-actions {
                display: flex;
                gap: 16px;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
            }
            .btn-save {
                padding: 14px 28px;
                background: #0f172a;
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-save:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 15px -3px rgba(15, 23, 42, 0.2); }
            .btn-secondary {
                padding: 12px 24px;
                background: #f1f5f9;
                color: #475569;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-secondary:hover { background: #e2e8f0; color: #0f172a; }

            .photos-section {
                margin-top: 40px;
                background: #f8fafc;
                padding: 30px;
                border-radius: 20px;
                border: 2px dashed #cbd5e1;
            }
            .photos-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 24px;
            }
            .photo-card {
                position: relative;
                width: 140px;
                height: 140px;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .photo-card img { width: 100%; height: 100%; object-fit: cover; }
            .btn-remove-photo {
                position: absolute;
                top: 8px; right: 8px;
                width: 32px; height: 32px;
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(4px);
                transition: all 0.2s;
            }
            .btn-remove-photo:hover { background: rgba(220, 38, 38, 1); transform: scale(1.1); }
            
            .file-upload-form { display: flex; gap: 12px; align-items: center; }
            .file-input {
                padding: 10px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                flex: 1;
                font-weight: 500;
                color: #475569;
                font-size: 0.9rem;
            }
            .file-input::file-selector-button {
                margin-right: 20px;
                border: none;
                background: #f1f5f9;
                padding: 10px 20px;
                border-radius: 10px;
                color: #0f172a;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 700;
                font-size: 0.85rem;
            }
            .file-input::file-selector-button:hover {
                background: #e2e8f0;
            }
        `}</style>
    );
}
