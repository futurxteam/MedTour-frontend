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

export const sendEnquiryOtp = (data) =>
  API.post("/public/enquiry/send-otp", data);

export const verifyOtpAndCreateEnquiry = (data) =>
  API.post("/public/enquiry/verify-otp", data);

export const getAllEnquiries = () =>
  API.get("/admin/enquiries");

export const assignPAtoEnquiry = (enquiryId, paId) =>
  API.post(`/admin/enquiries/${enquiryId}/assign-pa`, { paId });

export const updateEnquiryStatus = (enquiryId, status) =>
  API.patch(`/admin/enquiries/${enquiryId}/status`, { status });

// ASSISTANT APIS
export const getAssignedEnquiries = () =>
  API.get("/assistant/enquiries");

export const updateEnquiryStatusByAssistant = (id, status) =>
  API.patch(`/assistant/enquiries/${id}/status`, { status });

// Global Search
export const globalSearch = (query) =>
  API.get(`/public/search?q=${encodeURIComponent(query)}`);

// Geography APIS
export const getCountries = () =>
  API.get("/public/countries");

export const getCitiesByCountry = (countryCode) =>
  API.get(`/public/cities?country=${countryCode}`);

// SERVICE JOURNEY APIS - PA
export const startService = (enquiryId) =>
  API.post(`/assistant/enquiries/${enquiryId}/start-service`);

export const getAssignedJourneys = () =>
  API.get("/assistant/journeys");

export const getJourneyById = (journeyId) =>
  API.get(`/assistant/journeys/${journeyId}`);

export const addJourneyStage = (journeyId, stageData) =>
  API.post(`/assistant/journeys/${journeyId}/stages`, stageData);

export const updateJourneyStage = (journeyId, stageId, stageData) =>
  API.put(`/assistant/journeys/${journeyId}/stages/${stageId}`, stageData);

export const deleteJourneyStage = (journeyId, stageId) =>
  API.delete(`/assistant/journeys/${journeyId}/stages/${stageId}`);

export const reorderJourneyStages = (journeyId, stageOrder) =>
  API.patch(`/assistant/journeys/${journeyId}/reorder`, { stageOrder });

export const updateJourneyStatus = async (journeyId, status) =>
  API.patch(`/assistant/journeys/${journeyId}/status`, { status });

// MEDICAL RECORDS APIS – PA
export const addMedicalRecord = (journeyId, formData) =>
  API.post(`/assistant/journeys/${journeyId}/records`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getJourneyRecords = (journeyId) =>
  API.get(`/assistant/journeys/${journeyId}/records`);

// SERVICE JOURNEY APIS - Patient
export const getMyJourney = () =>
  API.get("/patient/my-journey");

export const getMyJourneyRecords = () =>
  API.get("/patient/my-journey/records");


/* ===========================
   EXPORT INSTANCE
=========================== */
export default API;
