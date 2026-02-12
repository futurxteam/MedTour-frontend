import React, { useState, useEffect } from "react";
import { getCountries, getCitiesByCountry, sendEnquiryOtp, verifyOtpAndCreateEnquiry } from "../api/api";
import "./HomepageEnquiryBox.css";

const HomepageEnquiryBox = () => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientName: "",
        country: "",
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
    }, []);

    const handleCountryChange = async (e) => {
        const countryName = e.target.value;
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

        setLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await sendEnquiryOtp({ phone: fullPhone });
            setOtpSent(true);
            setShowOtpModal(true);
        } catch (err) {
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEnquiry = async () => {
        if (otp !== "123") {
            alert("Invalid OTP. Use 123");
            return;
        }

        setLoading(true);
        try {
            const fullPhone = `${formData.phoneCode}${formData.phoneNumber}`;
            await verifyOtpAndCreateEnquiry({
                patientName: formData.patientName,
                phone: fullPhone,
                otp: otp,
                contactMode: "call", // Default for homepage
                source: "homepage",
                country: formData.country,
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
            alert("Failed to submit enquiry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enquiry-box-container">
            <div className="enquiry-box">
                <h3>Let Us Help You</h3>

                <form onSubmit={handleSendOtp}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Patient Name"
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
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <input
                            list="cities-list"
                            placeholder={loadingCities ? "Loading cities..." : "Select City"}
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!formData.countryCode || (formData.countryCode && cities.length === 0)}
                        />
                        <datalist id="cities-list">
                            {cities.map((city, idx) => (
                                <option key={idx} value={city.name} />
                            ))}
                        </datalist>
                    </div>

                    <div className="form-group phone-group">
                        <div className="phone-input-group">
                            <div className="country-code-display">{formData.phoneCode}</div>
                            <input
                                className="phone-number"
                                type="tel"
                                placeholder="Your Phone number"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder="Describe The Current Medical Problem (Optional) .."
                            value={formData.medicalProblem}
                            onChange={(e) => setFormData({ ...formData, medicalProblem: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Example: 30 Yrs or 29-05-1985"
                            required
                            value={formData.ageOrDob}
                            onChange={(e) => setFormData({ ...formData, ageOrDob: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Processing..." : "Get FREE Quote"}
                    </button>
                </form>

                <p className="privacy-text">
                    By submitting the form I agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a> of MedTour Health.
                </p>
            </div>

            {showOtpModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Verify Phone Number</h3>
                        <p>We've sent an OTP to your phone number for verification.</p>
                        <input
                            type="text"
                            placeholder="Enter OTP (123)"
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
