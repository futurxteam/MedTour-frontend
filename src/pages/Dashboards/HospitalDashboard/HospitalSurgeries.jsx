import React, { useEffect, useState } from "react";
import { getHospitalSurgeries, toggleHospitalSurgery, getHospitalSpecializations } from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function HospitalSurgeries() {
  const [surgeries, setSurgeries] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specFilter, setSpecFilter] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [surSurgeryRes, specRes] = await Promise.all([
        getHospitalSurgeries(),
        getHospitalSpecializations()
      ]);
      setSurgeries(surSurgeryRes.data);
      setSpecialties(specRes.data.specializations || specRes.data.specialties || []);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurgeries = async () => {
    try {
      const res = await getHospitalSurgeries();
      setSurgeries(res.data);
    } catch (err) {
      console.error("Failed to fetch surgeries", err);
    }
  };

  const filteredSurgeries = surgeries.filter((s) => {
    const name = s.globalSurgeryId?.surgeryName || s.surgeryName || "Unnamed Surgery";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specFilter === "" || s.specialization?._id === specFilter;
    return matchesSearch && matchesSpec;
  });

  const grouped = filteredSurgeries.reduce((acc, s) => {
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
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h3>Managed Surgery Packages</h3>
          <p className="text-muted">Currently offering {surgeries.length} packages</p>
        </div>

        <div className="list-filters" style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            placeholder="Search offered surgeries..."
            className="form-control"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control"
            style={{ width: '200px' }}
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specialties.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm || specFilter ? "No surgery packages match your search." : "No surgery packages found."}</p>
          <p className="text-muted">Add new packages using the "Add Surgery" section.</p>
        </div>
      ) : (
        Object.keys(grouped).map((specName) => (
          <div key={specName} className="specialization-section">
            <h4 className="specialization-title">{specName}</h4>
            <div className="card-grid">
              {grouped[specName].map((surgery) => (
                <div key={surgery._id} className="info-card">
                  <div className="card-head">
                    <h4>{surgery.globalSurgeryId?.surgeryName || surgery.surgeryName}</h4>
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
            min-height: 40px;
        }
        .card-meta p {
            font-size: 14px;
            margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
