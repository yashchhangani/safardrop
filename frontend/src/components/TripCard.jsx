// src/components/TripCard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Package, ArrowRight, MapPin, Navigation } from "lucide-react";
import { bookingService } from "../services/bookingService";

const TripCard = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ ADD THIS

  const handleAcceptRide = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to accept a ride.");
      return;
    }

    const tripId = trip.tripId;

    if (!tripId) {
      alert("Trip ID missing!");
      console.error("Trip object:", trip);
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.createBooking({
        tripId: tripId,
        customerId: user.userId,
        amount: trip.fare || 0
      });

      console.log("BOOKING RESPONSE 👉", response);

      // ✅ REDIRECT TO BOOKING PAGE
      navigate(`/booking/${response.bookingId}`);

    } catch (err) {
      console.log("ERROR 👉", err.response?.data);
      alert("Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

      <div className="flex justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400">From</p>
          <p className="font-bold flex items-center gap-1">
            <MapPin size={14} /> {trip.origin}
          </p>
        </div>

        <ArrowRight />

        <div>
          <p className="text-xs text-gray-400">To</p>
          <p className="font-bold flex items-center gap-1">
            {trip.destination} <Navigation size={14} />
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {trip.travelDate}
        </span>

        <span className="flex items-center gap-1 text-green-600">
          <Package size={14} /> {trip.capacity} kg
        </span>
      </div>

      <button
        onClick={handleAcceptRide}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2"
      >
        {loading ? "Processing..." : "Accept Ride"}
      </button>

      <Link to={`/trip/${trip.tripId}`}>
        <button className="w-full bg-gray-200 py-2 rounded-lg">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default TripCard;