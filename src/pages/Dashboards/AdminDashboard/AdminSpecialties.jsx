import React, { useEffect, useState } from "react";
import api from "@/api/api";

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
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h3>Medical Specializations</h3>
                <p className="subtitle">Master list of clinical departments</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ADD FORM */}
            <div className="dashboard-card add-surgery-card">
                <h4>Add New Specialization</h4>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-grid">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Specialization Name</label>
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
                        <label>Description (Optional)</label>
                        <textarea
                            className="modern-input"
                            placeholder="Brief description of the specialization..."
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <button type="submit" className="dashboard-btn">Save Specialization</button>
                </form>
            </div>

            {/* FILTERS & LIST */}
            <div className="view-header" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Current Specializations ({filteredSpecialties.length})</h4>
                    <input
                        type="text"
                        placeholder="Search specializations..."
                        className="modern-input"
                        style={{ width: '300px', padding: '8px 15px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading registry...</p>
            ) : (
                <div className="hospital-list">
                    {filteredSpecialties.length === 0 && (
                        <p className="empty-state">
                            {searchTerm ? "No matches found." : "No specializations registered yet."}
                        </p>
                    )}
                    {filteredSpecialties.map((s) => (
                        <div key={s._id} className="dashboard-card registry-card">
                            <div className="registry-info">
                                <b>{s.name}</b>
                                <p className="registry-desc" style={{ marginTop: '8px' }}>
                                    {s.description || "No description provided."}
                                </p>
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
