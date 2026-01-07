import React, { useState } from "react";
import "../pages/styles/Auth.css";
import { loginUser } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

const roleTitles = {
  doctor: "Doctor Login",
  assistant: "Care Assistant Login",
  admin: "Admin Login",
};

const dashboardMap = {
  doctor: "/dashboard/doctor",
  assistant: "/dashboard/pa",
  admin: "/dashboard/admin",
};

const RoleLogin = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // ✅ SEND ROLE TO BACKEND
      const res = await loginUser({ email, password, role });

      // ✅ STORE TOKEN ONLY
      localStorage.setItem("token", res.token);

      // ✅ REDIRECT TO CORRECT DASHBOARD
      navigate(dashboardMap[role]);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{roleTitles[role]}</h1>
        <p>Login to continue to Medtour</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </div>
    </div>
  );
};

export default RoleLogin;
