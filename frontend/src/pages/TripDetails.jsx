import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tripService } from "../services/api";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const data = await tripService.getTripById(id);
        setTrip(data);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        alert("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading trip details...</p>;
  if (!trip) return <p className="text-center mt-10 text-gray-500">Trip not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Trip Details</h1>
      <div className="border p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold">
          {trip.origin} to {trip.destination}
        </h2>
        <p><strong>Pickup Area:</strong> {trip.pickupArea || "N/A"}</p>
        <p><strong>Drop Area:</strong> {trip.dropArea || "N/A"}</p>
        <p><strong>Traveller:</strong> {trip.ownerName || "Unknown"}</p>
        <p><strong>Contact:</strong> {trip.ownerEmail || "N/A"}</p>
        <p><strong>Date:</strong> {trip.travelDate}</p>
        <p><strong>Capacity:</strong> {trip.capacity} kg</p>
        <p><strong>Status:</strong> {trip.tripStatus}</p>
        <p><strong>Fare:</strong> Rs. {trip.fare}</p>
      </div>
    </div>
  );
};

export default TripDetails;
