import React, { useState } from "react";
import "../pages/styles/Auth.css";
import { loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dashboardMap = {
    admin: "/dashboard/admin",
    doctor: "/dashboard/doctor",
    assistant: "/dashboard/pa",
    patient: "/dashboard/user", // Patient role redirects to user dashboard
    hospital: "/dashboard/hospital",
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email/phone and password");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Login
      const res = await loginUser({ email, password });

      if (!res.token) {
        throw new Error("Invalid login response");
      }

      // 2️⃣ Store token
      localStorage.setItem("token", res.token);

      // 3️⃣ Fetch FULL user from backend
      const meRes = await api.get("/user/me");

      // 4️⃣ Store full user
      localStorage.setItem("user", JSON.stringify(meRes.data));

      const role = meRes.data.role;
      const profileCompleted = meRes.data.profileCompleted;

      // 5️⃣ Redirect based on profile completion status
      if ((role === "user" || role === "patient") && !profileCompleted) {
        navigate("/profile", { replace: true });
        return;
      }

      // 6️⃣ Otherwise, redirect based on role to dashboard
      const targetPath = dashboardMap[role];
      if (!targetPath) {
        throw new Error("No dashboard available for this role");
      }

      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <Header />
      <div className="auth-page login-bg">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <div className="auth-form">
            <div className="form-item">
              <label>Email or Phone Number</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com or phone number"
              />
            </div>

            <div className="form-item">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <div className="auth-error-box">{error}</div>}

            <button
              className="auth-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <div className="auth-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
