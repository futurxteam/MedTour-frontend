import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2025 Medtour. All rights reserved.</p>

        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/contact">Contact Us</a>

          {/* Show Register as Hospital button only on homepage */}
          {location.pathname === "/" && (
            <button
              className="footer-cta"
              onClick={() => navigate("/register-hospital")}
            >
              Register as Hospital
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
