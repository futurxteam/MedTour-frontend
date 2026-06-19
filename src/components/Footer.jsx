import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../pages/styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2025 Medtour. {t('footer.rights')}</p>

        <div className="footer-links">
          <a href="/privacy">{t('footer.privacy')}</a>
          <a href="/terms">{t('footer.terms')}</a>
          <a href="/contact">{t('footer.contact')}</a>

          {location.pathname === "/" && (
            <button
              className="footer-cta"
              onClick={() => navigate("/register-hospital")}
            >
              {t('footer.register_hosp')}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
