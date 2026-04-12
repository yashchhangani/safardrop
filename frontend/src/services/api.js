import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

/* ================= AXIOS INSTANCE ================= */
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

// ✅ Attach token automatically (if exists)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/* ================= AUTH SERVICE ================= */
export const authService = {

  // ✅ LOGIN (SAFE - works for both token & non-token)
  login: async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("LOGIN RESPONSE 👉", res.data);

    // ✅ Store user (always safe)
    localStorage.setItem("user", JSON.stringify(res.data));

    // ✅ Store token IF exists (for JWT case)
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  signup: async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  }
};


/* ================= TRIP SERVICE ================= */
export const tripService = {

  getAllTrips: async () => {
    const res = await axiosInstance.get(`/trips`);
    return res.data;
  },

  searchTrips: async (origin, destination) => {
    const res = await axiosInstance.get(
      `/trips/search?origin=${origin}&destination=${destination}`
    );
    return res.data;
  },

  createTrip: async (tripData) => {
    const res = await axiosInstance.post(`/trips`, tripData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  }
};


/* ================= BOOKING SERVICE ================= */
export const bookingService = {

  createBooking: async (data) => {

    // ✅ Get user (for non-token backend)
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axiosInstance.post(`/bookings`, {
      ...data,
      customerId: user?.id   // 👈 works if backend needs it
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return res.data;
  },

  getBookingsByCustomer: async (customerId) => {
    const res = await axiosInstance.get(`/bookings/customer/${customerId}`);
    return res.data;
  }
};