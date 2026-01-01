import React, { useState } from "react";
import "./styles/Home.css";
import { surgeryData } from "./data";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar"; // ✅ ADD AVATAR

export default function Services() {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <div className="home-root">
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Medical Services</h2>

         

          {/* Optional helper text */}
          {selectedPart && (
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
              Selected body part: <b>{selectedPart}</b>
            </p>
          )}

          {/* Services */}
          <div className="services-grid">
            {surgeryData.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => navigate(`/surgery/${service.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
           {/* ✅ Avatar moved here */}
           <br/>
<h3 style={{ textAlign: "center", marginTop: "20px" }}>
  Or Select in Avatar
</h3>

          <div style={{ margin: "30px 0", display: "flex", justifyContent: "center" }}>
            <Avatar
              onSelect={(part) => {
                setSelectedPart(part);
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
