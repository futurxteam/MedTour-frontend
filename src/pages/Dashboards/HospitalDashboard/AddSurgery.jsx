import React, { useEffect, useState } from "react";
import {
  addHospitalSurgery,
  getHospitalSpecializations,
  getAvailableGlobalSurgeries,
} from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function AddSurgery() {
  const [specialties, setSpecialties] = useState([]);
  const [globalSurgeries, setGlobalSurgeries] = useState([]);
  const [search, setSearch] = useState("");
  const [surgerySearch, setSurgerySearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [showSurgeryList, setShowSurgeryList] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    specializationId: "",
    globalSurgeryId: "",
    description: "",
    duration: "",
    cost: "",
  });

  const [selectedGlobal, setSelectedGlobal] = useState(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getHospitalSpecializations();
        setSpecialties(res.data.specializations || res.data.specialties || []);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchGlobals = async () => {
      if (!form.specializationId) {
        setGlobalSurgeries([]);
        return;
      }
      try {
        const res = await getAvailableGlobalSurgeries(form.specializationId);
        setGlobalSurgeries(res.data);
      } catch (err) {
        console.error("Failed to fetch global surgeries:", err);
      }
    };
    fetchGlobals();
  }, [form.specializationId]);

  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlobalSurgeries = globalSurgeries.filter((gs) =>
    gs.surgeryName.toLowerCase().includes(surgerySearch.toLowerCase())
  );

  const handleGlobalSelect = (selected) => {
    setSelectedGlobal(selected);
    setSurgerySearch(selected.surgeryName);
    setForm(prev => ({
      ...prev,
      globalSurgeryId: selected._id,
      description: selected?.description || prev.description,
      duration: selected?.duration || prev.duration,
      cost: selected?.minimumCost || prev.cost
    }));
    setShowSurgeryList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.specializationId || !form.globalSurgeryId) {
      alert("Please select specialization and surgery from catalog");
      return;
    }

    setLoading(true);
    try {
      await addHospitalSurgery({
        globalSurgeryId: form.globalSurgeryId,
        description: form.description,
        duration: form.duration,
        cost: Number(form.cost),
      });

      alert("Surgery added successfully");

      setForm({
        specializationId: "",
        globalSurgeryId: "",
        description: "",
        duration: "",
        cost: "",
      });
      setSearch("");
      setSurgerySearch("");
      setShowList(false);
      setShowSurgeryList(false);
      setSelectedGlobal(null);
    } catch (err) {
      console.error("Error adding surgery:", err);
      alert("Failed to add surgery: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Offer Master Surgery Package</h3>
        <p className="subtitle">Select from the master registry and set your hospital pricing</p>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit}>

          <div className="form-group" style={{ position: 'relative', zIndex: 60 }}>
            <label>1. Select Specialization</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search specialization..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowList(true);
              }}
              onFocus={() => setShowList(true)}
              onBlur={() => setTimeout(() => setShowList(false), 200)}
              required
            />

            {showList && (
              <ul className="custom-dropdown">
                {filteredSpecialties.length === 0 ? (
                  <li className="dropdown-item empty">No matches found</li>
                ) : (
                  filteredSpecialties.map((spec) => (
                    <li
                      key={spec._id}
                      className="dropdown-item"
                      onMouseDown={() => {
                        setForm((prev) => ({ ...prev, specializationId: spec._id, globalSurgeryId: "" }));
                        setSearch(spec.name);
                        setSurgerySearch("");
                        setShowList(false);
                        setSelectedGlobal(null);
                      }}
                    >
                      {spec.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className="form-group" style={{ position: 'relative', zIndex: 50 }}>
            <label>2. Select Surgery from Master Catalog</label>
            <input
              type="text"
              className="form-control"
              placeholder={form.specializationId ? "Search surgery name..." : "Select specialization first"}
              value={surgerySearch}
              onChange={(e) => {
                setSurgerySearch(e.target.value);
                setShowSurgeryList(true);
              }}
              onFocus={() => setShowSurgeryList(true)}
              onBlur={() => setTimeout(() => setShowSurgeryList(false), 200)}
              disabled={!form.specializationId}
              required
            />

            {showSurgeryList && globalSurgeries.length > 0 && (
              <ul className="custom-dropdown">
                {filteredGlobalSurgeries.length === 0 ? (
                  <li className="dropdown-item empty">No surgeries found</li>
                ) : (
                  filteredGlobalSurgeries.map((gs) => (
                    <li
                      key={gs._id}
                      className="dropdown-item"
                      onMouseDown={() => handleGlobalSelect(gs)}
                    >
                      <div className="gs-item-main">
                        <span>{gs.surgeryName}</span>
                        <small>Min: ₹{gs.minimumCost}</small>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {selectedGlobal && (
            <div className="catalog-info-box">
              <p>ℹ️ <b>Master Registry Info:</b> {selectedGlobal.description}</p>
              <p>Base Duration: {selectedGlobal.duration}</p>
            </div>
          )}

          <div className="card-grid" style={{ zIndex: 1, position: 'relative', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Your Hospital Price (INR)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 150000"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                required
                min={selectedGlobal?.minimumCost || 0}
              />
              {selectedGlobal && <small>Must be at least ₹{selectedGlobal.minimumCost}</small>}
            </div>

            <div className="form-group">
              <label>Specific Duration</label>
              <input
                className="form-control"
                placeholder="Ex: 2-3 hours"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Specific Description (Optional)</label>
            <textarea
              className="form-control"
              placeholder="Add any hospital-specific details about this surgery package..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "List This Surgery Package"}
          </button>
        </form>
      </div>

      <style>{`
        .catalog-info-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            color: #166534;
        }
        .catalog-info-box p { margin: 0; }
        .custom-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            max-height: 200px;
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
            border-bottom: 1px solid #f3f4f6;
        }
        .dropdown-item:last-child {
            border-bottom: none;
        }
        .dropdown-item:hover {
            background: #f0f9ff;
            color: var(--primary);
        }
        .dropdown-item.empty {
            color: var(--text-muted);
            cursor: default;
        }
        .gs-item-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gs-item-main small {
            color: var(--text-muted);
            font-weight: 500;
        }
      `}</style>
    </div>
  );
}
