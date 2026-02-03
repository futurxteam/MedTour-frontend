import React, { useEffect, useState } from "react";
import api from "@/api/api";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import "../styles/HospitalDashboard.css";

const HospitalProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate()
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

  if (loading) return null;

  return (
    <>
      <div className="dashboard-container">
        {/* Title row */}
        <div className="profile-header">
          <h1>Hospital Profile</h1>
        </div>

        {/* Main card */}
        <div className="profile-card">
          <h3>Profile Information</h3>

          <div className="profile-info-grid">
            {/* Hospital Name */}
            <div className="info-box">
              <label>Hospital Name</label>
              {editing ? (
                <input
                  name="hospitalName"
                  value={profile.hospitalName || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.hospitalName || "-"}</p>
              )}
            </div>

            {/* Phone */}
            <div className="info-box">
              <label>Phone</label>
              {editing ? (
                <input
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.phone || "-"}</p>
              )}
            </div>

            {/* City */}
            <div className="info-box">
              <label>City</label>
              {editing ? (
                <input
                  name="city"
                  value={profile.city || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.city || "-"}</p>
              )}
            </div>

            {/* State */}
            <div className="info-box">
              <label>State</label>
              {editing ? (
                <input
                  name="state"
                  value={profile.state || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.state || "-"}</p>
              )}
            </div>

            {/* Departments / Specialties */}
            <div className="info-box">
              <label>Departments / Specialties</label>
              {editing ? (
                <input
                  name="specialties"
                  placeholder="Eg: Cardiology, Neurology"
                  value={profile.specialties || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  {Array.isArray(profile.specialties) && profile.specialties.length
                    ? profile.specialties.join(", ")
                    : "-"}
                </p>
              )}
            </div>

            {/* About Hospital */}
            <div className="info-box full-width">
              <label>About Hospital</label>
              {editing ? (
                <textarea
                  name="description"
                  value={profile.description || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.description || "-"}</p>
              )}
            </div>

            {/* Address */}
            <div className="info-box full-width">
              <label>Full Address</label>
              {editing ? (
                <textarea
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.address || "-"}</p>
              )}
            </div>
          </div>


          <div className="dashboard-actions">
            {editing ? (
              <button className="save-btn" onClick={handleSave}>Save Profile</button>
            ) : (
              <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalProfile;
