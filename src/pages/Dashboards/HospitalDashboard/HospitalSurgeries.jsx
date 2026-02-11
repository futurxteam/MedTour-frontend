import React, { useEffect, useState } from "react";
import { getHospitalSurgeries, toggleHospitalSurgery } from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function HospitalSurgeries() {
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async () => {
    try {
      const res = await getHospitalSurgeries();
      setSurgeries(res.data);
    } catch (err) {
      console.error("Failed to fetch surgeries", err);
    } finally {
      setLoading(false);
    }
  };

  const grouped = surgeries.reduce((acc, s) => {
    const specName = s.specialization?.name || "Others";
    if (!acc[specName]) {
      acc[specName] = [];
    }
    acc[specName].push(s);
    return acc;
  }, {});

  if (loading) return <div className="loading-container">Loading surgeries...</div>;

  return (
    <div className="hospital-content" style={{ marginTop: '40px' }}>
      <div className="page-head">
        <h3>Managed Surgery Packages</h3>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <p>No surgery packages found.</p>
          <p className="text-muted">Add new packages using the form above.</p>
        </div>
      ) : (
        Object.keys(grouped).map((specName) => (
          <div key={specName} className="specialization-section">
            <h4 className="specialization-title">{specName}</h4>
            <div className="card-grid">
              {grouped[specName].map((surgery) => (
                <div key={surgery._id} className="info-card">
                  <div className="card-head">
                    <h4>{surgery.surgeryName}</h4>
                    <span className={`badge ${surgery.active ? 'badge-success' : 'badge-danger'}`}>
                      {surgery.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="card-desc">{surgery.description || "No description provided."}</p>

                  <div className="card-meta">
                    <p><strong>Duration:</strong> {surgery.duration}</p>
                    <p><strong>Cost:</strong> ₹{surgery.cost.toLocaleString()}</p>
                  </div>

                  <div className="info-card-actions">
                    <button
                      className={`btn ${surgery.active ? "btn-danger" : "btn-primary"}`}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={async () => {
                        await toggleHospitalSurgery(surgery._id);
                        fetchSurgeries();
                      }}
                    >
                      {surgery.active ? "Disable Package" : "Enable Package"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <style>{`
        .specialization-section {
            margin-bottom: 40px;
        }
        .specialization-title {
            font-size: 18px;
            color: var(--primary);
            margin-bottom: 16px;
            font-weight: 600;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
            display: inline-block;
        }
        .card-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .card-desc {
            font-size: 13px !important;
            color: var(--text-muted);
            margin-bottom: 15px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .card-meta p {
            font-size: 14px;
            margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}