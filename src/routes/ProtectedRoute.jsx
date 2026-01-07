import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser } from "../utils/auth";

export default function ProtectedRoute({ role, children }) {
  const user = getAuthUser();

  // Not logged in
  if (!user?.token) {
  return <Navigate to="/login" replace />;
}


  // Logged in but wrong role
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
console.log("ProtectedRoute user:", user);


  // Authorized
  return children;
}
