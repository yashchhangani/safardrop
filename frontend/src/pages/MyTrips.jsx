import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService, getStoredUser, tripService } from "../services/api";

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [bookingsByTrip, setBookingsByTrip] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const userId = getStoredUser()?.userId;

        if (!userId) {
          setTrips([]);
          return;
        }

        const data = await tripService.getTripsByUser(userId);
        const safeTrips = data || [];
        setTrips(safeTrips);

        const bookingsEntries = await Promise.all(
          safeTrips.map(async (trip) => {
            try {
              const bookings = await bookingService.getBookingsByTrip(trip.tripId);
              return [trip.tripId, bookings || []];
            } catch (bookingError) {
              console.error("Error fetching bookings for trip:", trip.tripId, bookingError);
              return [trip.tripId, []];
            }
          })
        );

        setBookingsByTrip(Object.fromEntries(bookingsEntries));
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading your trips...</p>;
  }

  if (trips.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No trips found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>

      <div className="grid gap-4">
        {trips.map((trip) => (
          <div
            key={trip.tripId}
            className="border p-4 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold">
              {trip.origin} to {trip.destination}
            </h2>

            <p>
              <strong>Date:</strong> {trip.travelDate}
            </p>

            <p>
              <strong>Pickup Area:</strong> {trip.pickupArea || "N/A"}
            </p>

            <p>
              <strong>Drop Area:</strong> {trip.dropArea || "N/A"}
            </p>

            <p>
              <strong>Capacity:</strong> {trip.capacity}
            </p>

            <p>
              <strong>Status:</strong> {trip.tripStatus}
            </p>

            <p>
              <strong>Fare:</strong> Rs. {trip.fare}
            </p>

            <p>
              <strong>Traveller:</strong> {trip.ownerName}
            </p>

            {(bookingsByTrip[trip.tripId] || [])
                .filter((booking) => booking.paymentStatus === "PAID")
                .map((booking) => (
                  <button
                    key={booking.bookingId}
                    onClick={() => navigate(`/pickup-map/${booking.bookingId}`)}
                    className="mt-3 mr-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  >
                    View Pickup Map (Booking #{booking.bookingId})
                  </button>
                ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;
