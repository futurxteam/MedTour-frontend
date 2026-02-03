import React, { useState } from "react";
import "../../styles/Dashboard.css";
import "../styles/MyAppointments.css";

const steps = [
  {
    id: 1,
    title: "Consultation",
    time: "Day 1 · 10:00 AM",
    details: "Initial consultation and communication with the assigned doctor.",
    completed: true,
  },
  {
    id: 2,
    title: "Visa Process",
    time: "Day 1 · 4 hrs",
    details: "Medical visa processing and documentation assistance.",
    completed: true,
  },
  {
    id: 3,
    title: "Travel: Dubai → Kochi",
    time: "Day 2 · 4 hrs flight",
    details: "Flight from Dubai to Kochi International Airport (COK).",
    current: true,
  },
  {
    id: 4,
    title: "Airport → Hospital",
    time: "Day 2 · 2 hrs",
    details: "Private transfer from Kochi Airport to Futureace Hospital, Edapally.",
  },
  {
    id: 5,
    title: "Surgery",
    time: "Day 3 · 9:00 AM",
    details: "Scheduled proctology surgery performed by specialist doctor.",
  },
  {
    id: 6,
    title: "Recovery",
    time: "Day 3–5 · 2 days",
    details: "Post-surgery monitoring, medication, and rest under medical care.",
  },
  {
    id: 7,
    title: "Return: Kochi → Dubai",
    time: "Day 5 · Afternoon",
    details: "Return flight after final check-up and medical clearance.",
  },
];

export default function MyAppointments() {
  const currentStepIndex = steps.findIndex((step) => step.current);
  const activeStep = steps.find((s) => s.current) || steps[0];

  return (
    <div className="dashboard">
      <div className="appointments-container">
        <h2 className="appointments-title">
          My Treatment Journey
        </h2>
        <p className="appointments-subtitle">
          Track your medical travel and surgery progress
        </p>

        {/* Surgery Summary Card */}
        <div className="dashboard-card surgery-summary-card">
          <h3>Proctology Surgery</h3>
          <p>
            <strong>Hospital:</strong> Futureace Hospital, Edapally, Kochi
          </p>
          <p>
            <strong>Doctor:</strong> Dr. Rajesh Menon
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="surgery-status-badge">
              In Progress
            </span>
          </p>
        </div>

        <div className="appointments-content">
          {/* Main Content - Stepper + Details */}
          <div className="appointments-main">
            {/* Vertical Stepper */}
            <div className="dashboard-card journey-progress-card">
              <h3>Journey Progress</h3>

              <div className="stepper-container">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="stepper-item"
                  >
                    {/* Timeline Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`stepper-line ${index < currentStepIndex ? 'completed' : 'pending'}`}
                      />
                    )}

                    {/* Circle Indicator */}
                    <div
                      className={`stepper-circle ${
                        step.completed ? 'completed' : step.current ? 'current' : 'pending'
                      }`}
                    >
                      {step.completed ? "✓" : step.current ? "●" : index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="stepper-content">
                      <h4 className={`stepper-title ${step.current ? 'current' : 'pending'}`}>
                        {step.title}
                        {step.current && (
                          <span className="stepper-current-badge">
                            CURRENT
                          </span>
                        )}
                      </h4>
                      <p className="stepper-time">
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Details */}
            <div className="dashboard-card current-step-details">
              <h3>
                Current Step: {activeStep.title}
              </h3>
              <p>
                <strong>Schedule:</strong> {activeStep.time}
              </p>
              <p>
                {activeStep.details}
              </p>

              {activeStep.current && (
                <div className="current-step-alert">
                  <p>
                    ✈️ You're on your way! Safe travels to Kochi.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="appointments-sidebar">
            {/* Care Assistant */}
            <div className="dashboard-card care-assistant-card">
              <h3>Your Care Assistant</h3>
              <div className="assistant-avatar">
                👤
              </div>
              <h4 className="assistant-name">Rahul Menon</h4>
              <p className="assistant-role">Personal Coordinator</p>
              <div className="assistant-contact">
                <strong>Contact:</strong><br />
                <a href="tel:+919876543210" className="assistant-phone">
                  +91 98765 43210
                </a>
              </div>
              <p className="assistant-availability">
                Available 24/7 for any assistance during your journey.
              </p>
            </div>

            {/* Included Services */}
            <div className="dashboard-card services-card">
              <h3>Included Services</h3>
              <div>
                <div className="service-item">
                  <span className="service-icon">🌍</span>
                  <div className="service-content">
                    <p>Arabic Translator</p>
                    <small>Dedicated support at hospital</small>
                  </div>
                </div>
                <div className="service-item">
                  <span className="service-icon">🚗</span>
                  <div className="service-content">
                    <p>Premium Transport</p>
                    <small>Airport pickup & transfers</small>
                  </div>
                </div>
                <div className="service-item">
                  <span className="service-icon">🏞️</span>
                  <div className="service-content">
                    <p>Tour Package</p>
                    <small>Optional Kerala sightseeing post-recovery</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}