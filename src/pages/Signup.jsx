import React, { useState } from "react";
import "../pages/styles/Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, signupUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

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
      navigate("/");
    } catch (err) {
      setError(err.message);
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
      navigate("/");
    } catch {
      setError("Google signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Get started with Medtour</p>

        <label>Full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

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
          placeholder="Create a password"
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="auth-divider">or</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google signup failed")}
          size="large"
        />

        <div className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
