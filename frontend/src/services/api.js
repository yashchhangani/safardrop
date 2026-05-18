import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8081/api";

const clearStoredUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("token");
};

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch {
      clearStoredUser();
    }
  }

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  return userId
    ? {
        userId: Number(userId),
        email: email || "",
        role: role || "",
        userName: userName || ""
      }
    : null;
};

const saveUserSession = (data) => {
  const existingUser = getStoredUser();
  const user = {
    userId: Number(data.userId),
    email: data.email || existingUser?.email || "",
    role: data.role || existingUser?.role || "",
    userName: data.userName || existingUser?.userName || ""
  };

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("userId", String(user.userId));
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.userName);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.userId) {
      saveUserSession(res.data);
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
  },

  logout: () => {
    clearStoredUser();
  }
};

export const userService = {
  getAllUsers: async () => {
    const res = await axiosInstance.get("/users");
    return res.data;
  },

  upgradeToTraveller: async (userId) => {
    const res = await axiosInstance.put(`/users/${Number(userId)}/role`, {
      role: "TRAVELLER"
    });

    saveUserSession({
      userId,
      role: res.data.role,
      token: res.data.token
    });

    return res.data;
  },

  switchOwnRole: async (userId, role) => {
    const res = await axiosInstance.put(`/users/${Number(userId)}/role`, { role });

    saveUserSession({
      userId,
      role: res.data.role,
      token: res.data.token
    });

    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await axiosInstance.put(`/users/${Number(userId)}/role`, {
      role
    });
    return res.data;
  }
};

export const tripService = {
  getAllTrips: async () => {
    const res = await axiosInstance.get(`/trips`);
    return res.data;
  },

  getTripById: async (tripId) => {
    const res = await axiosInstance.get(`/trips/${Number(tripId)}`);
    return res.data;
  },

  searchTrips: async (origin, destination) => {
    const res = await axiosInstance.get(
      `/trips/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    );
    return res.data;
  },

  createTrip: async (tripData) => {
    try {
      const res = await axiosInstance.post(`/trips`, tripData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create trip";
      throw new Error(message);
    }
  },

  getTripsByUser: async (userId) => {
    try {
      if (!userId) {
        return [];
      }

      const res = await axiosInstance.get(`/trips/my?userId=${Number(userId)}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching trips:", error);
      return [];
    }
  }
};

export const bookingService = {
  getAllBookings: async () => {
    const res = await axiosInstance.get("/bookings");
    return res.data;
  },

  createBooking: async (data) => {
    const user = getStoredUser();

    if (!user?.userId) {
      throw new Error("Please login to accept a ride.");
    }

    try {
      const res = await axiosInstance.post(`/bookings`, {
        ...data,
        customerId: Number(user.userId)
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create booking";
      throw new Error(message);
    }
  },

  getBookingById: async (bookingId) => {
    const res = await axiosInstance.get(`/bookings/${Number(bookingId)}`);
    return res.data;
  },

  getBookingsByCustomer: async (customerId) => {
    if (!customerId) {
      return [];
    }

    const res = await axiosInstance.get(
      `/bookings/customer/${Number(customerId)}`
    );

    return res.data;
  },

  getBookingsByTrip: async (tripId) => {
    if (!tripId) {
      return [];
    }

    const res = await axiosInstance.get(`/bookings/trip/${Number(tripId)}`);
    return res.data;
  }
};

export const paymentService = {
  createOrder: async (bookingId) => {
    try {
      const res = await axiosInstance.post("/payment/create-order", { bookingId });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create payment order";
      throw new Error(message);
    }
  },

  verifyPayment: async (payload) => {
    try {
      const res = await axiosInstance.post("/payment/verify", payload);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to verify payment";
      throw new Error(message);
    }
  },

  completeDemoPayment: async (bookingId) => {
    try {
      const res = await axiosInstance.post("/payment/demo-pay", { bookingId });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to complete demo payment";
      throw new Error(message);
    }
  }
};

export const notificationService = {
  getNotificationsByUser: async (userId) => {
    if (!userId) {
      return [];
    }

    const res = await axiosInstance.get(`/notifications/user/${Number(userId)}`);
    return res.data;
  }
};

export { clearStoredUser, getStoredUser };
