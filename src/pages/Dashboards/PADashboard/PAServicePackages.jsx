import React, { useEffect, useState } from "react";
import {
    assistantGetServicePackages,
    assistantAddPackage,
    assistantRemovePackage,
} from "@/api/api";
import "./PAServicePackages.css";

export default function PAServicePackages({ enquiry, onEnquiryUpdate }) {
    const [availablePackages, setAvailablePackages] = useState([]);
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [packageNotes, setPackageNotes] = useState(enquiry?.packageNotes || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const attachedPackages = enquiry?.servicePackages || [];

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await assistantGetServicePackages();
                setAvailablePackages(res.data);
            } catch (err) {
                console.error("Failed to load service packages", err);
            }
        };
        fetchPackages();
    }, []);

    // Filter out already-attached packages from the dropdown
    const attachedIds = attachedPackages.map((p) =>
        typeof p === "object" ? p._id : p
    );
    const unattachedPackages = availablePackages.filter(
        (p) => !attachedIds.includes(p._id)
    );

    const handleAdd = async () => {
        if (!selectedPackageId) return;
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await assistantAddPackage(enquiry._id, selectedPackageId, packageNotes);
            setSuccess("✅ Package added successfully!");
            setSelectedPackageId("");
            onEnquiryUpdate(res.data.enquiry);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add package");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (packageId) => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await assistantRemovePackage(enquiry._id, packageId);
            setSuccess("Package removed.");
            onEnquiryUpdate(res.data.enquiry);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove package");
        } finally {
            setLoading(false);
        }
    };

    const totalCost = attachedPackages.reduce((sum, p) => {
        const price = typeof p === "object" ? p.price : 0;
        return sum + price;
    }, 0);

    const getCurrency = () => {
        const first = attachedPackages.find((p) => typeof p === "object" && p.currency);
        return first?.currency || "USD";
    };

    return (
        <div className="pa-service-packages">
            <div className="pkg-section-header">
                <span className="pkg-icon">📦</span>
                <h4>Service Packages</h4>
            </div>

            {/* Feedback */}
            {error && <div className="pkg-alert pkg-alert--error">{error}</div>}
            {success && <div className="pkg-alert pkg-alert--success">{success}</div>}

            {/* ── Attached Packages ── */}
            {attachedPackages.length > 0 ? (
                <div className="pkg-attached-list">
                    {attachedPackages.map((pkg) => {
                        if (typeof pkg !== "object") return null;
                        return (
                            <div key={pkg._id} className="pkg-attached-item">
                                <div className="pkg-item-left">
                                    <span className="pkg-type-icon">
                                        {pkg.type === "translator" ? "🗣️" : "🧳"}
                                    </span>
                                    <div className="pkg-item-info">
                                        <strong>{pkg.name}</strong>
                                        <span className="pkg-item-sub">
                                            {pkg.type === "translator"
                                                ? `Language: ${pkg.language}`
                                                : `📍 ${pkg.place}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="pkg-item-right">
                                    <span className="pkg-price">
                                        {pkg.currency} {Number(pkg.price).toLocaleString()}
                                    </span>
                                    <button
                                        className="pkg-remove-btn"
                                        onClick={() => handleRemove(pkg._id)}
                                        disabled={loading}
                                        title="Remove package"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Total */}
                    <div className="pkg-total-row">
                        <span>Total Package Cost</span>
                        <strong>
                            {getCurrency()} {totalCost.toLocaleString()}
                        </strong>
                    </div>
                </div>
            ) : (
                <div className="pkg-empty">
                    <p>No service packages attached yet.</p>
                </div>
            )}

            {/* ── Add Package ── */}
            <div className="pkg-add-section">
                <h5>Add a Package</h5>
                <div className="pkg-add-row">
                    <select
                        className="pkg-select"
                        value={selectedPackageId}
                        onChange={(e) => setSelectedPackageId(e.target.value)}
                    >
                        <option value="">-- Select a package --</option>
                        {unattachedPackages.length === 0 && (
                            <option disabled>No more packages available</option>
                        )}
                        {unattachedPackages.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.type === "translator" ? "🗣️" : "🧳"} {p.name} —{" "}
                                {p.currency} {Number(p.price).toLocaleString()}
                            </option>
                        ))}
                    </select>
                    <button
                        className="pkg-add-btn"
                        onClick={handleAdd}
                        disabled={!selectedPackageId || loading}
                    >
                        {loading ? "Adding…" : "Add"}
                    </button>
                </div>

                {/* Package Notes */}
                <div className="pkg-notes-row">
                    <label>Package Notes (optional)</label>
                    <textarea
                        className="pkg-notes-input"
                        placeholder="e.g. Patient prefers Arabic translator for all appointments..."
                        value={packageNotes}
                        onChange={(e) => setPackageNotes(e.target.value)}
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}
