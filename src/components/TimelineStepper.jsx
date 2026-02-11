import React from "react";
import "./TimelineStepper.css";

export default function TimelineStepper({ stages, currentStageIndex }) {
    if (!stages || stages.length === 0) {
        return <p>No stages available</p>;
    }

    const getStageStatus = (index, stage) => {
        if (stage.status === "completed") return "completed";
        if (index === currentStageIndex || stage.status === "in-progress") return "active";
        return "pending";
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;

        // Calculate hours
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        // If less than 24 hours, show in hours
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }

        // Otherwise show in days
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    return (
        <div className="vertical-stepper">
            {stages.map((stage, index) => {
                const status = getStageStatus(index, stage);

                return (
                    <div key={stage._id || index} className={`stepper-step ${status}`}>
                        {/* Step Number Circle */}
                        <div className="step-indicator">
                            <div className="step-circle">
                                {status === "completed" ? (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <span className="step-number">{index + 1}</span>
                                )}
                            </div>
                            {/* Connector Line */}
                            {index < stages.length - 1 && <div className="step-line"></div>}
                        </div>

                        {/* Step Content */}
                        <div className="step-content">
                            <div className="step-title">{stage.title}</div>
                            {stage.description && (
                                <div className="step-description">{stage.description}</div>
                            )}

                            {/* Status and Dates */}
                            <div className="step-meta">
                                {status === "completed" && stage.endDate && (
                                    <div className="step-date completed-date">
                                        ✅ Completed: {new Date(stage.endDate).toLocaleDateString()}
                                    </div>
                                )}

                                {status === "active" && (
                                    <div className="step-date active-date">
                                        🔄 In Progress
                                        {stage.startDate && (
                                            <span> - Started: {new Date(stage.startDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                )}

                                {status === "pending" && stage.estimatedDate && (
                                    <div className="step-date pending-date">
                                        ⏳ Estimated: {new Date(stage.estimatedDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            {/* Additional Details */}
                            {stage.flightDetails?.flightNumber && (
                                <div className="flight-details">
                                    <div className="flight-header">✈️ Flight Information</div>
                                    <div className="flight-info">
                                        <div><strong>Flight:</strong> {stage.flightDetails.airline} {stage.flightDetails.flightNumber}</div>
                                        {stage.flightDetails.departureTime && (
                                            <div><strong>Departure:</strong> {new Date(stage.flightDetails.departureTime).toLocaleString()}</div>
                                        )}
                                        {stage.flightDetails.arrivalTime && (
                                            <div><strong>Arrival:</strong> {new Date(stage.flightDetails.arrivalTime).toLocaleString()}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {stage.notes && (
                                <div className="step-notes">
                                    <strong>📝 Note:</strong> {stage.notes}
                                </div>
                            )}

                            {stage.startDate && stage.endDate && (
                                <div className="step-duration">
                                    Duration: {calculateDuration(stage.startDate, stage.endDate)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
