import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser } from "../utils/auth";

export default function PublicRoute({ children }) {
  const user = getAuthUser();

  // If user is logged in, redirect to their dashboard
  if (user?.token) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/dashboard/admin" replace />;
      case "doctor":
        return <Navigate to="/dashboard/doctor" replace />;
      case "assistant":
        return <Navigate to="/dashboard/pa" replace />;
      case "hospital":
        return <Navigate to="/dashboard/hospital" replace />;
      default:
        return <Navigate to="/dashboard/user" replace />;
    }
  }

  // Not logged in → allow access to public page
  return children;
}
