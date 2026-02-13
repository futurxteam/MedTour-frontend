import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [pas, setPas] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchEnquiries();
    }, [page]);

    useEffect(() => {
        fetchPAs();
    }, []);

    const fetchEnquiries = async () => {
        const res = await api.get(`/admin/enquiries?page=${page}&limit=5`);
        setEnquiries(res.data.enquiries);
        setTotalPages(res.data.pagination.totalPages);
    };

    const fetchPAs = async () => {
        const res = await api.get("/admin/assistants");
        setPas(res.data);
    };

    const assignPA = async (enquiryId, paId) => {
        if (!paId) return;

        const pa = pas.find(p => p._id === paId);
        const confirmResult = window.confirm(`Are you sure you want to assign ${pa?.name} to this enquiry?`);

        if (confirmResult) {
            await api.post(`/admin/enquiries/${enquiryId}/assign-pa`, { paId });
            fetchEnquiries();
        }
    };

    return (
        <div className="admin-enquiries-container">
            <h3>Consultation Requests</h3>

            {enquiries.length === 0 && <p>No enquiries yet</p>}

            <div className="enquiries-group">
                {enquiries.map((e) => (
                    <div key={e._id} className="dashboard-card enquiry-card">
                        <div className="enquiry-main">
                            <b>{e.patientName}</b>
                            <p className="phone">📞 {e.phone}</p>
                            <p className="meta">Source: {e.source === "homepage" ? "🏠 Homepage" : "🏥 Services"}</p>

                            {e.source === "homepage" ? (
                                <div className="homepage-details">
                                    <p>📍 {e.city}, {e.country}</p>
                                    <p>🩺 Medical Problem: {e.medicalProblem}</p>
                                    <p>📅 Age/DOB: {e.ageOrDob}</p>
                                </div>
                            ) : (
                                <div className="services-details">
                                    <p className="service-path">
                                        {e.specialtyId?.name} → {e.surgeryId?.surgeryName}
                                    </p>
                                    <p>Doctor: {e.doctorId?.name}</p>
                                    {e.consultationDate && (
                                        <p className="consult-date">
                                            📅 Consultation: <strong>{new Date(e.consultationDate).toLocaleDateString()}</strong>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="enquiry-actions">
                            {e.status === "new" ? (
                                <div className="assign-form">
                                    <label className="field-label">Quick Assign Assistant</label>
                                    <select
                                        className="pa-select"
                                        onChange={(ev) => assignPA(e._id, ev.target.value)}
                                    >
                                        <option value="">Select Assistant...</option>
                                        {pas.map((pa) => (
                                            <option key={pa._id} value={pa._id}>
                                                {pa.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="assignment-info">
                                    <div className="info-row">
                                        <span className="label">Current Status</span>
                                        <span className={`status-pill ${e.status}`}>{e.status}</span>
                                    </div>
                                    {e.assignedPA && (
                                        <div className="info-row">
                                            <span className="label">Assigned Assistant</span>
                                            <span className="value">👤 {e.assignedPA.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

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
