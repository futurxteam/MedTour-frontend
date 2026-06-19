import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { adminLocalize } from "../../../utils/adminLocalize";

export default function AdminSpecialties() {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const fetchSpecialties = async () => {
        try {
            const res = await api.get("/admin/specialties");
            setSpecialties(res.data);
        } catch (err) {
            console.error("Fetch specialties failed", err);
            setError("Failed to load specializations");
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchSpecialties().finally(() => setLoading(false));
    }, []);

    const filteredSpecialties = specialties.filter((s) =>
        adminLocalize(s.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/admin/specialties", form);
            setForm({
                name: "",
                description: "",
            });
            fetchSpecialties();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add specialization");
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/admin/specialties/${id}/status`);
            fetchSpecialties();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="admin-specialties">
            <div className="view-header">
                <h3>🔬 Medical Specializations</h3>
                <p className="subtitle">Master list of clinical departments and specialties</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ADD FORM */}
            <div className="dashboard-card add-surgery-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--accent-light)', padding: '10px', borderRadius: '12px', fontSize: '1.25rem' }}>➕</div>
                    <h4 style={{ margin: 0 }}>Add New Specialization</h4>
                </div>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-grid">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>🏷️ Specialization Name</label>
                            <input
                                className="modern-input"
                                placeholder="e.g. Cardiology"
                                value={form.name}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>📝 Description (Optional)</label>
                        <textarea
                            className="modern-textarea"
                            placeholder="Brief description of the specialization..."
                            value={form.description}
                            rows={3}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <button type="submit" className="dashboard-btn">
                        <span>💾</span> Save Specialization
                    </button>
                </form>
            </div>

            {/* FILTERS & LIST */}
            <div className="view-header" style={{ marginTop: '4rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--accent-light)', padding: '8px', borderRadius: '10px', fontSize: '1.1rem' }}>📋</div>
                        <h4 style={{ margin: 0 }}>Current Specializations ({filteredSpecialties.length})</h4>
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search specializations..."
                            className="modern-input"
                            style={{ width: '300px', paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Loading specialties...</p>
                </div>
            ) : (
                <div className="hospital-list">
                    {filteredSpecialties.length === 0 && (
                        <div className="empty-state">
                            <p>
                                {searchTerm ? "No matches found." : "No specializations registered yet."}
                            </p>
                        </div>
                    )}
                    {filteredSpecialties.map((s) => (
                        <div key={s._id} className="dashboard-card registry-card">
                            <div className="registry-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <b>{adminLocalize(s.name)}</b>
                                    <span className={`status-pill ${s.active ? 'approved' : 'rejected'}`} style={{ fontSize: '0.65rem' }}>
                                        {s.active ? "• Active" : "• Disabled"}
                                    </span>
                                </div>
                                {s.description && (
                                    <div className="registry-desc">
                                        {adminLocalize(s.description)}
                                    </div>
                                )}
                            </div>

                            <div className="registry-actions">
                                <button
                                    className="dashboard-btn"
                                    style={{
                                        background: s.active ? '#fee2e2' : 'var(--accent-light)',
                                        color: s.active ? '#991b1b' : 'var(--accent-dark)',
                                        boxShadow: 'none',
                                        padding: '8px 16px',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => toggleStatus(s._id)}
                                >
                                    {s.active ? "🚫 Disable" : "✅ Enable"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
