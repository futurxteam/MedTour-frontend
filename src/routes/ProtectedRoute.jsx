import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser } from "../utils/auth";

export default function ProtectedRoute({ role, children }) {
  const user = getAuthUser();

  // Not logged in → go to general login
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (role && user.role !== role) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/dashboard/admin" replace />;
      case "doctor":
        return <Navigate to="/dashboard/doctor" replace />;
      case "assistant":
        return <Navigate to="/dashboard/pa" replace />;
      default:
        return <Navigate to="/dashboard/user" replace />;
    }
  }

  // Authorized → show protected page
  return children;
}
