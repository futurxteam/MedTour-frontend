import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import ServiceDetails from "./pages/serviceDetails";
import DoctorDetails from "./pages/doctorDetails";
import HospitalDashboard from "./pages/Dashboards/HospitalDashboard/HospitalDashboard.jsx";
import UserDashboard from "./pages/Dashboards/UserDashboard/UserDashboard.jsx";
import DoctorDashboard from "./pages/Dashboards/DoctorDashboard/DoctorDashboard.jsx";
import PADashboard from "./pages/Dashboards/PADashboard/PADashboard.jsx";
import AdminDashboard from "./pages/Dashboards/AdminDashboard/AdminDashboard.jsx";
import RegisterHospital from "@/pages/Dashboards/HospitalDashboard/RegisterHospital";
import MyAppointments from "./pages/Dashboards/UserDashboard/MyAppointments.jsx";

import DoctorProfile from "./pages/Dashboards/DoctorDashboard/DoctorProfile";
import PatientProfile from "./pages/Dashboards/UserDashboard/PatientProfile.jsx";
import HospitalProfile from "./pages/Dashboards/HospitalDashboard/HospitalProfile.jsx";
import AddDoctor from "./pages/Dashboards/HospitalDashboard/AddDoctor.jsx";
import HospitalDoctors from "./pages/Dashboards/HospitalDashboard/HospitalDoctors.jsx";
import AddSurgery from "./pages/Dashboards/HospitalDashboard/AddSurgery.jsx";
import HospitalSurgeries from "./pages/Dashboards/HospitalDashboard/HospitalSurgeries.jsx";
import AssignDoctorToSurgery from "./pages/Dashboards/HospitalDashboard/AssignDoctorToSurgery.jsx";
import HospitalHome from "./pages/Dashboards/HospitalDashboard/HospitalHome.jsx";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor/:doctorId" element={<DoctorDetails />} />
        <Route path="/surgery/:id" element={<ServiceDetails />} />
        <Route
          path="/register-hospital"
          element={<RegisterHospital />}
        />




        {/* User protected routes */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute role="user">
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* Doctor protected routes */}
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />


        {/* Care Assistant protected routes */}
        <Route
          path="/dashboard/pa"
          element={
            <ProtectedRoute role="assistant">
              <PADashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
          <Route path="/dashboard/hospital" element={<HospitalDashboard />}>
            <Route index element={<HospitalHome />} />
            <Route path="profile" element={<HospitalProfile />} />
            <Route path="doctors" element={
              <>
                <h3>Manage Hospital Doctors</h3>
                <AddDoctor />
              </>
            } />
            <Route path="profiles" element={
              <>
                <h3>Doctor Profile Completion Status</h3>
                <HospitalDoctors />
              </>
            } />
            <Route path="surgeries" element={
              <>
                <h3>Manage Surgeries & Treatment Packages</h3>
                <AddSurgery />
                <HospitalSurgeries />
              </>
            } />
            <Route
              path="assignments"
              element={<AssignDoctorToSurgery />}
            />
          </Route>
        </Route>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
