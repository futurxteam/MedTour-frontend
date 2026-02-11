import React, { useState } from "react";
import "../pages/styles/Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";


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

      // 4️⃣ Store full user (🔥 THIS IS THE KEY 🔥)
      localStorage.setItem("user", JSON.stringify(meRes.data));

      const role = meRes.data.role;
      const profileCompleted = meRes.data.profileCompleted;

      // 5️⃣ Redirect based on profile completion status
      // If user/patient role and profile is not completed, redirect to profile page
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



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleAuth({
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.token);

      // Fetch full user data to check profile completion
      const meRes = await api.get("/user/me");
      localStorage.setItem("user", JSON.stringify(meRes.data));

      const role = meRes.data.role;
      const profileCompleted = meRes.data.profileCompleted;

      // If user/patient role and profile is not completed, redirect to profile page
      if ((role === "user" || role === "patient") && !profileCompleted) {
        navigate("/profile");
      } else {
        // Otherwise, redirect to appropriate dashboard
        const targetPath = dashboardMap[role];
        navigate(targetPath || "/dashboard/user");
      }
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Login to continue to Medtour</p>

        <label>Email or Phone Number</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com or phone number"
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

        <div className="auth-divider">or</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
          size="large"
        />

        <div className="auth-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
