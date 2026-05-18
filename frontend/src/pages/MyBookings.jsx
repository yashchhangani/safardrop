import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService, getStoredUser } from "../services/api";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const customerId = getStoredUser()?.userId;

        if (!customerId) {
          setError("User not logged in");
          setBookings([]);
          return;
        }

        const data = await bookingService.getBookingsByCustomer(customerId);
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center mt-12 text-gray-600">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-12 text-gray-500">You have not accepted any trips yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="border p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {booking.origin && booking.destination
                ? `${booking.origin} to ${booking.destination}`
                : `Trip ID: ${booking.tripId}`}
            </h2>

            <p>
              <strong>Traveller:</strong> {booking.tripOwnerName || "N/A"}
            </p>

            <p>
              <strong>Amount:</strong> Rs. {booking.amount}
            </p>

            <p>
              <strong>Status:</strong> {booking.status}
            </p>

            <p>
              <strong>Payment:</strong> {booking.paymentStatus}
            </p>

            <p>
              <strong>Pickup Area:</strong> {booking.pickupArea || "N/A"}
            </p>

            <p>
              <strong>Drop Area:</strong> {booking.dropArea || "N/A"}
            </p>

            <p>
              <strong>Travel Date:</strong> {booking.travelDate || "N/A"}
            </p>

            <p>
              <strong>Created At:</strong>{" "}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : "N/A"}
            </p>

            {booking.paymentStatus === "PAID" && (
                <button
                  onClick={() => navigate(`/pickup-map/${booking.bookingId}`)}
                  className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  View Pickup Map
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
