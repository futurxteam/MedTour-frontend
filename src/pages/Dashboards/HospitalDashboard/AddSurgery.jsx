import React, { useEffect, useState } from "react";
import {
  addHospitalSurgery,
  getHospitalSpecializations,
} from "../../../api/api";
import "../../styles/HospitalDashboard.css";

export default function AddSurgery() {
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    specializationId: "",
    surgeryName: "",
    description: "",
    duration: "",
    cost: "",
  });

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

  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.specializationId) {
      alert("Please select a specialization");
      return;
    }

    setLoading(true);
    try {
      await addHospitalSurgery({
        specializationId: form.specializationId,
        surgeryName: form.surgeryName,
        description: form.description,
        duration: form.duration,
        cost: Number(form.cost),
      });

      alert("Surgery added successfully");

      setForm({
        specializationId: "",
        surgeryName: "",
        description: "",
        duration: "",
        cost: "",
      });
      setSearch("");
      setShowList(false);
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
        <h3>Add New Surgery Package</h3>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit}>

          <div className="form-group" style={{ position: 'relative', zIndex: 50 }}>
            <label>Specialization</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search & Select Specialization..."
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
                        setForm((prev) => ({ ...prev, specializationId: spec._id }));
                        setSearch(spec.name);
                        setShowList(false);
                      }}
                    >
                      {spec.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className="card-grid" style={{ zIndex: 1, position: 'relative' }}>
            <div className="form-group">
              <label>Surgery Name</label>
              <input
                className="form-control"
                placeholder="Ex: Knee Replacement"
                value={form.surgeryName}
                onChange={(e) => setForm({ ...form, surgeryName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                className="form-control"
                placeholder="Ex: 2-3 hours"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Cost (INR)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 150000"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              placeholder="Detailed description of the surgery and what is included..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Surgery Package"}
          </button>
        </form>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}