import React, { useEffect, useState } from "react";
import {
  getHospitalMe,
  updateHospitalProfile,
  getHospitalSpecializations,
  uploadHospitalPhotos,
  removeHospitalPhoto
} from "@/api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/HospitalDashboard.css";

const HospitalProfile = () => {
  const [profile, setProfile] = useState({});
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, specsRes] = await Promise.all([
        getHospitalMe(),
        getHospitalSpecializations()
      ]);
      setProfile(profileRes.data.profile || {});
      setAllSpecialties(specsRes.data.specialties || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSpecialtyToggle = (specId) => {
    const currentSpecs = profile.specialties || [];
    const exists = currentSpecs.find(s => (s._id || s) === specId);

    if (exists) {
      setProfile({
        ...profile,
        specialties: currentSpecs.filter(s => (s._id || s) !== specId)
      });
    } else {
      setProfile({
        ...profile,
        specialties: [...currentSpecs, specId]
      });
    }
  };

  const handleSave = async () => {
    try {
      // Extract IDs for specialties if they are objects
      const specialtyIds = (profile.specialties || []).map(s => s._id || s);
      await updateHospitalProfile({ ...profile, specialties: specialtyIds });
      setEditing(false);
      fetchData();
    } catch (err) {
      console.error("Failed to update hospital profile", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append("photos", file));

    setUploading(true);
    try {
      await uploadHospitalPhotos(formData);
      fetchData();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (publicId) => {
    if (!window.confirm("Remove this photo?")) return;
    try {
      await removeHospitalPhoto(publicId);
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <div className="hospital-content"><p>Loading profile...</p></div>;

  return (
    <div className="hospital-content">
      <div className="page-head">
        <h3>Hospital Profile Management</h3>
      </div>

      <div className="form-section">
        <h4 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Core Information</h4>
        <div className="card-grid">
          <div className="form-group">
            <label>Hospital Name</label>
            {editing ? (
              <input className="form-control" name="hospitalName" value={profile.hospitalName || ""} onChange={handleChange} />
            ) : (
              <p className="form-control-static">{profile.hospitalName || "-"}</p>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            {editing ? (
              <input className="form-control" name="phone" value={profile.phone || ""} onChange={handleChange} />
            ) : (
              <p className="form-control-static">{profile.phone || "-"}</p>
            )}
          </div>

          <div className="form-group">
            <label>Country</label>
            {editing ? (
              <input className="form-control" name="country" value={profile.country || ""} onChange={handleChange} />
            ) : (
              <p className="form-control-static">{profile.country || "-"}</p>
            )}
          </div>

          <div className="form-group">
            <label>City</label>
            {editing ? (
              <input className="form-control" name="city" value={profile.city || ""} onChange={handleChange} />
            ) : (
              <p className="form-control-static">{profile.city || "-"}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>About Hospital (Description)</label>
          {editing ? (
            <textarea className="form-control" name="description" value={profile.description || ""} onChange={handleChange} />
          ) : (
            <p className="form-control-static">{profile.description || "-"}</p>
          )}
        </div>

        <div className="form-group">
          <label>Full Physical Address</label>
          {editing ? (
            <textarea className="form-control" name="address" value={profile.address || ""} onChange={handleChange} />
          ) : (
            <p className="form-control-static">{profile.address || "-"}</p>
          )}
        </div>

        <div className="section-divider"></div>

        <h4 style={{ marginBottom: '20px' }}>Specialties & Clinical Departments</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {allSpecialties.map(spec => {
            const isSelected = (profile.specialties || []).some(s => (s._id || s) === spec._id);
            return (
              <button
                key={spec._id}
                type="button"
                className={`badge ${isSelected ? 'badge-success' : 'badge-secondary'}`}
                style={{ cursor: editing ? 'pointer' : 'default', border: 'none', padding: '8px 16px' }}
                onClick={() => editing && handleSpecialtyToggle(spec._id)}
              >
                {spec.name} {isSelected && '✓'}
              </button>
            );
          })}
        </div>

        <div className="btn-group">
          {editing ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Details</button>
          )}
        </div>
      </div>

      <div className="form-section">
        <h4 style={{ marginBottom: '10px' }}>Photo Gallery</h4>
        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
          Add photos of your infrastructure, rooms, and facilities to build trust with patients.
        </p>

        <div className="photos-gallery">
          {profile.photos?.map((photo, idx) => (
            <div key={idx} className="photo-item">
              <img src={photo.url} alt="Facility" />
              <div className="photo-overlay">
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handlePhotoDelete(photo.publicId)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          <label className="upload-card">
            <input type="file" multiple hidden onChange={handlePhotoUpload} accept="image/*" disabled={uploading} />
            <i>{uploading ? '⏳' : '📷'}</i>
            <span>{uploading ? 'Uploading...' : 'Add Photos'}</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h4 style={{ marginBottom: '20px' }}>Associated Doctors</h4>
        <div className="doctors-list-mini">
          {profile.doctors?.length > 0 ? (
            profile.doctors.map((doc, idx) => (
              <div key={idx} className="doctor-mini-item">
                <div className="avatar-circle">👨‍⚕️</div>
                <div>
                  <h5 style={{ margin: 0 }}>{doc.userId?.name || "Dr. name unavailable"}</h5>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    {doc.designation} • {doc.experience} years
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No doctors registered under this hospital yet.</p>
          )}
          <button className="btn btn-secondary" style={{ marginTop: '10px' }} onClick={() => navigate('/dashboard/hospital/doctors')}>
            Manage Doctors
          </button>
        </div>
      </div>

      <style>{`
        .form-control-static {
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #374151;
          min-height: 45px;
        }
        .badge-secondary {
          background: #f1f5f9;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default HospitalProfile;
