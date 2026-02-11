import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getJourneyById,
    addJourneyStage,
    updateJourneyStage,
    deleteJourneyStage,
    updateJourneyStatus,
} from "../../../api/api";
import "../../styles/Dashboard.css";
import "./JourneyDetailEditor.css";

export default function JourneyDetailEditor() {
    const { journeyId } = useParams();
    const navigate = useNavigate();
    const [journey, setJourney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStageModal, setShowStageModal] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [stageForm, setStageForm] = useState({
        title: "",
        description: "",
        status: "pending",
        startDate: "",
        endDate: "",
        estimatedDate: "",
        flightDetails: {
            flightNumber: "",
            departureTime: "",
            arrivalTime: "",
            airline: "",
        },
        notes: "",
    });

    useEffect(() => {
        fetchJourney();
    }, [journeyId]);

    const fetchJourney = async () => {
        try {
            const res = await getJourneyById(journeyId);
            setJourney(res.data);
        } catch (err) {
            console.error("Failed to fetch journey", err);
            alert("Failed to load journey");
        } finally {
            setLoading(false);
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
            estimatedDate: "",
            flightDetails: {
                flightNumber: "",
                departureTime: "",
                arrivalTime: "",
                airline: "",
            },
            notes: "",
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
            estimatedDate: stage.estimatedDate
                ? stage.estimatedDate.split("T")[0]
                : "",
            flightDetails: stage.flightDetails || {
                flightNumber: "",
                departureTime: "",
                arrivalTime: "",
                airline: "",
            },
            notes: stage.notes || "",
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
                <div className="journey-header-card">
                    <h3>{journey.enquiryId?.patientName || "Patient"}</h3>
                    <p>📞 {journey.enquiryId?.phone}</p>
                    <p>📊 Progress: {journey.progressPercentage}%</p>
                    <p>⏱️ Total Duration: {journey.totalDuration} days</p>
                    <button className="btn-primary" onClick={handleAddStage}>
                        + Add New Stage
                    </button>
                    {journey.status === "active" && (
                        <button className="btn-success" onClick={handleCompleteJourney}>
                            ✓ Complete Journey
                        </button>
                    )}
                </div>

                <div className="stages-list">
                    <h4>Journey Stages</h4>
                    {journey.stages && journey.stages.length === 0 && (
                        <p>No stages yet. Click "Add New Stage" to begin.</p>
                    )}

                    {journey.stages &&
                        journey.stages.map((stage, index) => (
                            <div key={stage._id} className={`stage-item stage-${stage.status}`}>
                                <div className="stage-number">{index + 1}</div>
                                <div className="stage-content">
                                    <div className="stage-header">
                                        <h5>{stage.title}</h5>
                                        <span className={`status-badge ${stage.status}`}>
                                            {stage.status}
                                        </span>
                                    </div>

                                    {stage.description && <p>{stage.description}</p>}

                                    <div className="stage-dates">
                                        {stage.startDate && (
                                            <span>Start: {new Date(stage.startDate).toLocaleDateString()}</span>
                                        )}
                                        {stage.endDate && (
                                            <span>End: {new Date(stage.endDate).toLocaleDateString()}</span>
                                        )}
                                        {stage.estimatedDate && (
                                            <span>
                                                Est: {new Date(stage.estimatedDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {stage.flightDetails?.flightNumber && (
                                        <div className="flight-info">
                                            ✈️ {stage.flightDetails.airline} {stage.flightDetails.flightNumber}
                                        </div>
                                    )}

                                    {stage.notes && (
                                        <div className="stage-notes">📝 {stage.notes}</div>
                                    )}

                                    <div className="stage-actions">
                                        <button onClick={() => handleEditStage(stage)}>Edit</button>
                                        <button onClick={() => handleDeleteStage(stage._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            Estimated Date
                            <input
                                type="date"
                                value={stageForm.estimatedDate}
                                onChange={(e) =>
                                    setStageForm({ ...stageForm, estimatedDate: e.target.value })
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
        </div>
    );
}
