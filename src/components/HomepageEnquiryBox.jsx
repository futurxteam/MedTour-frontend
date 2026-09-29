import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getCountries, getCitiesByCountry, createPublicEnquiry } from "../api/api";
import "./HomepageEnquiryBox.css";

const HomepageEnquiryBox = () => {
    const { t, i18n } = useTranslation();
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        patientName: "",
        country: "",
        otherCountry: "",
        countryCode: "",
        city: "",
        phoneCode: "+91",
        phoneNumber: "",
        medicalProblem: "",
        ageOrDob: "",
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await getCountries();
                setCountries(res.data.countries || []);
            } catch (err) {
                console.error("Failed to fetch countries", err);
            }
        };
        fetchCountries();
    }, [i18n.language]);

    const handleCountryChange = async (e) => {
        const countryName = e.target.value;
        setFieldErrors((prev) => ({ ...prev, country: "" }));

        if (countryName === "Other") {
            setFormData({ ...formData, country: "Other", countryCode: "OTHER", city: "", phoneCode: "+" });
            setCities([]);
            return;
        }

        const country = countries.find((c) => c.name === countryName);
        if (!country) {
            setFormData({ ...formData, country: "", countryCode: "", city: "" });
            setCities([]);
            return;
        }

        setFormData({
            ...formData,
            country: country.name,
            countryCode: country.code,
            city: "",
            phoneCode: country.phoneCode || "+91",
        });

        if (country.hasCities) {
            setLoadingCities(true);
            try {
                const res = await getCitiesByCountry(country.code);
                setCities(res.data.cities || []);
            } catch {
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        } else {
            setCities([]);
        }
    };

    /* ── Validation ───────────────────────────────────────── */
    const validate = () => {
        const errors = {};
        if (!formData.patientName.trim()) errors.patientName = "Patient name is required.";
        if (!formData.country) errors.country = "Please select your country.";
        if (!formData.phoneNumber || formData.phoneNumber.length < 8) errors.phoneNumber = "Please enter a valid phone number.";
        if (!formData.ageOrDob.trim()) errors.ageOrDob = "Age or Date of Birth is required.";
        return errors;
    };

    /* ── Submit Form Directly ────────────────────────────── */
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setFieldErrors({});

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await createPublicEnquiry({
                patientName: formData.patientName,
                phone: fullPhone,
                contactMode: "call",
                source: "homepage",
                country: formData.country === "Other" ? formData.otherCountry : formData.country,
                city: formData.city,
                medicalProblem: formData.medicalProblem,
                ageOrDob: formData.ageOrDob,
            });

            // Success
            setSubmitted(true);

            // Reset form
            setFormData({
                patientName: "",
                country: "",
                otherCountry: "",
                countryCode: "",
                city: "",
                phoneCode: "+91",
                phoneNumber: "",
                medicalProblem: "",
                ageOrDob: "",
            });
            setCities([]);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to submit enquiry. Please try again.";
            setFieldErrors({ phoneNumber: msg });
        } finally {
            setLoading(false);
        }
    };

    /* ── Success Screen ──────────────────────────────────── */
    if (submitted) {
        return (
            <div className="enquiry-box-container">
                <div className="enquiry-box enquiry-success">
                    <div className="enquiry-success-icon">✓</div>
                    <h3>{t("form.success_title")}</h3>
                    <p>{t("form.success_desc")}</p>
                    <button
                        className="submit-btn"
                        style={{ marginTop: "16px" }}
                        onClick={() => setSubmitted(false)}
                    >
                        {t("form.submit_another")}
                    </button>
                </div>
            </div>
        );
    }

    /* ── Main Form ───────────────────────────────────────── */
    return (
        <div className="enquiry-box-container">
            <div className="enquiry-box">
                <h3>{t("form.title")}</h3>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Patient Name */}
                    <div className="form-group">
                        <input
                            id="enq-patient-name"
                            type="text"
                            placeholder={t("form.patient_name")}
                            value={formData.patientName}
                            onChange={(e) => {
                                setFormData({ ...formData, patientName: e.target.value });
                                setFieldErrors((p) => ({ ...p, patientName: "" }));
                            }}
                        />
                        {fieldErrors.patientName && <span className="field-error">{fieldErrors.patientName}</span>}
                    </div>

                    {/* Country */}
                    <div className="form-group">
                        <select
                            id="enq-country"
                            value={formData.country}
                            onChange={handleCountryChange}
                        >
                            <option value="">{t("form.select_country")}</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.name}>{c.name}</option>
                            ))}
                            <option value="Other">{t("common.other") || "Other"}</option>
                        </select>
                        {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
                    </div>

                    {/* Other country text input */}
                    {formData.country === "Other" && (
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder={t("form.enter_country")}
                                value={formData.otherCountry}
                                onChange={(e) => setFormData({ ...formData, otherCountry: e.target.value })}
                            />
                        </div>
                    )}

                    {/* City */}
                    <div className="form-group">
                        <select
                            id="enq-city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!formData.countryCode || cities.length === 0}
                        >
                            <option value="">
                                {loadingCities ? t("homepage.loading") : t("form.select_city")}
                            </option>
                            {cities.map((city, idx) => (
                                <option key={idx} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Phone */}
                    <div className="form-group phone-group">
                        <div className="phone-input-group">
                            {formData.country === "Other" ? (
                                <input
                                    type="text"
                                    className="country-code-display-input"
                                    value={formData.phoneCode}
                                    onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                                    placeholder="+XX"
                                />
                            ) : (
                                <div className="country-code-display">{formData.phoneCode}</div>
                            )}
                            <input
                                id="enq-phone"
                                className="phone-number"
                                type="tel"
                                placeholder={t("form.phone")}
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    setFormData({ ...formData, phoneNumber: e.target.value });
                                    setFieldErrors((p) => ({ ...p, phoneNumber: "" }));
                                }}
                            />
                        </div>
                        {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
                    </div>

                    {/* Medical Problem */}
                    <div className="form-group">
                        <textarea
                            id="enq-problem"
                            placeholder={t("form.medical_problem")}
                            value={formData.medicalProblem}
                            onChange={(e) => setFormData({ ...formData, medicalProblem: e.target.value })}
                        />
                    </div>

                    {/* Age / DOB */}
                    <div className="form-group">
                        <input
                            id="enq-age"
                            type="text"
                            placeholder={t("form.age_example")}
                            value={formData.ageOrDob}
                            onChange={(e) => {
                                setFormData({ ...formData, ageOrDob: e.target.value });
                                setFieldErrors((p) => ({ ...p, ageOrDob: "" }));
                            }}
                        />
                        {fieldErrors.ageOrDob && <span className="field-error">{fieldErrors.ageOrDob}</span>}
                    </div>

                    <button id="enq-submit-btn" type="submit" className="submit-btn" disabled={loading}>
                        {loading ? t("homepage.loading") : t("form.cta")}
                    </button>
                </form>

                <p className="privacy-text">
                    <Trans i18nKey="form.disclaimer">
                        By submitting the form I agree to the <a href="#">Terms of Use</a> and{" "}
                        <a href="#">Privacy Policy</a> of MedTour Health
                    </Trans>
                </p>
            </div>
        </div>
    );
};

export default HomepageEnquiryBox;
