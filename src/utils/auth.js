import { jwtDecode } from "jwt-decode";

/**
 * Reads JWT from localStorage and returns decoded user
 * @returns { { id: string, role: string, iat: number, exp: number } | null }
 */
export const getAuthUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      token,              // ✅ ADD THIS
      id: decoded.id,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};


/**
 * Logout helper – clears auth and redirects
 */
export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};

/**
 * Optional helper: check if logged-in user has a specific role
 */
export const hasRole = (requiredRole) => {
  const user = getAuthUser();
  return user && user.role === requiredRole;
};
