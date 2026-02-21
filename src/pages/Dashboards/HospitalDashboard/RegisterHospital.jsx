import React, { useState } from "react";
import { registerHospital } from "@/api/api";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";

export default function RegisterHospital() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerHospital(form);
      alert("Registration request successful! Your account is now pending admin approval. You will be able to log in once verified.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="auth-icon" style={{
            fontSize: '48px',
            marginBottom: '16px',
            background: 'var(--accent-light)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--accent)'
          }}>
            🏥
          </div>
          <h1>Partner With Us</h1>
          <p>Register your hospital to become part of Kerala's premier medical tourism network.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hospital Name</label>
            <input
              type="text"
              placeholder="Enter official hospital name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Business Email</label>
            <input
              type="email"
              placeholder="contact@hospital.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Submitting Request..." : "Request Partnerships Approval"}
          </button>
        </form>

        <div className="auth-link">
          Already registered? <Link to="/login">Sign in here</Link>
        </div>

        <div className="auth-footer-note" style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px'
        }}>
          💡 <strong>Security Note:</strong> All registrations are manually verified by our medical ethics committee within 24-48 hours.
        </div>
      </div>
    </div>
  );
}
