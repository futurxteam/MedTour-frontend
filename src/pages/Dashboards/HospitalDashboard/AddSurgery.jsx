import React, { useEffect, useState } from "react";
import { addHospitalSurgery, getHospitalSpecializations } from "../../../api/api";
import "../styles/HospitalDashboard.css";

export default function AddSurgery() {
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    specialization: "",
    surgeryName: "",
    description: "",
    duration: "",
    cost: "",
  });

  // Fetch specializations from database on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getHospitalSpecializations();
        setSpecialties(res.data.specializations || []);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);
  const filteredSpecialties = specialties.filter((spec) =>
    spec.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.specialization) {
      alert("Please select a specialization");
      return;
    }

    try {
      await addHospitalSurgery({
        ...form,
        cost: Number(form.cost),
      });
      alert("Surgery added successfully");
      setForm({
        specialization: "",
        surgeryName: "",
        description: "",
        duration: "",
        cost: "",
      });
      setSearch("");
    } catch (err) {
      console.error("Error adding surgery:", err);
      alert("Failed to add surgery: " + (err.response?.data?.message || err.message));
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
                  key={spec}
                  onClick={() => {
                    setForm({ ...form, specialization: spec });
                    setSearch(spec);
                    setShowList(false);
                  }}
                >
                  {spec}
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
