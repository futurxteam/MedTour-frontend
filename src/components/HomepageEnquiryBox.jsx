import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getCountries, getCitiesByCountry, sendEnquiryOtp, verifyOtpAndCreateEnquiry } from "../api/api";
import "./HomepageEnquiryBox.css";

const HomepageEnquiryBox = () => {
    const { t, i18n } = useTranslation();
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const [otp, setOtp] = useState("");

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

        if (countryName === "Other") {
            setFormData({
                ...formData,
                country: "Other",
                countryCode: "OTHER",
                city: "",
                phoneCode: "+",
            });
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
            } catch (err) {
                console.error("Failed to fetch cities", err);
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        } else {
            setCities([]);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.patientName || !formData.country || !formData.phoneNumber || !formData.ageOrDob) {
            alert("Please fill all required fields");
            return;
        }

        if (formData.phoneNumber.length < 8) {
            alert("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await sendEnquiryOtp({ phone: fullPhone });
            setOtpSent(true);
            setShowOtpModal(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEnquiry = async () => {
        if (!otp || otp.length < 4) {
            alert("Please enter a valid OTP");
            return;
        }

        setLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await verifyOtpAndCreateEnquiry({
                patientName: formData.patientName,
                phone: fullPhone,
                otp: otp,
                contactMode: "call",
                source: "homepage",
                country: formData.country === "Other" ? formData.otherCountry : formData.country,
                city: formData.city,
                medicalProblem: formData.medicalProblem,
                ageOrDob: formData.ageOrDob,
                specialtyId: null,
                surgeryId: null,
                doctorId: null,
            });

            alert("Thank you! Our assistant will contact you shortly.");
            setShowOtpModal(false);
            setOtpSent(false);
            setOtp("");
            setFormData({
                patientName: "",
                country: "",
                countryCode: "",
                city: "",
                phoneCode: "+91",
                phoneNumber: "",
                medicalProblem: "",
                ageOrDob: "",
            });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit enquiry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enquiry-box-container">
            <div className="enquiry-box">
                <h3>{t('form.title')}</h3>

                <form onSubmit={handleSendOtp}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder={t('form.patient_name')}
                            required
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <select
                            required
                            value={formData.country}
                            onChange={handleCountryChange}
                        >
                            <option value="">{t('form.select_country')}</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                            <option value="Other">{t('common.other') || "Other"}</option>
                        </select>
                    </div>

                    {formData.country === "Other" && (
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter Your Country"
                                required
                                value={formData.otherCountry}
                                onChange={(e) => setFormData({ ...formData, otherCountry: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <select
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!formData.countryCode || (formData.countryCode && cities.length === 0)}
                        >
                            <option value="">{loadingCities ? t('homepage.loading') : t('form.select_city')}</option>
                            {cities.map((city, idx) => (
                                <option key={idx} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                className="phone-number"
                                type="tel"
                                placeholder={t('form.phone')}
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder={t('form.medical_problem')}
                            value={formData.medicalProblem}
                            onChange={(e) => setFormData({ ...formData, medicalProblem: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder={t('form.age_example')}
                            required
                            value={formData.ageOrDob}
                            onChange={(e) => setFormData({ ...formData, ageOrDob: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? t('homepage.loading') : t('form.cta')}
                    </button>
                </form>

                <p className="privacy-text">
                    <Trans i18nKey="form.disclaimer">
                        By submitting the form I agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a> of .MedTour Health
                    </Trans>
                </p>
            </div>

            {showOtpModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Verify Phone Number</h3>
                        <p>We've sent an OTP to your phone number for verification.</p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSubmitEnquiry} disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Submit"}
                            </button>
                            <button className="close-btn" onClick={() => setShowOtpModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomepageEnquiryBox;
