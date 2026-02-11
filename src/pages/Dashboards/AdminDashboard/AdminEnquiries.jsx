import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [pas, setPas] = useState([]);

    useEffect(() => {
        fetchEnquiries();
        fetchPAs();
    }, []);

    const fetchEnquiries = async () => {
        const res = await api.get("/admin/enquiries");
        setEnquiries(res.data);
    };

    const fetchPAs = async () => {
        const res = await api.get("/admin/assistants");
        setPas(res.data);
    };

    const assignPA = async (enquiryId, paId) => {
        await api.post(`/admin/enquiries/${enquiryId}/assign-pa`, { paId });
        fetchEnquiries();
    };

    return (
        <>
            <h3>Consultation Requests</h3>

            {enquiries.length === 0 && <p>No enquiries yet</p>}

            {enquiries.map((e) => (
                <div key={e._id} className="dashboard-card">
                    <b>{e.patientName}</b>
                    <p>📞 {e.phone}</p>
                    <p>Preferred: {e.contactMode}</p>
                    <p>Source: {e.source === "homepage" ? "🏠 Homepage" : "🏥 Services"}</p>
                    {e.source === "homepage" ? (
                        <>
                            <p>📍 {e.city}, {e.country}</p>
                            <p>🩺 Medical Problem: {e.medicalProblem}</p>
                            <p>📅 Age/DOB: {e.ageOrDob}</p>
                        </>
                    ) : (
                        <>
                            <p>
                                {e.specialtyId?.name} → {e.surgeryId?.surgeryName}
                            </p>
                            <p>Doctor: {e.doctorId?.name}</p>
                        </>
                    )}

                    {e.status === "new" && (
                        <select
                            onChange={(ev) => assignPA(e._id, ev.target.value)}
                        >
                            <option value="">Assign PA</option>
                            {pas.map((pa) => (
                                <option key={pa._id} value={pa._id}>
                                    {pa.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {e.status !== "new" && (
                        <p>Status: {e.status}</p>
                    )}
                </div>
            ))}
        </>
    );
}
