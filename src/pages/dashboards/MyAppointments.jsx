import React, { useState } from "react";
import "../styles/Dashboard.css"; // Assuming you have shared styles

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
      <div className="dashboard-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "8px", fontSize: "28px", color: "#1e293b" }}>
          My Treatment Journey
        </h2>
        <p style={{ color: "#64748b", marginBottom: "30px" }}>
          Track your medical travel and surgery progress
        </p>

        {/* Surgery Summary Card */}
        <div
          className="dashboard-card"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>Proctology Surgery</h3>
          <p style={{ margin: "8px 0", opacity: 0.95 }}>
            <strong>Hospital:</strong> Futureace Hospital, Edapally, Kochi
          </p>
           <p style={{ margin: "8px 0", opacity: 0.95 }}>
            <strong>Doctor:</strong> Dr. Rajesh Menon
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                background: "#10b981",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              In Progress
            </span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Main Content - Stepper + Details */}
          <div style={{ flex: "2 1 650px" }}>
            {/* Vertical Stepper */}
            <div className="dashboard-card" style={{ padding: "24px" }}>
              <h3 style={{ marginBottom: "24px", color: "#1e293b" }}>Journey Progress</h3>

              <div style={{ position: "relative" }}>
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: index === steps.length - 1 ? "0" : "24px",
                      position: "relative",
                    }}
                  >
                    {/* Timeline Line */}
                    {index < steps.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: "20px",
                          top: "40px",
                          width: "2px",
                          height: "100%",
                          background: index < currentStepIndex ? "#3b82f6" : "#e2e8f0",
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Circle Indicator */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background:
                          step.completed || step.current
                            ? "#3b82f6"
                            : "#e2e8f0",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        flexShrink: 0,
                        zIndex: 1,
                        boxShadow: step.current ? "0 0 0 8px rgba(59, 130, 246, 0.2)" : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      {step.completed ? "✓" : step.current ? "●" : index + 1}
                    </div>

                    {/* Step Content */}
                    <div style={{ marginLeft: "20px", flex: 1 }}>
                      <h4
                        style={{
                          margin: "0 0 6px 0",
                          color: step.current ? "#1e293b" : "#64748b",
                          fontSize: "18px",
                        }}
                      >
                        {step.title}
                        {step.current && (
                          <span
                            style={{
                              marginLeft: "10px",
                              background: "#3b82f6",
                              color: "white",
                              fontSize: "12px",
                              padding: "4px 10px",
                              borderRadius: "12px",
                            }}
                          >
                            CURRENT
                          </span>
                        )}
                      </h4>
                      <p style={{ margin: "4px 0", color: "#64748b", fontSize: "15px" }}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Details */}
            <div className="dashboard-card" style={{ marginTop: "24px", padding: "24px" }}>
              <h3 style={{ color: "#1e293b", marginBottom: "16px" }}>
                Current Step: {activeStep.title}
              </h3>
              <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6" }}>
                <strong>Schedule:</strong> {activeStep.time}
              </p>
              <p style={{ marginTop: "12px", fontSize: "16px", color: "#475569", lineHeight: "1.7" }}>
                {activeStep.details}
              </p>

              {activeStep.current && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    background: "#f0f9ff",
                    borderRadius: "10px",
                    borderLeft: "4px solid #3b82f6",
                  }}
                >
                  <p style={{ margin: 0, color: "#0c4a6e", fontWeight: "500" }}>
                    ✈️ You're on your way! Safe travels to Kochi.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1 1 300px" }}>
            {/* Care Assistant */}
            <div className="dashboard-card" style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>Your Care Assistant</h3>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#e0f2fe",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                  }}
                >
                  👤
                </div>
                <h4 style={{ margin: "0 0 8px 0" }}>Rahul Menon</h4>
                <p style={{ color: "#64748b", fontSize: "15px" }}>Personal Coordinator</p>
              </div>
              <p style={{ textAlign: "center", margin: "16px 0" }}>
                <strong>Contact:</strong><br />
                <a href="tel:+919876543210" style={{ color: "#3b82f6", fontSize: "18px", fontWeight: "600" }}>
                  +91 98765 43210
                </a>
              </p>
              <p style={{ fontSize: "15px", color: "#64748b", textAlign: "center" }}>
                Available 24/7 for any assistance during your journey.
              </p>
            </div>

            {/* Included Services */}
            <div className="dashboard-card">
              <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>Included Services</h3>
              <div style={{ spaceY: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>🌍</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Arabic Translator</p>
                    <small style={{ color: "#64748b" }}>Dedicated support at hospital</small>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>🚗</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Premium Transport</p>
                    <small style={{ color: "#64748b" }}>Airport pickup & transfers</small>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>🏞️</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Tour Package</p>
                    <small style={{ color: "#64748b" }}>Optional Kerala sightseeing post-recovery</small>
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