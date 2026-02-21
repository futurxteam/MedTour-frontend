import React, { useEffect, useState } from "react";
import {
    adminCreateServicePackage,
    adminListServicePackages,
    adminToggleServicePackage,
} from "@/api/api";

const INITIAL_FORM = {
    name: "",
    type: "translator",
    language: "english",
    place: "",
    description: "",
    price: "",
    currency: "USD",
};

export default function AdminServicePackages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState(INITIAL_FORM);
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await adminListServicePackages();
            setPackages(res.data);
        } catch (err) {
            console.error("Fetch service packages failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await adminCreateServicePackage({
                name: form.name,
                type: form.type,
                language: form.type === "translator" ? form.language : undefined,
                place: form.type === "tourism" ? form.place : undefined,
                description: form.description,
                price: parseFloat(form.price),
                currency: form.currency,
            });
            setSuccess("✅ Package created successfully!");
            setForm(INITIAL_FORM);
            fetchPackages();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create package");
        }
    };

    const handleToggle = async (id) => {
        try {
            await adminToggleServicePackage(id);
            fetchPackages();
        } catch {
            alert("Failed to toggle package status");
        }
    };

    const filtered = packages.filter((p) => {
        const matchType = typeFilter === "all" || p.type === typeFilter;
        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && p.active) ||
            (statusFilter === "inactive" && !p.active);
        return matchType && matchStatus;
    });

    return (
        <div className="admin-global-surgeries">
            {/* ── Header ── */}
            <div className="view-header">
                <h3>📦 Service Packages</h3>
                <p className="subtitle">
                    Manage translator and tourism add-on packages for patient journeys
                </p>
            </div>

            {/* ── Feedback ── */}
            {error && <div className="error-banner">{error}</div>}
            {success && (
                <div
                    className="error-banner"
                    style={{ background: "rgba(34,197,94,0.15)", borderColor: "#22c55e", color: "#16a34a" }}
                >
                    {success}
                </div>
            )}

            {/* ── Create Form ── */}
            <div className="dashboard-card add-surgery-card">
                <h4>Create New Package</h4>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-grid">
                        {/* Package Name */}
                        <div className="form-group">
                            <label>Package Name</label>
                            <input
                                className="modern-input"
                                name="name"
                                placeholder="e.g. Arabic Translator – Kochi"
                                value={form.name}
                                required
                                onChange={handleFormChange}
                            />
                        </div>

                        {/* Package Type */}
                        <div className="form-group">
                            <label>Package Type</label>
                            <select
                                className="modern-input"
                                name="type"
                                value={form.type}
                                onChange={handleFormChange}
                            >
                                <option value="translator">🗣️ Translator</option>
                                <option value="tourism">🧳 Tourism Destination</option>
                            </select>
                        </div>

                        {/* Translator: Language */}
                        {form.type === "translator" && (
                            <div className="form-group">
                                <label>Language</label>
                                <select
                                    className="modern-input"
                                    name="language"
                                    value={form.language}
                                    onChange={handleFormChange}
                                >
                                    <option value="english">🇬🇧 English</option>
                                    <option value="arabic">🇸🇦 Arabic</option>
                                </select>
                            </div>
                        )}

                        {/* Tourism: Place */}
                        {form.type === "tourism" && (
                            <div className="form-group">
                                <label>Place / Destination</label>
                                <input
                                    className="modern-input"
                                    name="place"
                                    placeholder="e.g. Alleppey Backwaters"
                                    value={form.place}
                                    required={form.type === "tourism"}
                                    onChange={handleFormChange}
                                />
                            </div>
                        )}

                        {/* Price */}
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                className="modern-input"
                                name="price"
                                type="number"
                                min="0"
                                placeholder="0.00"
                                value={form.price}
                                required
                                onChange={handleFormChange}
                            />
                        </div>

                        {/* Currency */}
                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                className="modern-input"
                                name="currency"
                                value={form.currency}
                                onChange={handleFormChange}
                            >
                                <option value="USD">USD $</option>
                                <option value="INR">INR ₹</option>
                                <option value="AED">AED د.إ</option>
                                <option value="EUR">EUR €</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group full-width" style={{ marginTop: "1rem" }}>
                        <label>Description</label>
                        <textarea
                            className="modern-input"
                            name="description"
                            placeholder="Brief description of what this package includes..."
                            value={form.description}
                            onChange={handleFormChange}
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="dashboard-btn" style={{ marginTop: "1rem" }}>
                        ➕ Create Package
                    </button>
                </form>
            </div>

            {/* ── Filters ── */}
            <div
                className="view-header"
                style={{ marginTop: "3rem", marginBottom: "1.5rem" }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <h4>All Packages ({filtered.length})</h4>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <select
                            className="modern-input"
                            style={{ width: "180px", padding: "8px 14px" }}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="translator">🗣️ Translator</option>
                            <option value="tourism">🧳 Tourism</option>
                        </select>
                        <select
                            className="modern-input"
                            style={{ width: "160px", padding: "8px 14px" }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Package List ── */}
            {loading ? (
                <p className="loading-msg">Loading packages...</p>
            ) : (
                <div className="hospital-list">
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <p>No packages found. Create your first one above.</p>
                        </div>
                    )}

                    {filtered.map((pkg) => (
                        <div key={pkg._id} className="dashboard-card registry-card">
                            <div className="registry-info">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "1.4rem" }}>
                                        {pkg.type === "translator" ? "🗣️" : "🧳"}
                                    </span>
                                    <b style={{ fontSize: "1.05rem" }}>{pkg.name}</b>
                                </div>

                                <div className="registry-meta" style={{ marginTop: "0.5rem" }}>
                                    <span
                                        className="spec-pill"
                                        style={{
                                            background:
                                                pkg.type === "translator"
                                                    ? "rgba(99,102,241,0.15)"
                                                    : "rgba(245,158,11,0.15)",
                                            color:
                                                pkg.type === "translator" ? "#6366f1" : "#d97706",
                                        }}
                                    >
                                        {pkg.type === "translator"
                                            ? `🗣️ ${pkg.language?.charAt(0).toUpperCase() + pkg.language?.slice(1)}`
                                            : `📍 ${pkg.place}`}
                                    </span>

                                    <span className="cost-tag">
                                        {pkg.currency} {Number(pkg.price).toLocaleString()}
                                    </span>
                                </div>

                                {pkg.description && (
                                    <p className="registry-desc" style={{ marginTop: "0.4rem" }}>
                                        {pkg.description}
                                    </p>
                                )}
                            </div>

                            <div className="registry-actions">
                                <span
                                    className={`status-pill ${pkg.active ? "approved" : "rejected"}`}
                                >
                                    {pkg.active ? "Active" : "Inactive"}
                                </span>
                                <button
                                    className="secondary-btn"
                                    onClick={() => handleToggle(pkg._id)}
                                >
                                    {pkg.active ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
