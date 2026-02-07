import React, { useEffect, useState } from "react";
import {
  addHospitalSurgery,
  getHospitalSpecializations,
} from "../../../api/api";
import "../styles/HospitalDashboard.css";

export default function AddSurgery() {
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    specializationId: "",   // ✅ ObjectId
    surgeryName: "",
    description: "",
    duration: "",
    cost: "",
  });

  /* ===========================
     FETCH SPECIALTIES
  =========================== */
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getHospitalSpecializations();
        // Handle both possible keys from backend
        setSpecialties(res.data.specializations || res.data.specialties || []);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);

  /* ===========================
     FILTER SPECIALTIES
  =========================== */
  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ===========================
     SUBMIT
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.specializationId) {
      alert("Please select a specialization");
      return;
    }

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
      alert(
        "Failed to add surgery: " +
        (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="form-card">
      <h4>Add Surgery</h4>

      <form onSubmit={handleSubmit}>
        {/* 🔽 SEARCHABLE SPECIALIZATION DROPDOWN */}
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="Search specialization"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowList(true);
            }}
            onFocus={() => setShowList(true)}
            required
          />

          {showList && (
            <ul className="dropdown-list">
              {filteredSpecialties.length === 0 && (
                <li className="dropdown-empty">No matches</li>
              )}

              {filteredSpecialties.map((spec) => (
                <li
                  key={spec._id}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      specializationId: spec._id, // ✅ store ID
                    }));
                    setSearch(spec.name);         // show name
                    setShowList(false);
                  }}
                >
                  {spec.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          placeholder="Surgery Name"
          value={form.surgeryName}
          onChange={(e) =>
            setForm({ ...form, surgeryName: e.target.value })
          }
          required
        />

        <input
          placeholder="Duration (e.g. 2–3 hours)"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Cost (INR)"
          value={form.cost}
          onChange={(e) =>
            setForm({ ...form, cost: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit">Add Surgery</button>
      </form>
    </div>
  );
}