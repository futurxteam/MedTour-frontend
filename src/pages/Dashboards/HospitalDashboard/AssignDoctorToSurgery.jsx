import React, { useEffect, useState } from "react";
import {
    getHospitalDoctors,
    getHospitalSurgeries,
    updateDoctorSurgeries,
} from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function AssignDoctorToSurgery() {
    const [doctors, setDoctors] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDrList, setShowDrList] = useState(false);

    const [allSurgeries, setAllSurgeries] = useState([]);
    const [visibleSurgeries, setVisibleSurgeries] = useState([]);
    const [selectedSurgeries, setSelectedSurgeries] = useState([]);

    const [loading, setLoading] = useState(false);

    // Fetch Doctors & All Surgeries initially
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [docsRes, surgRes] = await Promise.all([
                    getHospitalDoctors(),
                    getHospitalSurgeries()
                ]);
                setDoctors(docsRes.data);
                setAllSurgeries(surgRes.data);
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // When doctor is selected, update visible list and selections
    useEffect(() => {
        if (!selectedDoctor) {
            setVisibleSurgeries([]);
            setSelectedSurgeries([]);
            return;
        }

        const doctorId = selectedDoctor._id || selectedDoctor.id;

        // 1. Determine checkboxes (What is ALREADY assigned?)
        //    Assuming `allSurgeries` contains `.assignedDoctors` array
        const alreadyAssigned = allSurgeries
            .filter(s => s.assignedDoctors?.some(d => (d._id || d) === doctorId))
            .map(s => s._id);
        setSelectedSurgeries(alreadyAssigned);

        // 2. Filter surgeries by doctor's specialization
        //    We need to match `s.specialization.name` with `doctor.specializations` (if names)
        //    OR `s.specialization._id` (if IDs)
        //    Based on previous observation of HospitalDoctors.jsx, `doctor.specializations` seems to be an array of Names (strings).

        const doctorSpecs = selectedDoctor.specializations || [];
        // Normalize for comparison (just in case)
        const normalizedSpecs = doctorSpecs.map(s => typeof s === 'string' ? s.toLowerCase() : s?.name?.toLowerCase());

        const compatible = allSurgeries.filter(s => {
            const specName = s.specialization?.name?.toLowerCase();
            if (!specName) return false;
            return normalizedSpecs.includes(specName);
        });

        // If no compatible surgeries found, maybe we should show ALL? 
        // Or if the doctor has no specialization listed?
        // Let's fallback to showing ALL if doctor has no specs, or just show compatible. 
        // Usually, strict filtering is better.
        setVisibleSurgeries(compatible.length > 0 ? compatible : []);

    }, [selectedDoctor, allSurgeries]);

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
        if (!selectedDoctor) return;

        try {
            const doctorId = selectedDoctor._id || selectedDoctor.id;
            await updateDoctorSurgeries(doctorId, selectedSurgeries);
            alert("Assignments updated successfully!");

            // Optionally refresh data to reflect changes in `allSurgeries` (if relying on local `assignedDoctors` state)
            // But we can just reset
            setSelectedDoctor(null);
            setDoctorSearch("");
        } catch (err) {
            console.error(err);
            alert("Failed to update assignments");
        }
    };

    return (
        <div className="hospital-content">
            <div className="page-head">
                <h3>Manage Doctor Assignments</h3>
            </div>

            <div className="form-section" style={{ minHeight: '400px' }}>
                {/* Doctor Search */}
                <div className="form-group" style={{ position: 'relative', zIndex: 100 }}>
                    <label>Select Doctor to Assign</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Doctor by Name..."
                        value={doctorSearch}
                        onChange={(e) => {
                            setDoctorSearch(e.target.value);
                            setShowDrList(true);
                            if (selectedDoctor && e.target.value !== selectedDoctor.name) {
                                setSelectedDoctor(null);
                            }
                        }}
                        onFocus={() => setShowDrList(true)}
                        onBlur={() => setTimeout(() => setShowDrList(false), 200)}
                    />

                    {showDrList && (
                        <ul className="custom-dropdown">
                            {filteredDoctors.length === 0 ? (
                                <li className="dropdown-item empty">No doctors found</li>
                            ) : (
                                filteredDoctors.map((doc) => (
                                    <li
                                        key={doc._id || doc.id}
                                        className="dropdown-item"
                                        onMouseDown={() => {
                                            setSelectedDoctor(doc);
                                            setDoctorSearch(doc.name);
                                            setShowDrList(false);
                                        }}
                                    >
                                        {doc.name}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>

                {selectedDoctor && (
                    <div className="alert-box" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <strong>Assigning to: {selectedDoctor.name}</strong>
                            <div className="text-muted" style={{ fontSize: '13px' }}>
                                Specializations: {selectedDoctor.specializations?.join(", ") || "None"}
                            </div>
                        </div>
                        <button className="btn btn-secondary" onClick={() => {
                            setSelectedDoctor(null);
                            setDoctorSearch("");
                        }}>
                            Change
                        </button>
                    </div>
                )}

                {/* Surgeries List Section */}
                {selectedDoctor && (
                    <div className="form-group" style={{ position: 'relative', zIndex: 1 }}>
                        <label>Select Surgeries (Compatible with Doctor's Specialization)</label>
                        {visibleSurgeries.length === 0 ? (
                            <div className="empty-state-small">
                                <p className="text-muted">No surgeries found matching this doctor's specialization.</p>
                                <p style={{ fontSize: '12px', color: '#999' }}>Ensure the doctor has specializations listed and surgeries are added under those categories.</p>
                            </div>
                        ) : (
                            <div className="card-grid" style={{ gap: '12px' }}>
                                {visibleSurgeries.map(s => (
                                    <label key={s._id} className={`checkbox-card ${selectedSurgeries.includes(s._id) ? 'active' : ''}`} style={{ alignItems: 'flex-start' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSurgeries.includes(s._id)}
                                            onChange={() => toggleSurgery(s._id)}
                                            style={{ marginTop: '4px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{s.surgeryName}</div>
                                            <div className="text-muted" style={{ fontSize: '12px' }}>
                                                {s.specialization?.name} • ₹{s.cost?.toLocaleString()}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                            <button className="btn btn-primary" onClick={handleAssign} disabled={visibleSurgeries.length === 0}>
                                Save Assignments
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    max-height: 250px;
                    overflow-y: auto;
                    z-index: 1000;
                    list-style: none;
                    padding: 0;
                    margin: 4px 0 0;
                }
                .dropdown-item {
                    padding: 10px 16px;
                    cursor: pointer;
                    transition: background 0.1s;
                    font-size: 14px;
                    border-bottom: 1px solid #f9fafb;
                }
                .dropdown-item:hover {
                    background: #f0f9ff;
                    color: var(--primary);
                }
                .dropdown-item.empty {
                    color: var(--text-muted);
                    cursor: default;
                }
                .checkbox-card {
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    cursor: pointer;
                    background: white;
                    transition: all 0.2s;
                }
                .checkbox-card:hover {
                    border-color: var(--primary);
                    background: #f0f9ff;
                }
                .checkbox-card.active {
                    background: #eff6ff;
                    border-color: var(--primary);
                }
                .empty-state-small {
                    padding: 30px;
                    text-align: center;
                    background: #f9fafb;
                    border-radius: var(--radius);
                    border: 1px dashed var(--border);
                }
            `}</style>
        </div>
    );
}