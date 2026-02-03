import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthUser } from "../utils/auth";
import React from "react";

export default function ProtectedRoute({ allowedRoles, role, children }) {
  const user = getAuthUser();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const pathname = location.pathname;

  // support shorthand `role="admin"` prop as used across the app
  const roles = allowedRoles || (role ? (Array.isArray(role) ? role : [role]) : undefined);

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Profile completion enforcement
  if (!user.profileCompleted) {
    switch (user.role) {
      case "user":
        if (!pathname.startsWith("/profile")) {
          return <Navigate to="/profile" replace />;
        }
        break;
      case "doctor":
        if (
          user.profileCompleted === false &&
          !pathname.startsWith("/dashboard/doctor/profile")
        ) {
          return <Navigate to="/dashboard/doctor/profile" replace />;
        }
        break;
      /* case "hospital":
        if (!pathname.startsWith("/register-hospital")) {
          return <Navigate to="/register-hospital" replace />;
        }
        break; */
      default:
        break;
    }
  }

  // Role authorization
  if (roles && !roles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/dashboard/admin" replace />;
      case "doctor":
        if (
          !pathname.startsWith("/dashboard/doctor/profile") &&
          pathname !== "/dashboard/doctor"
        ) {
          return <Navigate to="/dashboard/doctor/profile" replace />;
        }
        break;
      case "assistant":
        return <Navigate to="/dashboard/pa" replace />;
      case "hospital":
        return <Navigate to="/dashboard/hospital" replace />;
      case "user":
        return <Navigate to="/dashboard/user" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // ✅ REQUIRED FOR v6
  // If component was used as a wrapper with children, render them
  if (children) return children;

  // Otherwise render nested routes via Outlet
  return <Outlet />;
}
