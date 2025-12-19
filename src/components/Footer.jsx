import React from "react";
import "../pages/styles/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2025 Medtour. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
