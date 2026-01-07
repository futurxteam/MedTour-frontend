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

import UserDashboard from "./pages/Dashboards/UserDashboard/UserDashboard.jsx";
import DoctorDashboard from "./pages/Dashboards/DoctorDashboard/DoctorDashboard.jsx";
import PADashboard from "./pages/Dashboards/PADashboard/PADashboard.jsx";
import AdminDashboard from "./pages/Dashboards/AdminDashboard/AdminDashboard.jsx";

import MyAppointments from "./pages/Dashboards/UserDashboard/MyAppointments.jsx";

import PublicRoute from "./routes/PublicRoute";

import RoleLogin from "./pages/RoleLogin";
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
  path="/login/admin"
  element={
    <PublicRoute>
      <RoleLogin />
    </PublicRoute>
  }
/>
<Route
  path="/login/assistant"
  element={
    <PublicRoute>
      <RoleLogin />
    </PublicRoute>
  }
/>
<Route
  path="/login/doctor"
  element={
    <PublicRoute>
      <RoleLogin />
    </PublicRoute>
  }
/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
