import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = 2; // 🔥 TEMP: replace with logged-in user ID

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getBookingsByCustomer(customerId);
        console.log("My Bookings:", data);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center mt-12">Loading your bookings...</p>;
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto my-12 p-4">
      <h1 className="text-3xl font-bold mb-6">My Accepted Trips</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have not accepted any trips yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Trip ID: {booking.tripId}
              </h2>
              <p><strong>Fare:</strong> ₹{booking.amount}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Payment:</strong> {booking.paymentStatus}</p>
              <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;