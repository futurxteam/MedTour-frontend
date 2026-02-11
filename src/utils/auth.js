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
    const storedUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    return {
      token,
      id: decoded.id,
      role: decoded.role,
      // Favor the stored user object for profile status as it updates without token refresh
      profileCompleted: storedUser?.profileCompleted ?? decoded.profileCompleted,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};


/**
 * Logout helper – clears auth and redirects
 */
export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/", { replace: true });
};

/**
 * Optional helper: check if logged-in user has a specific role
 */
export const hasRole = (requiredRole) => {
  const user = getAuthUser();
  return user && user.role === requiredRole;
};
