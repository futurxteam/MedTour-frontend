const API_BASE_URL = "http://localhost:5000/api/auth";

/**
 * Signup API
 */
export const signupUser = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};

/**
 * Login API
 */
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

/**
 * Google Auth API
 */
export const googleAuth = async (data) => {
  const response = await fetch(`${API_BASE_URL}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Google auth failed");
  }

  return result;
};
export const createAdmin = async ({ name, email, password }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/auth/create-admin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
