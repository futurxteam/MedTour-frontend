import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../api/api";
import "./GlobalSearch.css";

const GlobalSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ doctors: [], surgeries: [], hospitals: [] });
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Debounced search
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({ doctors: [], surgeries: [], hospitals: [] });
            setShowResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await globalSearch(query);
                setResults(res.data);
                setShowResults(true);
            } catch (err) {
                console.error("Search error:", err);
                setResults({ doctors: [], surgeries: [], hospitals: [] });
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSurgeryClick = (surgery) => {
        navigate("/services", {
            state: {
                specialtyId: surgery.specialization._id,
                specialtyName: surgery.specialization.name,
                preSelectedSurgery: {
                    _id: surgery._id,
                    surgeryName: surgery.surgeryName
                }
            }
        });
        setShowResults(false);
        setQuery("");
    };

    const handleDoctorClick = (doctor) => {
        // Navigate to services page - you can enhance this to filter by doctor
        navigate("/services");
        setShowResults(false);
        setQuery("");
    };

    const handleHospitalClick = (hospital) => {
        // Navigate to hospital profile page (to be implemented)
        // For now, navigate to services
        navigate("/services");
        setShowResults(false);
        setQuery("");
    };

    const totalResults = results.doctors.length + results.surgeries.length + results.hospitals.length;

    return (
        <div className="global-search-container" ref={searchRef}>
            <div className="search-input-wrapper">
                <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    className="global-search-input"
                    placeholder="Search doctors, surgeries, hospitals..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setShowResults(true)}
                />
                {loading && <div className="search-spinner"></div>}
            </div>

            {showResults && (
                <div className="search-results-dropdown">
                    {totalResults === 0 ? (
                        <div className="search-no-results">
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            {/* Surgeries */}
                            {results.surgeries.length > 0 && (
                                <div className="search-result-group">
                                    <div className="search-group-header">
                                        <span className="search-group-icon">🩺</span>
                                        <span className="search-group-title">Surgeries</span>
                                        <span className="search-group-count">{results.surgeries.length}</span>
                                    </div>
                                    {results.surgeries.map((surgery) => (
                                        <div
                                            key={surgery._id}
                                            className="search-result-item"
                                            onClick={() => handleSurgeryClick(surgery)}
                                        >
                                            <div className="search-item-main">
                                                <div className="search-item-title">{surgery.surgeryName}</div>
                                                <div className="search-item-subtitle">
                                                    {surgery.specialization?.name} • {surgery.duration}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Doctors */}
                            {results.doctors.length > 0 && (
                                <div className="search-result-group">
                                    <div className="search-group-header">
                                        <span className="search-group-icon">👨‍⚕️</span>
                                        <span className="search-group-title">Doctors</span>
                                        <span className="search-group-count">{results.doctors.length}</span>
                                    </div>
                                    {results.doctors.map((doctor) => (
                                        <div
                                            key={doctor._id}
                                            className="search-result-item"
                                            onClick={() => handleDoctorClick(doctor)}
                                        >
                                            <div className="search-item-main">
                                                <div className="search-item-title">{doctor.name}</div>
                                                <div className="search-item-subtitle">
                                                    {doctor.hospitalName || "Medical Professional"}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hospitals */}
                            {results.hospitals.length > 0 && (
                                <div className="search-result-group">
                                    <div className="search-group-header">
                                        <span className="search-group-icon">🏥</span>
                                        <span className="search-group-title">Hospitals</span>
                                        <span className="search-group-count">{results.hospitals.length}</span>
                                    </div>
                                    {results.hospitals.map((hospital) => (
                                        <div
                                            key={hospital._id}
                                            className="search-result-item"
                                            onClick={() => handleHospitalClick(hospital)}
                                        >
                                            <div className="search-item-main">
                                                <div className="search-item-title">{hospital.name}</div>
                                                <div className="search-item-subtitle">
                                                    {hospital.city && hospital.state
                                                        ? `${hospital.city}, ${hospital.state}`
                                                        : "Healthcare Facility"}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
