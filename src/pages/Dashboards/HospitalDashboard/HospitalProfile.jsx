import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/HospitalDashboard.css";

const HospitalProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/hospital/me");
      setProfile(res.data.profile || {});
    } catch (err) {
      console.error("Failed to fetch hospital profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put("/hospital/profile", profile);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update hospital profile", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Hospital Profile</h3>
      </div>

      <div className="form-section">
        <div className="card-grid">
          {/* Hospital Name */}
          <div className="form-group">
            <label>Hospital Name</label>
            {editing ? (
              <input
                className="form-control"
                name="hospitalName"
                value={profile.hospitalName || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="form-control-static">{profile.hospitalName || "-"}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            {editing ? (
              <input
                className="form-control"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="form-control-static">{profile.phone || "-"}</p>
            )}
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>
            {editing ? (
              <input
                className="form-control"
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="form-control-static">{profile.city || "-"}</p>
            )}
          </div>

          {/* State */}
          <div className="form-group">
            <label>State</label>
            {editing ? (
              <input
                className="form-control"
                name="state"
                value={profile.state || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="form-control-static">{profile.state || "-"}</p>
            )}
          </div>
        </div>

        {/* Departments */}
        <div className="form-group">
          <label>Departments / Specialties</label>
          {editing ? (
            <input
              className="form-control"
              name="specialties"
              placeholder="Eg: Cardiology, Neurology"
              value={Array.isArray(profile.specialties) ? profile.specialties.join(", ") : profile.specialties || ""}
              onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(',').map(s => s.trim()) })}
            />
          ) : (
            <p className="form-control-static">
              {Array.isArray(profile.specialties) && profile.specialties.length
                ? profile.specialties.join(", ")
                : "-"}
            </p>
          )}
        </div>

        {/* About Hospital */}
        <div className="form-group">
          <label>About Hospital</label>
          {editing ? (
            <textarea
              className="form-control"
              name="description"
              value={profile.description || ""}
              onChange={handleChange}
            />
          ) : (
            <p className="form-control-static">{profile.description || "-"}</p>
          )}
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Full Address</label>
          {editing ? (
            <textarea
              className="form-control"
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
            />
          ) : (
            <p className="form-control-static">{profile.address || "-"}</p>
          )}
        </div>

        <div className="btn-group">
          {editing ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>Save Profile</button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      <style>{`
        .form-control-static {
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default HospitalProfile;
