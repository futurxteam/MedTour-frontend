import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuthUser } from "../utils/auth";
import GlobalSearch from "./GlobalSearch";
import "../pages/styles/Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Re-render on route change
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = nextLang;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user data from localStorage (re-evaluates on each render including location changes)
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const role = userData?.role;
  
  let displayName = "User";
  if (userData?.name) {
    if (typeof userData.name === "object") {
      displayName = userData.name[i18n.language] || userData.name.en || userData.name.ar || "User";
    } else {
      displayName = userData.name;
    }
  }
  if (typeof displayName !== "string") {
    displayName = String(displayName);
  }

  const avatarUrl = userData?.profile?.avatar || userData?.photo || null; // fallback check

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">

        {/* LOGO */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <div className="site-logo-text" style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: scrolled ? '#1e293b' : '#ffffff',
            letterSpacing: '-1.5px',
            fontFamily: "'Outfit', sans-serif"
          }}>
            <span style={{ color: '#14b8a6' }}>Med</span>Tour
          </div>
        </div>

        {/* GLOBAL SEARCH */}
        <GlobalSearch />

        {/* NAV LINKS */}
        <nav className="nav-items">
          <Link to="/services">{t('nav.treatments')}</Link>
          <Link to="/hospitals">{t('nav.hospitals')}</Link>
          <Link to="/doctors">{t('nav.doctors', 'Doctors')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </nav>

        {/* AUTH / PROFILE */}
        {!token ? (
          <div className="header-actions">
            <div className="language-selector" onClick={toggleLanguage} style={{ cursor: 'pointer' }}>
              <span className="globe-icon">🌐</span>
              <span className="lang-text">{i18n.language === 'en' ? 'Arabic' : 'English'}</span>
            </div>
            <Link to="/login" className="header-btn-outline">
              {t('nav.login')}
            </Link>
            <Link to="/signup" className="header-btn">
              {t('nav.signup')}
            </Link>
          </div>
        ) : (
          <div className="profile-wrapper">
            <div className="header-actions-auth">
              <div className="language-selector" onClick={toggleLanguage} style={{ cursor: 'pointer' }}>
                <span className="globe-icon">🌐</span>
                <span className="lang-text">{i18n.language === 'en' ? 'Arabic' : 'English'}</span>
              </div>
              <div
                className="user-info"
                onClick={() => setOpen(!open)}
                style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}
              >
                <span className="user-name" style={{ fontWeight: 500 }}>{displayName}</span>
                <div
                  className="profile-avatar"
                  title={displayName}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#14b8a6",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff" }}>
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {open && (
              <div className="profile-dropdown">
                {/* Dashboard Link for Doctors, Hospital, and Users */}
                {role === "doctor" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/doctor");
                    }}
                  >
                    {t('nav.dashboard')}
                  </div>
                )}

                {role === "hospital" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/hospital");
                    }}
                  >
                    {t('nav.dashboard')}
                  </div>
                )}

                {role === "patient" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/user");
                    }}
                  >
                    {t('nav.dashboard')}
                  </div>
                )}

                {role === "admin" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/admin");
                    }}
                  >
                    {t('nav.dashboard')}
                  </div>
                )}

                {role === "assistant" && (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/pa");
                    }}
                  >
                    {t('nav.dashboard')}
                  </div>
                )}

                <div
                  className="dropdown-item"
                  onClick={() => {
                    setOpen(false);
                    // role-based profile routing
                    if (role === "doctor") {
                      navigate("/dashboard/doctor/profile");
                    } else if (role === "user") {
                      navigate("/profile");
                    } else if (role === "hospital") {
                      navigate("/dashboard/hospital/profile");
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  {t('nav.my_profile')}
                </div>

                <div
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  {t('nav.logout')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
