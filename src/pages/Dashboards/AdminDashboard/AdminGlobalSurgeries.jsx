import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { adminLocalize } from "../../../utils/adminLocalize";

export default function AdminGlobalSurgeries() {
    const [surgeries, setSurgeries] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [specFilter, setSpecFilter] = useState("");
    const [form, setForm] = useState({
        surgeryName: "",
        specialization: "",
        duration: "",
        minimumCost: "",
        description: "",
    });

    const fetchSurgeries = async () => {
        try {
            const res = await api.get("/admin/global-surgeries");
            setSurgeries(res.data);
        } catch (err) {
            console.error("Fetch global surgeries failed", err);
        }
    };

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
        Promise.all([fetchSurgeries(), fetchSpecialties()])
            .finally(() => setLoading(false));
    }, []);

    const filteredSurgeries = surgeries.filter((s) => {
        const matchesSearch = adminLocalize(s.surgeryName).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = specFilter === "" || s.specialization?._id === specFilter;
        return matchesSearch && matchesSpec;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/admin/global-surgeries", form);
            setForm({
                surgeryName: "",
                specialization: "",
                duration: "",
                minimumCost: "",
                description: "",
            });
            fetchSurgeries();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add surgery");
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/admin/global-surgeries/${id}/status`);
            fetchSurgeries();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="admin-global-surgeries">
            <div className="view-header">
                <h3>🏥 Global Surgery Registry</h3>
                <p className="subtitle">Universal catalog for hospital-specific offerings across the network</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ADD FORM */}
            <div className="dashboard-card add-surgery-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--accent-light)', padding: '10px', borderRadius: '12px', fontSize: '1.25rem' }}>➕</div>
                    <h4 style={{ margin: 0 }}>Add Master Surgery</h4>
                </div>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>🩺 Surgery Name</label>
                            <input
                                className="modern-input"
                                placeholder="e.g. Total Hip Replacement"
                                value={form.surgeryName}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, surgeryName: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>🔬 Specialization</label>
                            <select
                                className="modern-select"
                                value={form.specialization}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, specialization: e.target.value })
                                }
                            >
                                <option value="">Select Specialization</option>
                                {specialties.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {adminLocalize(s.name)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>⏱️ Duration</label>
                            <input
                                className="modern-input"
                                placeholder="e.g. 2-3 Hours"
                                value={form.duration}
                                onChange={(e) =>
                                    setForm({ ...form, duration: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>💰 Base Cost (₹)</label>
                            <input
                                className="modern-input"
                                type="number"
                                placeholder="Minimum price"
                                value={form.minimumCost}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, minimumCost: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>📝 Registry Description</label>
                        <textarea
                            className="modern-textarea"
                            placeholder="Detailed description for the master catalog..."
                            value={form.description}
                            rows={3}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <button type="submit" className="dashboard-btn">
                        <span>🚀</span> Add to Registry
                    </button>
                </form>
            </div>

            {/* FILTERS */}
            <div className="view-header" style={{ marginTop: '4rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--accent-light)', padding: '8px', borderRadius: '10px', fontSize: '1.1rem' }}>📋</div>
                        <h4 style={{ margin: 0 }}>Master Catalog ({filteredSurgeries.length})</h4>
                    </div>
                    <div className="list-filters" style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search surgeries..."
                                className="modern-input"
                                style={{ width: '250px', paddingLeft: '40px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="modern-select"
                            style={{ width: '200px' }}
                            value={specFilter}
                            onChange={(e) => setSpecFilter(e.target.value)}
                        >
                            <option value="">All Specializations</option>
                            {specialties.map((s) => (
                                <option key={s._id} value={s._id}>{adminLocalize(s.name)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Loading registry...</p>
                </div>
            ) : (
                <div className="hospital-list">
                    {filteredSurgeries.length === 0 && (
                        <div className="empty-state">
                            <p>
                                {searchTerm || specFilter ? "No surgeries match your filters." : "No surgeries registered yet."}
                            </p>
                        </div>
                    )}
                    {filteredSurgeries.map((s) => (
                        <div key={s._id} className="dashboard-card registry-card">
                            <div className="registry-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <b>{adminLocalize(s.surgeryName)}</b>
                                    <span className={`status-pill ${s.active ? 'approved' : 'rejected'}`} style={{ fontSize: '0.65rem' }}>
                                        {s.active ? "• Active" : "• Disabled"}
                                    </span>
                                </div>
                                <div className="registry-meta">
                                    <span className="spec-pill">🔬 {adminLocalize(s.specialization?.name) || 'Unknown Specialty'}</span>
                                    <span className="cost-tag">₹ {s.minimumCost?.toLocaleString()}</span>
                                    {s.duration && <span className="spec-pill" style={{ background: '#fef3c7', color: '#92400e' }}>⏱️ {s.duration}</span>}
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
