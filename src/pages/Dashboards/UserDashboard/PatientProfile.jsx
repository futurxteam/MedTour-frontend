import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { getAuthUser } from "@/utils/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/PatientProfile.css";

export default function PatientProfile() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    dob: "",
    nationality: "",
    country: "",
    phone: "",
    preferredLanguage: "",
    emergencyContact: "",
  });

  const [profileData, setProfileData] = useState(null);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me");
        setProfileData(res.data);
        
        if (res.data && res.data.profile && Object.keys(res.data.profile).length > 0) {
          setForm({
            dob: res.data.profile.dob ? res.data.profile.dob.split('T')[0] : "",
            nationality: res.data.profile.nationality || "",
            country: res.data.profile.country || "",
            phone: res.data.profile.phone || "",
            preferredLanguage: res.data.profile.preferredLanguage || "",
            emergencyContact: res.data.profile.emergencyContact || "",
          });
          // If profile is already completed, don't show edit mode
          if (res.data.profileCompleted) {
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        } else {
          setIsEditing(true);
        }
        setFetching(false);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        console.error("Error status:", err.response?.status);
        console.error("Error details:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load profile");
        // If it's first time or error, allow editing
        setIsEditing(true);
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const age = form.dob
    ? new Date().getFullYear() -
    new Date(form.dob).getFullYear()
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const res = await api.put("/user/profile", form);


      if (res.status === 200) {
        // 🔥 Save the new token from the response
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // Save user data
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        setIsEditing(false);
        setProfileData(res.data.user);
        
        setTimeout(() => {
          window.location.replace("/dashboard/user");
        }, 500);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.response?.data?.message || "Failed to save profile");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Header />
        <div className="dashboard-container profile-container">
          <h2>My Profile</h2>
          <div className="profile-loading">
            <p>Loading Profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !isEditing) {
    return (
      <>
        <Header />
        <div className="dashboard-container profile-container">
          <h2>My Profile</h2>
          <div className="error-message">{error}</div>
          <button
            type="button"
            className="edit-btn"
            onClick={() => {
              setError("");
              setIsEditing(true);
            }}
          >
            Try Again
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="dashboard-container profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {profileData?.profileCompleted && (
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <h3>{profileData?.profileCompleted ? "Update Your Profile" : "Complete Your Profile"}</h3>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              required
              value={form.dob || ""}
              onChange={(e) =>
                setForm({ ...form, dob: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input value={age || ""} disabled />
          </div>

          <div className="form-group">
            <label>Nationality *</label>
            <input
              required
              placeholder="e.g., Indian"
              value={form.nationality || ""}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Country *</label>
            <input
              required
              placeholder="e.g., India"
              value={form.country || ""}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g., +91 9876543210"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Preferred Language *</label>
            <input
              required
              placeholder="e.g., English"
              value={form.preferredLanguage || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  preferredLanguage: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact *</label>
            <input
              required
              placeholder="Name and Phone"
              value={form.emergencyContact || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  emergencyContact: e.target.value,
                })
              }
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      ) : (
        <div className="profile-view">
          <h3>Profile Information</h3>
          {profileData && profileData.profile && Object.keys(profileData.profile).length > 0 ? (
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Date of Birth:</span>
                <span className="value">
                  {profileData.profile.dob 
                    ? new Date(profileData.profile.dob).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Age:</span>
                <span className="value">{profileData.profile.age || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Nationality:</span>
                <span className="value">{profileData.profile.nationality || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{profileData.profile.country || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{profileData.profile.phone || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Preferred Language:</span>
                <span className="value">{profileData.profile.preferredLanguage || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Emergency Contact:</span>
                <span className="value">{profileData.profile.emergencyContact || "Not provided"}</span>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No profile information available yet.</p>
              <button
                type="button"
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
