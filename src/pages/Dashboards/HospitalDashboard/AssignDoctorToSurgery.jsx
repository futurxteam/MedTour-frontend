import React, { useEffect, useState } from "react";
import {
    getHospitalDoctors,
    getSurgeriesByDoctor,
    updateDoctorSurgeries,
} from "../../../api/api";
import "../styles/HospitalDashboard.css";

export default function AssignDoctorToSurgery() {
    const [doctors, setDoctors] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [surgeries, setSurgeries] = useState([]);
    const [selectedSurgeries, setSelectedSurgeries] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* =========================
       FETCH DOCTORS
    ========================= */
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const res = await getHospitalDoctors();
                setDoctors(res.data);
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                setError("Failed to load doctors list");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    /* =========================
       FETCH SURGERIES BY DOCTOR
    ========================= */
    useEffect(() => {
        if (!selectedDoctor) {
            setSurgeries([]);
            setSelectedSurgeries([]);
            return;
        }

        const fetchSurgeries = async () => {
            try {
                const res = await getSurgeriesByDoctor(selectedDoctor.id);
                setSurgeries(res.data);

                // Identify surgeries the doctor is already assigned to
                const alreadyAssigned = res.data
                    .filter(s => s.assignedDoctors?.includes(selectedDoctor.id))
                    .map(s => s._id);
                setSelectedSurgeries(alreadyAssigned);
            } catch (err) {
                console.error("Failed to fetch surgeries:", err);
                setSurgeries([]);
            }
        };

        fetchSurgeries();
    }, [selectedDoctor]);

    const filteredDoctors = doctors.filter((d) =>
        d.name.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    const toggleSurgery = (surgeryId) => {
        setSelectedSurgeries(prev =>
            prev.includes(surgeryId)
                ? prev.filter(id => id !== surgeryId)
                : [...prev, surgeryId]
        );
    };

    const handleAssign = async () => {
        if (!selectedDoctor) {
            alert("Select a doctor first");
            return;
        }

        try {
            const res = await updateDoctorSurgeries(selectedDoctor.id, selectedSurgeries);
            alert(res.data.message || "Assignments updated successfully");
        } catch (err) {
            console.error("Assignment failed:", err);
            const msg = err.response?.data?.message || err.response?.data?.error || err.message;
            alert("Failed: " + msg);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Manage Doctor Assignments</h2>

            {loading && <p>Loading doctors...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* ===== Doctor Search ===== */}
            <div className="dropdown-container">
                <input
                    type="text"
                    placeholder="Search doctor"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                />

                {doctorSearch && !selectedDoctor && (
                    <ul className="dropdown-list">
                        {filteredDoctors.length === 0 ? (
                            <li className="dropdown-empty">No doctors found</li>
                        ) : (
                            filteredDoctors.map((doc) => (
                                <li
                                    key={doc.id || doc._id}
                                    onClick={() => {
                                        setSelectedDoctor(doc);
                                        setDoctorSearch(doc.name);
                                    }}
                                >
                                    {doc.name}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            {/* ===== Selected Doctor Info ===== */}
            {selectedDoctor && (
                <div style={{ marginTop: "10px", color: "#666" }}>
                    Selected: <strong>{selectedDoctor.name}</strong>
                    <button
                        style={{ marginLeft: "10px", padding: "2px 5px", fontSize: "0.8rem" }}
                        onClick={() => {
                            setSelectedDoctor(null);
                            setDoctorSearch("");
                        }}
                    >
                        Change
                    </button>
                    <div style={{ fontSize: "0.85rem" }}>
                        Specializations: {selectedDoctor.specializations?.join(", ") || "None"}
                    </div>
                </div>
            )}

            {/* ===== Surgery Selection (Checkboxes) ===== */}
            {selectedDoctor && (
                <div style={{ marginTop: "20px" }}>
                    <h4>Select Surgeries</h4>

                    {surgeries.length === 0 ? (
                        <p style={{ color: "#999" }}>No active surgeries found for this doctor's specialization(s).</p>
                    ) : (
                        <div style={{
                            background: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            maxHeight: "300px",
                            overflowY: "auto"
                        }}>
                            {surgeries.map((s) => (
                                <div key={s._id} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                                    <input
                                        type="checkbox"
                                        id={s._id}
                                        checked={selectedSurgeries.includes(s._id)}
                                        onChange={() => toggleSurgery(s._id)}
                                        style={{ marginRight: "10px" }}
                                    />
                                    <label htmlFor={s._id} style={{ cursor: "pointer" }}>
                                        {s.surgeryName}
                                        <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "8px" }}>
                                            ({s.specialization?.name})
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===== Save Button ===== */}
            {selectedDoctor && (
                <button
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#4b6cb7",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                    onClick={handleAssign}
                    disabled={surgeries.length === 0}
                >
                    Update Assignments
                </button>
            )}
        </div>
    );
}