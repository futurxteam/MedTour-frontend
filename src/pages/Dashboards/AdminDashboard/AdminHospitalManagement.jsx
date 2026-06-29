import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import "../../styles/Dashboard.css";
import { adminLocalize } from "../../../utils/adminLocalize";

export default function AdminHospitalManagement() {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    const [editingHospital, setEditingHospital] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
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
    const [newHospitalData, setNewHospitalData] = useState({
        email: "",
        password: "",
        hospitalName: "",
        hospitalName_ar: "",
        description: "",
        description_ar: "",
        address: "",
        address_ar: "",
        city: "",
        city_ar: "",
        state: "",
        state_ar: "",
        country: "",
        country_ar: "",
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
            hospitalName: adminLocalize(hosp.hospitalName || hosp.name) || "",
            description: adminLocalize(hosp.description) || "",
            address: adminLocalize(hosp.address) || "",
            city: adminLocalize(hosp.city) || "",
            state: adminLocalize(hosp.state) || "",
            country: adminLocalize(hosp.country) || "",
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

    const handleAddHospital = async (e) => {
        e.preventDefault();
        try {
            await api.post("/admin/hospitals", newHospitalData);
            alert("Hospital added successfully");
            setIsAdding(false);
            setNewHospitalData({
                email: "",
                password: "",
                hospitalName: "",
                hospitalName_ar: "",
                description: "",
                description_ar: "",
                address: "",
                address_ar: "",
                city: "",
                city_ar: "",
                state: "",
                state_ar: "",
                country: "",
                country_ar: "",
                phone: "",
                avatar: "",
                specialties: [],
            });
            fetchHospitals();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to add hospital");
        }
    };

    if (isAdding) {
        return (
            <div className="hospital-management-container">
                <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>➕ Add New Hospital</h3>
                        <p className="subtitle">Register a new medical facility with login credentials</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setIsAdding(false)}>
                        ← Back to Center List
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <form onSubmit={handleAddHospital} className="modern-form">
                            <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--text-main)' }}>🔑 Login Credentials</h4>
                            <div className="form-grid" style={{ marginBottom: '30px' }}>
                                <div className="form-group">
                                    <label>✉️ Email Address</label>
                                    <input className="modern-input" type="email" value={newHospitalData.email} onChange={e => setNewHospitalData({ ...newHospitalData, email: e.target.value })} required placeholder="hospital@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>🔒 Password</label>
                                    <input className="modern-input" type="password" value={newHospitalData.password} onChange={e => setNewHospitalData({ ...newHospitalData, password: e.target.value })} required placeholder="••••••••" />
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--text-main)' }}>📋 General Info (English)</h4>
                            <div className="form-grid" style={{ marginBottom: '30px' }}>
                                <div className="form-group full-width">
                                    <label>🏥 Hospital Name (EN)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.hospitalName} onChange={e => setNewHospitalData({ ...newHospitalData, hospitalName: e.target.value })} required placeholder="e.g. City General Hospital" />
                                </div>

                                <div className="form-group full-width">
                                    <label>📝 Description (EN)</label>
                                    <textarea className="modern-textarea" value={newHospitalData.description} rows={4} onChange={e => setNewHospitalData({ ...newHospitalData, description: e.target.value })} placeholder="Describe the center's excellence in English..." />
                                </div>

                                <div className="form-group full-width">
                                    <label>📍 Physical Address (EN)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.address} onChange={e => setNewHospitalData({ ...newHospitalData, address: e.target.value })} placeholder="Address in English" />
                                </div>

                                <div className="form-group">
                                    <label>🏙️ City (EN)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.city} onChange={e => setNewHospitalData({ ...newHospitalData, city: e.target.value })} placeholder="City in English" />
                                </div>

                                <div className="form-group">
                                    <label>🗺️ State (EN)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.state} onChange={e => setNewHospitalData({ ...newHospitalData, state: e.target.value })} placeholder="State in English" />
                                </div>

                                <div className="form-group">
                                    <label>🌍 Country (EN)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.country} onChange={e => setNewHospitalData({ ...newHospitalData, country: e.target.value })} placeholder="Country in English" />
                                </div>

                                <div className="form-group">
                                    <label>📞 Contact Number</label>
                                    <input className="modern-input" type="text" value={newHospitalData.phone} onChange={e => setNewHospitalData({ ...newHospitalData, phone: e.target.value })} placeholder="+1234567890" />
                                </div>

                                <div className="form-group full-width">
                                    <label>🖼️ Avatar URL</label>
                                    <input className="modern-input" type="text" value={newHospitalData.avatar} onChange={e => setNewHospitalData({ ...newHospitalData, avatar: e.target.value })} placeholder="https://example.com/avatar.jpg" />
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--text-main)' }}>📋 Translations (Arabic - Optional)</h4>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>🏥 Hospital Name (AR)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.hospitalName_ar} onChange={e => setNewHospitalData({ ...newHospitalData, hospitalName_ar: e.target.value })} placeholder="مستشفى المدينة العام" style={{ direction: 'rtl' }} />
                                </div>

                                <div className="form-group full-width">
                                    <label>📝 Description (AR)</label>
                                    <textarea className="modern-textarea" value={newHospitalData.description_ar} rows={4} onChange={e => setNewHospitalData({ ...newHospitalData, description_ar: e.target.value })} placeholder="وصف المنشأة الطبية باللغة العربية..." style={{ direction: 'rtl' }} />
                                </div>

                                <div className="form-group full-width">
                                    <label>📍 Physical Address (AR)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.address_ar} onChange={e => setNewHospitalData({ ...newHospitalData, address_ar: e.target.value })} placeholder="العنوان باللغة العربية" style={{ direction: 'rtl' }} />
                                </div>

                                <div className="form-group">
                                    <label>🏙️ City (AR)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.city_ar} onChange={e => setNewHospitalData({ ...newHospitalData, city_ar: e.target.value })} placeholder="المدينة باللغة العربية" style={{ direction: 'rtl' }} />
                                </div>

                                <div className="form-group">
                                    <label>🗺️ State (AR)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.state_ar} onChange={e => setNewHospitalData({ ...newHospitalData, state_ar: e.target.value })} placeholder="الولاية/المحافظة باللغة العربية" style={{ direction: 'rtl' }} />
                                </div>

                                <div className="form-group">
                                    <label>🌍 Country (AR)</label>
                                    <input className="modern-input" type="text" value={newHospitalData.country_ar} onChange={e => setNewHospitalData({ ...newHospitalData, country_ar: e.target.value })} placeholder="الدولة باللغة العربية" style={{ direction: 'rtl' }} />
                                </div>
                            </div>

                            <button type="submit" className="dashboard-btn" style={{ marginTop: '32px', width: '100%', height: '54px', fontSize: '1rem' }}>
                                ➕ Create Hospital Facility
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Specialties Section */}
                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <h4 style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🔬 Provided Specialties
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                background: 'var(--bg-main)',
                                padding: '16px',
                                borderRadius: '14px',
                                maxHeight: '450px',
                                overflowY: 'auto',
                                border: '1px solid var(--border-soft)'
                            }}>
                                {availableSpecialties.map(s => (
                                    <label key={s._id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '10px 14px',
                                        background: newHospitalData.specialties.includes(s._id) ? 'var(--accent-light)' : 'white',
                                        borderRadius: '10px',
                                        border: '1px solid',
                                        borderColor: newHospitalData.specialties.includes(s._id) ? 'var(--accent)' : 'var(--border-soft)',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                                            checked={newHospitalData.specialties.includes(s._id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                let newSpecialties = [...newHospitalData.specialties];
                                                if (checked) newSpecialties.push(s._id);
                                                else newSpecialties = newSpecialties.filter(id => id !== s._id);
                                                setNewHospitalData({ ...newHospitalData, specialties: newSpecialties });
                                            }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: newHospitalData.specialties.includes(s._id) ? '700' : '500', color: 'var(--text-main)' }}>
                                            {adminLocalize(s.name)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (editingHospital) {
        return (
            <div className="hospital-management-container">
                <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>✏️ Edit Center: {adminLocalize(editingHospital.hospitalName || editingHospital.name)}</h3>
                        <p className="subtitle">Update facility details, specialties, and media gallery</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setEditingHospital(null)}>
                        ← Back to Center List
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h4 style={{ marginBottom: '24px', fontSize: '1.2rem', color: 'var(--text-main)' }}>📋 General Information</h4>
                        <form onSubmit={handleUpdateHospital} className="modern-form">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>🏥 Hospital Name</label>
                                    <input className="modern-input" type="text" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} required />
                                </div>

                                <div className="form-group full-width">
                                    <label>📝 About the Facility</label>
                                    <textarea className="modern-textarea" value={formData.description} rows={5} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the center's excellence..." />
                                </div>

                                <div className="form-group full-width">
                                    <label>📍 Physical Address</label>
                                    <input className="modern-input" type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <label>🏙️ City</label>
                                    <input className="modern-input" type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <label>🌍 Country</label>
                                    <input className="modern-input" type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <label>📞 Contact Number</label>
                                    <input className="modern-input" type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="dashboard-btn" style={{ marginTop: '32px', width: '100%', height: '54px', fontSize: '1rem' }}>
                                💾 Save Facility Details
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Specialties Section */}
                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <h4 style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🔬 Provided Specialties
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                background: 'var(--bg-main)',
                                padding: '16px',
                                borderRadius: '14px',
                                maxHeight: '350px',
                                overflowY: 'auto',
                                border: '1px solid var(--border-soft)'
                            }}>
                                {availableSpecialties.map(s => (
                                    <label key={s._id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '10px 14px',
                                        background: formData.specialties.includes(s._id) ? 'var(--accent-light)' : 'white',
                                        borderRadius: '10px',
                                        border: '1px solid',
                                        borderColor: formData.specialties.includes(s._id) ? 'var(--accent)' : 'var(--border-soft)',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                                            checked={formData.specialties.includes(s._id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                let newSpecialties = [...formData.specialties];
                                                if (checked) newSpecialties.push(s._id);
                                                else newSpecialties = newSpecialties.filter(id => id !== s._id);
                                                setFormData({ ...formData, specialties: newSpecialties });
                                            }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: formData.specialties.includes(s._id) ? '700' : '500', color: 'var(--text-main)' }}>
                                            {adminLocalize(s.name)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <h4 style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🖼️ Gallery Management
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                {editingHospital.photos?.map(p => (
                                    <div key={p.publicId} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
                                        <img src={p.url} alt="Hosp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '12px' }}
                                            onClick={() => handleRemovePhoto(p.publicId)}
                                        >✕</button>
                                    </div>
                                ))}
                                {(!editingHospital.photos || editingHospital.photos.length === 0) && (
                                    <div style={{ gridColumn: 'span 2', padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-main)', borderRadius: '10px' }}>
                                        No photos uploaded yet
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleUploadPhotos} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label className="custom-file-upload" style={{
                                    display: 'block',
                                    padding: '12px',
                                    background: 'white',
                                    border: '1px dashed var(--accent)',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-dark)',
                                    fontWeight: '600'
                                }}>
                                    <input type="file" multiple accept="image/*" onChange={e => setPhotosFile(e.target.files)} style={{ display: 'none' }} />
                                    {photosFile ? `📂 ${photosFile.length} files selected` : "📁 Click to Select Photos"}
                                </label>
                                <button type="submit" className="secondary-btn" disabled={!photosFile} style={{ width: '100%', background: photosFile ? 'var(--accent)' : 'var(--bg-main)', color: photosFile ? 'white' : 'var(--text-muted)' }}>
                                    📤 Upload to Cloud
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="hospital-management-container">
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>🏥 Hospital Center</h3>
                    <p className="subtitle">Manage verified medical facilities and verification requests</p>
                </div>
                <button className="dashboard-btn" onClick={() => setIsAdding(true)}>
                    ➕ Add New Hospital
                </button>
            </div>

            <div className="dashboard-card status-card no-hover" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="filter-group">
                        <label className="field-label">Filter Status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="modern-select" style={{ width: '180px' }}>
                            <option value="all">All Statuses</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="field-label">Search Centers</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}>🔍</span>
                            <input
                                type="text"
                                className="modern-input"
                                placeholder="Name or City..."
                                style={{ width: '250px', paddingLeft: '40px' }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Loading centers...</p>
                </div>
            ) : (
                <div className="hospital-list">
                    {hospitals && hospitals.length > 0 ? (
                        hospitals.map((h, index) => (
                            <div key={h._id || index} className="dashboard-card registry-card">
                                <div className="registry-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <b style={{ fontSize: '1.25rem' }}>{adminLocalize(h.hospitalName || h.name)}</b>
                                        <span className={`status-pill ${h.hospitalStatus}`} style={{
                                            background: h.hospitalStatus === 'approved' ? '#dcfce7' : h.hospitalStatus === 'pending' ? '#fef08a' : '#fee2e2',
                                            color: h.hospitalStatus === 'approved' ? '#166534' : h.hospitalStatus === 'pending' ? '#854d0e' : '#991b1b',
                                            fontSize: '0.65rem'
                                        }}>
                                            • {h.hospitalStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>✉️ {h.email}</p>
                                    <p style={{ marginTop: '4px', fontWeight: '600' }}>📍 {adminLocalize(h.city) ? `${adminLocalize(h.city)}, ${adminLocalize(h.country) || ''}` : "Location Not Specified"}</p>

                                    {h.specialties && h.specialties.length > 0 && (
                                        <div className="registry-meta" style={{ marginTop: '12px' }}>
                                            {h.specialties.slice(0, 5).map((s, idx) => (
                                                <span key={s._id || idx} className="spec-pill">
                                                    {adminLocalize(s.name)}
                                                </span>
                                            ))}
                                            {h.specialties.length > 5 && <span className="spec-pill">+{h.specialties.length - 5} more</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="registry-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button
                                        className="dashboard-btn"
                                        style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: 'white', border: 'none' }}
                                        onClick={() => {
                                            localStorage.setItem("adminViewAsHospitalId", h._id);
                                            navigate("/dashboard/hospital");
                                        }}
                                    >
                                        🔑 Enter Dashboard
                                    </button>
                                    <button className="dashboard-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleEditClick(h)}>✏️ Edit Profile</button>
                                    {h.hospitalStatus === "pending" && (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button className="dashboard-btn" style={{ background: '#dcfce7', color: '#166534', boxShadow: 'none', padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleApprove(h._id)}>✅ Approve</button>
                                            <button className="dashboard-btn" style={{ background: '#fee2e2', color: '#991b1b', boxShadow: 'none', padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleReject(h._id)}>❌ Reject</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No hospitals found matching your criteria.</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                            <span style={{ margin: '0 15px', fontWeight: '700', color: 'var(--text-muted)' }}>{page} of {totalPages}</span>
                            <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
