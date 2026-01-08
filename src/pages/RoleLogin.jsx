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

  // Validate role param
  if (!role || !dashboardMap[role]) {
    console.warn(`Invalid role param: ${role}`);
  }

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    // Basic form validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      console.warn("Login failed — missing email or password");
      return;
    }

    try {
      console.log(`Attempting login for role: ${role}, email: ${email}`);

      // Call login API
      const res = await loginUser({ email, password, role });

      // If no token in response — treat as fail
      if (!res.token) {
        throw new Error("Login did not return a token");
      }

      // Store the token
      localStorage.setItem("token", res.token);
      console.log("Login successful! Token saved.");

      // Redirect to the correct dashboard
      const targetPath = dashboardMap[role];
      if (targetPath) {
        console.log(`Redirecting to dashboard: ${targetPath}`);
        navigate(targetPath, { replace: true });
      } else {
        console.error(`No dashboard mapping for role: ${role}`);
        setError("Login succeeded but no dashboard available for your role");
      }
    } catch (err) {
      console.error("Login failed:", err);

      // Show friendly error message
      let msg = err.message || "Login failed";
      if (msg.toLowerCase().includes("invalid credentials")) {
        msg = "Password incorrect or user not found";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{roleTitles[role] || "Login"}</h1>
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
