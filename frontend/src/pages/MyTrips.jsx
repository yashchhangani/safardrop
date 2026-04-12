// src/pages/MyTrips.jsx
import { useEffect, useState } from 'react';
import { tripService } from '../services/api';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1; // TEMP: replace with logged-in user

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await tripService.getTripsByUser(userId);
        console.log("My Trips:", data);
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        alert("Failed to fetch trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading your trips...</p>;

  if (trips.length === 0) return <p className="text-center mt-10 text-gray-500">No trips found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      <div className="grid gap-4">
        {trips.map(trip => (
          <div
            key={trip.tripId}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">
              {trip.pickupLocation} → {trip.dropLocation}
            </h2>
            <p><strong>Date:</strong> {trip.travelDate}</p>
            <p><strong>Capacity:</strong> {trip.capacity} kg</p>
            <p><strong>Status:</strong> {trip.tripStatus}</p>
            <p><strong>Fare:</strong> ₹{trip.fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;