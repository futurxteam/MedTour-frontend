import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import "../../styles/HospitalDashboard.css"; // Import the new styles
import { getHospitalDoctors, getHospitalSurgeries, getHospitalMe } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function HospitalHome() {
    const [stats, setStats] = useState({
        doctors: 0,
        surgeries: 0,
        profileCompleted: false,
        hospitalName: "",
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [docsRes, surgRes, meRes] = await Promise.all([
                    getHospitalDoctors(),
                    getHospitalSurgeries(),
                    getHospitalMe(),
                ]);

                setStats({
                    doctors: docsRes.data.length,
                    surgeries: surgRes.data.length,
                    profileCompleted: meRes.data.profile.profileCompleted,
                    hospitalName: meRes.data.profile.hospitalName || "Hospital",
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    return (
        <div className="hospital-content">
            <div className="page-head">
                <h3>Welcome back, {stats.hospitalName}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your hospital's operations.</p>
            </div>

            {!stats.profileCompleted && (
                <div className="alert-box warning" onClick={() => navigate("/dashboard/hospital/profile")} style={{ cursor: 'pointer' }}>
                    ⚠️ Your hospital profile is incomplete. Click here to complete it.
                </div>
            )}

            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => navigate("/dashboard/hospital/doctors")}>
                    <div className="card-icon">👨‍⚕️</div>
                    <h3>{stats.doctors}</h3>
                    <p>Total Doctors</p>
                    <span className="dashboard-btn">Manage Doctors</span>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/dashboard/hospital/surgeries")}>
                    <div className="card-icon">🏥</div>
                    <h3>{stats.surgeries}</h3>
                    <p>Active Surgeries</p>
                    <span className="dashboard-btn">Manage Surgeries</span>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/dashboard/hospital/assignments")}>
                    <div className="card-icon">📋</div>
                    <h3>Assignments</h3>
                    <p>Assign doctors to surgeries</p>
                    <span className="dashboard-btn">View Assignments</span>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/dashboard/hospital/profiles")}>
                    <div className="card-icon">📄</div>
                    <h3>Profiles</h3>
                    <p>Doctor profile status</p>
                    <span className="dashboard-btn">Check Status</span>
                </div>
            </div>
        </div>
    );
}
