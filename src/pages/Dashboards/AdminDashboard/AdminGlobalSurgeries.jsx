import React, { useEffect, useState } from "react";
import api from "@/api/api";

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
        const matchesSearch = s.surgeryName.toLowerCase().includes(searchTerm.toLowerCase());
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
                <h3>Global Surgery Registry</h3>
                <p className="subtitle">Universal catalog for hospital-specific offerings</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ADD FORM */}
            <div className="dashboard-card add-surgery-card">
                <h4>Add Master Surgery</h4>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Surgery Name</label>
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
                            <label>Specialization</label>
                            <select
                                className="modern-input"
                                value={form.specialization}
                                required
                                onChange={(e) =>
                                    setForm({ ...form, specialization: e.target.value })
                                }
                            >
                                <option value="">Select Specialization</option>
                                {specialties.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duration</label>
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
                            <label>Base Cost (₹)</label>
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
                        <label>Registry Description</label>
                        <textarea
                            className="modern-input"
                            placeholder="Detailed description for the master catalog..."
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <button type="submit" className="dashboard-btn">Add to Registry</button>
                </form>
            </div>

            {/* FILTERS */}
            <div className="view-header" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Master Catalog ({filteredSurgeries.length})</h4>
                    <div className="list-filters" style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Search surgeries..."
                            className="modern-input"
                            style={{ width: '250px', padding: '8px 15px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="modern-input"
                            style={{ width: '200px', padding: '8px 15px' }}
                            value={specFilter}
                            onChange={(e) => setSpecFilter(e.target.value)}
                        >
                            <option value="">All Specializations</option>
                            {specialties.map((s) => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading registry...</p>
            ) : (
                <div className="hospital-list">
                    {filteredSurgeries.length === 0 && (
                        <p className="empty-state">
                            {searchTerm || specFilter ? "No surgeries match your filters." : "No surgeries registered yet."}
                        </p>
                    )}
                    {filteredSurgeries.map((s) => (
                        <div key={s._id} className="dashboard-card registry-card">
                            <div className="registry-info">
                                <b>{s.surgeryName}</b>
                                <div className="registry-meta">
                                    <span className="spec-pill">{s.specialization?.name || 'Unknown Specialty'}</span>
                                    <span className="cost-tag">Min: ₹{s.minimumCost}</span>
                                </div>
                                <p className="registry-desc">{s.description}</p>
                            </div>

                            <div className="registry-actions">
                                <span className={`status-pill ${s.active ? 'approved' : 'rejected'}`}>
                                    {s.active ? "Active" : "Disabled"}
                                </span>
                                <button
                                    className="secondary-btn"
                                    onClick={() => toggleStatus(s._id)}
                                >
                                    {s.active ? "Disable" : "Enable"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
