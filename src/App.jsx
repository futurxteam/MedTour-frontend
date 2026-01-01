import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/dashboards/UserDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import PADashboard from "./pages/dashboards/PADashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/pa" element={<PADashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
