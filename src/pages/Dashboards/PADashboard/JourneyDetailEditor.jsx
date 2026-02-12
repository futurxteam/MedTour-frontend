import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getJourneyById,
    addJourneyStage,
    updateJourneyStage,
    deleteJourneyStage,
    updateJourneyStatus,
    addMedicalRecord,
    getJourneyRecords,
} from "../../../api/api";
import "../../styles/Dashboard.css";
import "./JourneyDetailEditor.css";

export default function JourneyDetailEditor() {
    const { journeyId } = useParams();
    const navigate = useNavigate();
    const [journey, setJourney] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStageModal, setShowStageModal] = useState(false);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [stageForm, setStageForm] = useState({
        title: "",
        description: "",
        status: "pending",
        startDate: "",
        endDate: "",
        flightDetails: {
            flightNumber: "",
            departureTime: "",
            arrivalTime: "",
            airline: "",
        },
        notes: "",
        durationHours: "",
    });

    const [recordForm, setRecordForm] = useState({
        date: new Date().toISOString().split("T")[0],
        description: "",
        file: null,
    });

    useEffect(() => {
        fetchJourney();
    }, [journeyId]);

    const fetchJourney = async () => {
        try {
            const res = await getJourneyById(journeyId);
            setJourney(res.data);
            fetchRecords();
        } catch (err) {
            console.error("Failed to fetch journey", err);
            alert("Failed to load journey");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async () => {
        try {
            const res = await getJourneyRecords(journeyId);
            setRecords(res.data);
        } catch (err) {
            console.error("Failed to fetch records", err);
        }
    };

    const handleAddStage = () => {
        setEditingStage(null);
        setStageForm({
            title: "",
            description: "",
            status: "pending",
            startDate: "",
            endDate: "",
            flightDetails: {
                flightNumber: "",
                departureTime: "",
                arrivalTime: "",
                airline: "",
            },
            notes: "",
            durationHours: "",
        });
        setShowStageModal(true);
    };

    const handleEditStage = (stage) => {
        setEditingStage(stage);
        setStageForm({
            title: stage.title || "",
            description: stage.description || "",
            status: stage.status || "pending",
            startDate: stage.startDate ? stage.startDate.split("T")[0] : "",
            endDate: stage.endDate ? stage.endDate.split("T")[0] : "",
            flightDetails: stage.flightDetails || {
                flightNumber: "",
                departureTime: "",
                arrivalTime: "",
                airline: "",
            },
            notes: stage.notes || "",
            durationHours: stage.durationHours || "",
        });
        setShowStageModal(true);
    };

    const handleSaveStage = async () => {
        try {
            if (editingStage) {
                await updateJourneyStage(journeyId, editingStage._id, stageForm);
            } else {
                await addJourneyStage(journeyId, stageForm);
            }
            setShowStageModal(false);
            fetchJourney();
        } catch (err) {
            console.error("Failed to save stage", err);
            alert("Failed to save stage");
        }
    };

    const handleDeleteStage = async (stageId) => {
        if (!window.confirm("Are you sure you want to delete this stage?")) return;

        try {
            await deleteJourneyStage(journeyId, stageId);
            fetchJourney();
        } catch (err) {
            console.error("Failed to delete stage", err);
            alert("Failed to delete stage");
        }
    };

    const handleCompleteJourney = async () => {
        if (!window.confirm("Mark this journey as completed?")) return;

        try {
            await updateJourneyStatus(journeyId, "completed");
            alert("Journey marked as completed!");
            navigate("/dashboard/pa");
        } catch (err) {
            console.error("Failed to complete journey", err);
            alert("Failed to complete journey");
        }
    };

    const handleSaveRecord = async () => {
        if (!recordForm.file || !recordForm.description) {
            alert("Please provide description and file");
            return;
        }

        const formData = new FormData();
        formData.append("date", recordForm.date);
        formData.append("description", recordForm.description);
        formData.append("file", recordForm.file);

        try {
            await addMedicalRecord(journeyId, formData);
            setShowRecordModal(false);
            setRecordForm({
                date: new Date().toISOString().split("T")[0],
                description: "",
                file: null,
            });
            fetchRecords();
        } catch (err) {
            console.error("Failed to save record", err);
            alert("Failed to upload record");
        }
    };

    const handleFileChange = (e) => {
        setRecordForm({ ...recordForm, file: e.target.files[0] });
    };

    if (loading) return <div className="dashboard">Loading...</div>;
    if (!journey) return <div className="dashboard">Journey not found</div>;

    return (
        <div className="dashboard">
            <div className="dashboard-topbar">
                <button className="back-btn" onClick={() => navigate("/dashboard/pa")}>
                    ← Back to Dashboard
                </button>
                <h2>Manage Journey</h2>
            </div>

            <div className="journey-editor-container">
                <div className="journey-header-card clinical-card">
                    <div className="patient-header-main">
                        <div className="patient-info">
                            <h3>{journey.enquiryId?.patientName || "Patient"}</h3>
                            <p className="phone">📞 {journey.enquiryId?.phone}</p>

                        </div>
                        <div className="journey-summary-stats">
                            <div className="stat-pill">
                                📊 Progress: <strong>{journey.progressPercentage}%</strong>
                            </div>
                            <div className="stat-pill">
                                📅 Day: <strong>{journey.currentDay || 0} of {journey.totalDuration || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="action-btn add-stage-btn" onClick={handleAddStage}>
                            + Add New Stage
                        </button>
                        <button className="action-btn upload-record-btn" onClick={() => setShowRecordModal(true)}>
                            📄 Upload Record
                        </button>
                        {journey.status === "active" && (
                            <button className="action-btn success-btn" onClick={handleCompleteJourney}>
                                ✓ Complete Journey
                            </button>
                        )}
                    </div>
                </div>

                <div className="journey-dual-column">
                    <div className="stages-column">
                        <h4>📋 Clinical Workflow</h4>
                        <div className="stages-list">
                            {journey.stages && journey.stages.length === 0 && (
                                <p className="empty-msg">No stages yet. Click "Add New Stage" to begin.</p>
                            )}

                            {journey.stages &&
                                journey.stages.map((stage, index) => (
                                    <div key={stage._id} className={`stage-item stage-${stage.status}`}>
                                        <div className="stage-number">{index + 1}</div>
                                        <div className="stage-content">
                                            <div className="stage-header">
                                                <h5>{stage.title}</h5>
                                                <span className={`status-badge status-${stage.status}`}>
                                                    {stage.status}
                                                </span>
                                            </div>

                                            {stage.description && <p className="description">{stage.description}</p>}

                                            <div className="stage-dates">
                                                {stage.endDate && (
                                                    <span> ✅ {new Date(stage.endDate).toLocaleDateString()}</span>
                                                )}
                                                {stage.durationHours && !stage.endDate && (
                                                    <span className="duration-hours"> ⏱️ {stage.durationHours} hrs</span>
                                                )}
                                            </div>

                                            {stage.flightDetails?.flightNumber && (
                                                <div className="flight-info">
                                                    ✈️ {stage.flightDetails.airline} {stage.flightDetails.flightNumber}
                                                </div>
                                            )}

                                            {stage.notes && (
                                                <div className="stage-notes-clinical">📝 {stage.notes}</div>
                                            )}

                                            <div className="stage-actions-clinical">
                                                <button onClick={() => handleEditStage(stage)}>Edit</button>
                                                <button className="delete" onClick={() => handleDeleteStage(stage._id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="records-column">
                        <h4>📄 Medical Records</h4>
                        <div className="records-list">
                            {records.length === 0 && <p className="empty-msg">No medical records uploaded yet.</p>}
                            {records.map((record) => (
                                <div key={record._id} className="record-item">
                                    <div className="record-icon">📄</div>
                                    <div className="record-info">
                                        <div className="record-header">
                                            <h6>{record.description}</h6>
                                            <span className="record-date">{new Date(record.date).toLocaleDateString()}</span>
                                        </div>
                                        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-link">
                                            View {record.fileName?.split('.').pop()?.toUpperCase() || 'Attachment'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stage Modal */}
            {showStageModal && (
                <div className="modal-overlay" onClick={() => setShowStageModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingStage ? "Edit Stage" : "Add New Stage"}</h3>

                        <label>
                            Title *
                            <input
                                type="text"
                                value={stageForm.title}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, title: e.target.value })
                                }
                                required
                            />
                        </label>

                        <label>
                            Description
                            <textarea
                                value={stageForm.description}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, description: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            Status
                            <select
                                value={stageForm.status}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, status: e.target.value })
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>

                        <label>
                            Start Date
                            <input
                                type="date"
                                value={stageForm.startDate}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, startDate: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            End Date
                            <input
                                type="date"
                                value={stageForm.endDate}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, endDate: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            Stage Duration (Hours)
                            <input
                                type="number"
                                placeholder="e.g. 4"
                                value={stageForm.durationHours}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, durationHours: e.target.value })
                                }
                            />
                        </label>

                        <h4>Flight Details (Optional)</h4>

                        <label>
                            Flight Number
                            <input
                                type="text"
                                value={stageForm.flightDetails.flightNumber}
                                onChange={(e) =>
                                    setStageForm({
                                        ...stageForm,
                                        flightDetails: {
                                            ...stageForm.flightDetails,
                                            flightNumber: e.target.value,
                                        },
                                    })
                                }
                            />
                        </label>

                        <label>
                            Airline
                            <input
                                type="text"
                                value={stageForm.flightDetails.airline}
                                onChange={(e) =>
                                    setStageForm({
                                        ...stageForm,
                                        flightDetails: {
                                            ...stageForm.flightDetails,
                                            airline: e.target.value,
                                        },
                                    })
                                }
                            />
                        </label>

                        <label>
                            Notes (Visible to Patient)
                            <textarea
                                value={stageForm.notes}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, notes: e.target.value })
                                }
                            />
                        </label>

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleSaveStage}>
                                Save Stage
                            </button>
                            <button onClick={() => setShowStageModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Record Modal */}
            {showRecordModal && (
                <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Upload Medical Record</h3>

                        <label>
                            Date *
                            <input
                                type="date"
                                value={recordForm.date}
                                onChange={(e) =>
                                    setRecordForm({ ...recordForm, date: e.target.value })
                                }
                                required
                            />
                        </label>

                        <label>
                            Description *
                            <textarea
                                value={recordForm.description}
                                onChange={(e) =>
                                    setRecordForm({ ...recordForm, description: e.target.value })
                                }
                                placeholder="e.g., Blood Test Report, MRI Scan"
                                required
                            />
                        </label>

                        <label>
                            File *
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                        </label>

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleSaveRecord}>
                                Upload File
                            </button>
                            <button onClick={() => setShowRecordModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
