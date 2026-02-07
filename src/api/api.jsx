import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

/* ===========================
   AXIOS INSTANCE
=========================== */
const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

/* ===========================
   JWT INTERCEPTOR - REQUEST
=========================== */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ===========================
   ERROR INTERCEPTOR - RESPONSE
=========================== */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* ===========================
   AUTH APIS
=========================== */
export const signupUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const googleAuth = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Google auth failed");
  return data;
};

/* ===========================
   ADMIN – USER MANAGEMENT
=========================== */
export const fetchUsers = ({
  page = 1,
  limit = 10,
  role = "",
  search = "",
}) =>
  API.get(
    `/admin/users?page=${page}&limit=${limit}&role=${role}&search=${search}`
  );

export const registerHospital = (data) =>
  API.post("/auth/register-hospital", data);

export const createUser = (data) =>
  API.post("/admin/users", data);

export const updateUser = (id, data) =>
  API.put(`/admin/users/${id}`, data);

export const toggleUserStatus = (id, active) =>
  API.patch(`/admin/users/${id}/status`, { active });


export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);


export const getHospitalSurgeries = () =>
  API.get("/hospital/surgeries");

export const addHospitalSurgery = (data) =>
  API.post("/hospital/surgeries", data);

export const toggleHospitalSurgery = (id) =>
  API.patch(`/hospital/surgeries/${id}/toggle`);

export const getHospitalMe = () =>
  API.get("/hospital/me");

export const getHospitalSpecializations = () =>
  API.get("/hospital/specializations");

export const getPublicSurgeriesMenu = () =>
  axios.get(`${API_BASE_URL}/api/public/surgeries-menu`);

export const getHospitalDoctors = () =>
  API.get("/hospital/doctors");

export const getSurgeriesBySpecialization = (specializationId) =>
  API.get(`/hospital/surgeries/by-specialization/${specializationId}`);

export const getSurgeriesByDoctor = (doctorId) =>
  API.get(`/hospital/surgeries/by-doctor/${doctorId}`);

export const updateDoctorSurgeries = (doctorId, surgeryIds) =>
  API.patch(`/hospital/doctors/${doctorId}/surgeries`, { surgeryIds });

export const assignDoctorToSurgery = (surgeryId, doctorId) =>
  API.post(`/hospital/surgeries/${surgeryId}/assign-doctor`, {
    doctorId,
  });

// PUBLIC – Services page only

export const getPublicSurgeriesBySpecialty = (specialtyId) =>
  API.get(`/public/specialties/${specialtyId}/public-surgeries`);

export const getPublicDoctorsBySurgery = (surgeryId) =>
  API.get(`/public/surgeries/${surgeryId}/public-doctors`);


/* ===========================
   EXPORT INSTANCE
=========================== */
export default API;

