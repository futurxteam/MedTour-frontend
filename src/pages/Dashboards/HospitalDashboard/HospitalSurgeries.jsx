import { useEffect, useState } from "react";
import { getHospitalSurgeries, toggleHospitalSurgery } from "../../../api/api";
import "../styles/HospitalDashboard.css";
import React from "react";

export default function HospitalSurgeries() {
  const [surgeries, setSurgeries] = useState([]);

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async () => {
    const res = await getHospitalSurgeries();
    setSurgeries(res.data);
  };

  // ✅ FIX: group by specialization NAME
  const grouped = surgeries.reduce((acc, s) => {
    const specName = s.specialization?.name || "Others";

    if (!acc[specName]) {
      acc[specName] = [];
    }

    acc[specName].push(s);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h2>Surgeries</h2>

      {Object.keys(grouped).map((specName) => (
        <div key={specName} className="specialization-group">
          <h3>{specName}</h3>

          <div className="card-grid">
            {grouped[specName].map((surgery) => (
              <div key={surgery._id} className="card">
                <h4>{surgery.surgeryName}</h4>
                <p>{surgery.description}</p>
                <p>
                  <b>Duration:</b> {surgery.duration}
                </p>
                <p>
                  <b>Cost:</b> ₹{surgery.cost}
                </p>

                <button
                  className={surgery.active ? "danger" : "success"}
                  onClick={async () => {
                    await toggleHospitalSurgery(surgery._id);
                    fetchSurgeries();
                  }}
                >
                  {surgery.active ? "Disable" : "Enable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}