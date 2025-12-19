import React from "react";
import "../pages/styles/Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo">Medtour</div>

        <nav className="nav-items">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </nav>

        <button className="btn header-btn">Book Appointment</button>
      </div>
    </header>
  );
};

export default Header;
