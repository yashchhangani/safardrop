import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

export const bookingService = {

  createBooking: async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/bookings`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return res.data;
    } catch (error) {
      console.error("Error creating booking:", error.response || error);
      throw error;
    }
  }

};