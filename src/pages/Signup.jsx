import React, { useState } from "react";
import "../pages/styles/Auth.css";
import { signupUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await signupUser({ name, email, password });
      localStorage.setItem("token", res.token);

      // Fetch full user data
      const meRes = await api.get("/user/me");
      localStorage.setItem("user", JSON.stringify(meRes.data));

      // New users need to complete their profile
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <Header />
      <div className="auth-page signup-bg">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Get started with Medtour today</p>
          </div>

          <div className="auth-form">
            <div className="form-item">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="form-item">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-item">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            {error && <div className="auth-error-box">{error}</div>}

            <button
              className="auth-btn"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
