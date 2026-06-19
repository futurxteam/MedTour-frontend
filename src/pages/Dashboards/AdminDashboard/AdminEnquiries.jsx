import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { adminLocalize } from "../../../utils/adminLocalize";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [pas, setPas] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEnquiries();
    }, [page]);

    useEffect(() => {
        fetchPAs();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/enquiries?page=${page}&limit=5`);
            setEnquiries(res.data.enquiries);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPAs = async () => {
        try {
            const res = await api.get("/admin/assistants");
            setPas(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const assignPA = async (enquiryId, paId) => {
        if (!paId) return;

        const pa = pas.find(p => p._id === paId);
        const confirmResult = window.confirm(`Are you sure you want to assign ${pa?.name} to this enquiry?`);

        if (confirmResult) {
            try {
                await api.post(`/admin/enquiries/${enquiryId}/assign-pa`, { paId });
                fetchEnquiries();
            } catch (err) {
                alert("Failed to assign assistant");
            }
        }
    };

    return (
        <div className="admin-enquiries-container">
            <div className="view-header">
                <div>
                    <h3>📑 Consultation Requests</h3>
                    <p className="subtitle">Manage incoming patient enquiries and assistant assignments</p>
                </div>
                <div className="stats-header">
                    <div className="mini-stat">Total: <strong>{enquiries.length}</strong></div>
                </div>
            </div>

            {loading && <p className="loading-msg">Refreshing records...</p>}

            {!loading && enquiries.length === 0 && (
                <div className="empty-state">
                    <p>No enquiries yet. They will appear here when patients contact us.</p>
                </div>
            )}

            <div className="enquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {enquiries.map((e) => (
                    <div key={e._id} className="dashboard-card registry-card" style={{ alignItems: 'stretch' }}>
                        <div className="registry-info" style={{ flex: '1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <b style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{adminLocalize(e.patientName)}</b>
                                <span className={`status-pill ${e.status}`} style={{ fontSize: '0.7rem' }}>
                                    • {e.status.toUpperCase()}
                                </span>
                                <span className="spec-pill" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                                    {e.source === "homepage" ? "🏠 Homepage Lead" : e.source === "hospital_enquiry" ? "🏥 Hospital Enquiry" : "🩺 Services Lead"}
                                </span>
                                {e.source === "hospital_enquiry" && e.hospitalProfileId && (
                                    <span className="spec-pill" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
                                        🏥 {adminLocalize(e.hospitalProfileId.hospitalName)}
                                    </span>
                                )}
                            </div>

                            <p style={{ marginTop: '12px', color: 'var(--accent-dark)', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📞</span> {e.phone}
                            </p>

                            <div className="registry-desc" style={{ marginTop: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', padding: '20px', borderRadius: '16px' }}>
                                {(e.source === "homepage" || e.source === "hospital_enquiry") ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                        {e.source === "hospital_enquiry" && e.hospitalProfileId && (
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label className="field-label">Hospital of Interest</label>
                                                <p style={{ margin: 0, fontWeight: '700', color: 'var(--accent-dark)', fontSize: '1.05rem' }}>
                                                    🏥 {adminLocalize(e.hospitalProfileId.hospitalName)}{adminLocalize(e.hospitalProfileId.city) ? `, ${adminLocalize(e.hospitalProfileId.city)}` : ''}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="field-label">Location</label>
                                            <p style={{ margin: 0, fontWeight: '600' }}>📍 {e.city || '—'}, {e.country || '—'}</p>
                                        </div>
                                        <div>
                                            <label className="field-label">Age/DOB</label>
                                            <p style={{ margin: 0, fontWeight: '600' }}>📅 {e.ageOrDob || '—'}</p>
                                        </div>
                                        {e.medicalProblem && (
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label className="field-label">Medical Problem</label>
                                                <p style={{ margin: 0, fontWeight: '500', lineHeight: '1.5' }}>🩺 {e.medicalProblem}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="field-label">Requested Surgery</label>
                                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--accent-dark)', fontSize: '1.05rem' }}>
                                                💉 {adminLocalize(e.specialtyId?.name)} → {adminLocalize(e.surgeryId?.surgeryName)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="field-label">Assigned Doctor</label>
                                            <p style={{ margin: 0, fontWeight: '600' }}>👨‍⚕️ {adminLocalize(e.doctorId?.name)}</p>
                                        </div>
                                        {e.consultationDate && (
                                            <div>
                                                <label className="field-label">Consultation Date</label>
                                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--accent)' }}>
                                                    📅 {new Date(e.consultationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="registry-actions" style={{ minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--border-soft)', paddingLeft: '24px', marginLeft: '24px' }}>
                            {e.status === "new" ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <label className="field-label" style={{ marginBottom: '12px' }}>Quick Assign Assistant</label>
                                    <select
                                        className="modern-select"
                                        onChange={(ev) => assignPA(e._id, ev.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>👤 Select Assistant...</option>
                                        {pas.map((pa) => (
                                            <option key={pa._id} value={pa._id}>
                                                {adminLocalize(pa.name)}
                                            </option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
                                        Assignment will notify the assistant and update the enquiry status.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                                    <div className="status-group">
                                        <label className="field-label">Current Phase</label>
                                        <div style={{ display: 'flex' }}>
                                            <span className={`status-pill ${e.status}`} style={{ background: 'white', border: '1px solid var(--border-soft)' }}>
                                                {e.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {e.assignedPA && (
                                        <div className="assistant-group">
                                            <label className="field-label">Assigned To</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(13, 148, 136, 0.1)' }}>
                                                <div style={{ width: '32px', height: '32px', background: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                                                    {adminLocalize(e.assignedPA.name)?.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: '700', color: 'var(--accent-dark)' }}>{adminLocalize(e.assignedPA.name)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span style={{ margin: '0 16px', fontWeight: '700', color: 'var(--text-muted)' }}>{page} of {totalPages}</span>
                    <button
                        className="pagination-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
