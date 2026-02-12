import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/api";
import Header from "@/components/Header";
import "../styles/PatientProfile.css";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [form, setForm] = useState({
    experience: "",
    qualifications: "",
    licenseNumber: "",
    bio: "",
    about: "",
    designation: "",
    consultationFee: "",
  });

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/doctor/profile");

        setProfileData(res.data);

        setForm({
          experience: res.data.experience || "",
          qualifications: res.data.qualifications || "",
          licenseNumber: res.data.licenseNumber || "",
          bio: res.data.bio || "",
          about: res.data.about || "",
          designation: res.data.designation || "",
          consultationFee: res.data.consultationFee || "",
        });

        if (!res.data.profileCompleted) {
          setIsEditing(true);
        }

        setFetching(false);
      } catch (err) {
        console.error("Failed to load doctor profile", err);
        setError("Failed to load profile data.");
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.put("/doctor/profile", {
        ...form,
        experience: Number(form.experience),
      });

      setProfileData(res.data);

      // Update local storage to allow access to dashboard (fixes redirect loop)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentUser.profileCompleted = true;
      localStorage.setItem("user", JSON.stringify(currentUser));

      setIsEditing(false);
      navigate("/dashboard/doctor");
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Header />
        <div className="dashboard-container profile-container">
          <h2>Doctor Profile</h2>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="dashboard-container profile-container">
        <div className="profile-header">
          <h2>Doctor Profile</h2>
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <h3>
              {profileData?.profileCompleted
                ? "Update Your Profile"
                : "Complete Your Profile"}
            </h3>

            {/* Read-only Specializations */}
            <div className="form-group">
              <label>Specialization (Assigned by Hospital)</label>
              <input
                type="text"
                value={
                  profileData?.specializations?.length
                    ? profileData.specializations.join(", ")
                    : "Not Assigned"
                }
                disabled
                style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>Years of Experience *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.experience}
                onChange={(e) =>
                  setForm({
                    ...form,
                    experience: e.target.value === ""
                      ? ""
                      : Math.max(0, Number(e.target.value)),
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Qualifications *</label>
              <input
                value={form.qualifications}
                onChange={(e) =>
                  setForm({ ...form, qualifications: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>License Number *</label>
              <input
                value={form.licenseNumber}
                onChange={(e) =>
                  setForm({ ...form, licenseNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                value={form.designation}
                placeholder="Senior Consultant"
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee ($)</label>
              <input
                type="number"
                value={form.consultationFee}
                onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>About / Professional Summary</label>
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                rows={4}
                placeholder="Brief summary of your professional background..."
              />
            </div>

            <div className="form-group">
              <label>Personal Bio (Legacy)</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={2}
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
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Specialization:</span>
                <span className="value">
                  {profileData?.specializations?.length
                    ? profileData.specializations.join(", ")
                    : "Not assigned yet"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Experience:</span>
                <span className="value">
                  {profileData?.experience} years
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Qualifications:</span>
                <span className="value">
                  {profileData?.qualifications}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">License Number:</span>
                <span className="value">
                  {profileData?.licenseNumber}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Designation:</span>
                <span className="value">{profileData?.designation || "—"}</span>
              </div>

              <div className="detail-item">
                <span className="label">Consultation Fee:</span>
                <span className="value">
                  {profileData?.consultationFee ? `$${profileData.consultationFee}` : "—"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">About:</span>
                <span className="value">
                  {profileData?.about || "—"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Bio (Legacy):</span>
                <span className="value">
                  {profileData?.bio || "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorProfile;